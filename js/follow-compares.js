var ref = new Firebase("https://infernonero.firebaseio.com");

var authData = ref.getAuth();
if (authData) {

} else {
	window.location.href = "/register.html?user-compares.html";
}

function closeOpenVotes(id) {
	var refOpenclose = new Firebase("https://infernonero.firebaseio.com/compares/" + id);

	var closedOrOpen = false;

	refOpenclose.once('value', function(snap) {
		if (snap.child("closed").val()) {
			refOpenclose.update({
				closed : false
			});
		} else {
			refOpenclose.update({
				closed : true
			});
		}

	});

}

function listenOnChanges(id) {

	var refOpenclose = new Firebase("https://infernonero.firebaseio.com/compares/" + id);

	refOpenclose.on('child_changed', function(snapshot) {
		refOpenclose.once('value', function(snap) {
			if (snap.child("closed").val()) {
				$('#action' + id).text("Closed");
				$('#action' + id).removeClass("btn-success");
				$('#action' + id).addClass("btn-danger");
			} else {
				$('#action' + id).text("Open");
				$('#action' + id).removeClass("btn-danger");
				$('#action' + id).addClass("btn-success");
			}
		});

	});

	var refCompareVotes = new Firebase("https://infernonero.firebaseio.com/compares-votes/" + id);

	refCompareVotes.on('child_changed', function(snapshot) {
		refCompareVotes.once('value', function(snap) {
			setVotes(id, snap.child("vote_one").val(), snap.child("vote_two").val());
		});
	});

}

function setVotes(id, voteOne, voteTwo) {

	if (voteOne === voteTwo) {
		$('#vote_one' + id).removeClass("label-danger");
		$('#vote_one' + id).removeClass("label-success");
		$('#vote_one' + id).addClass("label-primary");

		$('#vote_two' + id).removeClass("label-danger");
		$('#vote_two' + id).removeClass("label-success");
		$('#vote_two' + id).addClass("label-primary");
	} else if (voteOne > voteTwo) {
		$('#vote_one' + id).removeClass("label-primary");
		$('#vote_one' + id).removeClass("label-danger");
		$('#vote_one' + id).addClass("label-success");

		$('#vote_two' + id).removeClass("label-primary");
		$('#vote_two' + id).removeClass("label-success");
		$('#vote_two' + id).addClass("label-danger");
	} else if (voteOne < voteTwo) {
		$('#vote_one' + id).removeClass("label-primary");
		$('#vote_one' + id).removeClass("label-success");
		$('#vote_one' + id).addClass("label-danger");

		$('#vote_two' + id).removeClass("label-primary");
		$('#vote_two' + id).removeClass("label-danger");
		$('#vote_two' + id).addClass("label-success");
	}

	var refVotes = new Firebase("https://infernonero.firebaseio.com/votes/" + id);

}

function populateTable() {

	var table = $("#example tbody");

	var refCompares = new Firebase("https://infernonero.firebaseio.com/follow-compares/" + authData.uid);
	refCompares.on("value", function(followsnapshot) {

		$('#loadone').hide();

		table.html("");

		// iterate all the elements :((
		followsnapshot.forEach(function(ss) {

			var userComparesId = ss.key();

			var compareId = ss.child("compare_id").val();

			if (compareId === null) {
			} else {
				var refCompare = new Firebase("https://infernonero.firebaseio.com/compares/" + compareId);

				refCompare.once("value", function(snapshot) {

					var title = snapshot.child("txt_title").val();

					if (title === null) {
						table.html("");
						refCompares.child(compareId).remove();
					} else {
						var refCompareVotes = new Firebase("https://infernonero.firebaseio.com/compares-votes/" + compareId);
						refCompareVotes.once("value", function(snapshotvotes) {

							var postsRefImages = ref.child("compares-images").child(compareId);

							postsRefImages.once("value", function(snapshotimages) {
								var dateOfCompare = new Date(snapshot.child("date").val());
								
								var fullTitle = snapshot.child("txt_title").val();
								var txt_one = snapshot.child("txt_one").val();
								var txt_two = snapshot.child("txt_two").val();

								if (title.length > 15) {
									title = title.substring(0, 10) + "...";
								}

								var payloadOne = snapshotimages.child("file_one").val();

								if (payloadOne !== null && payloadOne !== "") {
									var img = new Image();
									img.src = payloadOne;
									txt_one = "<img src='" + payloadOne + "' height='40' width='40'>";
								} else if (txt_one.length > 20) {
									txt_one = txt_one.substring(0, 15) + "...";
								}

								var payloadTwo = snapshotimages.child("file_two").val();

								if (payloadOne !== null && payloadOne !== "") {
									var img = new Image();
									img.src = payloadTwo;
									txt_two = "<img src='" + payloadTwo + "' height='40' width='40'>";
								} else if (txt_two.length > 20) {
									txt_two = txt_two.substring(0, 15) + "...";
								}

								table.prepend("<tr>" + "<td><a data-toggle='tooltip' data-placement='top' title='"+fullTitle+"' href='vote.html#" + ss.key() + "'>" + title + "</a></td>" + "<td><span data-toggle='popover' title='' data-content='Voters' class='label label-primary' id='vote_one" + compareId + "'>" + snapshotvotes.child("vote_one").val() + "</span> " + txt_one + " VS " + txt_two + " <span  data-toggle='popover' title='' data-content='Voters' class='label label-primary' id='vote_two" + compareId + "'>" + snapshotvotes.child("vote_two").val() + "</span></td>" + "<td>" + dateOfCompare.getDate() + "/" + (parseInt(dateOfCompare.getMonth()) + parseInt(1)) + "/" + dateOfCompare.getFullYear() + "</td></tr>");
								$(".label").tooltip({
									placement : "top"

								});
								setVotes(compareId, snapshotvotes.child("vote_one").val(), snapshotvotes.child("vote_two").val());
								listenOnChanges(compareId);

							});

						}, function(errorObject) {
						});
					}

				}, function(errorObject) {
				});

				refCompare.on("child_removed", function(snapshot) {
					table.html("");
					refCompares.child(compareId).remove();
				});

			}

		});
	}, function(errorObject) {
	});
}


$(document).ready(function() {

	setUserName();

	$('#loggingout').click(function() {

		ref.unauth();
		window.location.href = "/index.html";

	});

	var table = $("#example tbody");

	table.html("<img src='images/468.GIF' />");

	populateTable();

});
