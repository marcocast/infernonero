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

function removeCompare(id, userComparesId) {
	var comparesRef = ref.child("compares").child(id);
	comparesRef.remove();

	var comparesRef = ref.child("compares-votes").child(id);
	comparesRef.remove();

	var comparesImagesRef = ref.child("compares-images").child(id);
	comparesImagesRef.remove();

	var usersComparesRef = ref.child("users-compares").child(authData.uid).child(userComparesId);
	usersComparesRef.remove();

	var votesRef = ref.child("votes").child(id);
	votesRef.remove();

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

	refVotes.on('value', function(snapshot) {

		var voters_one = "";
		var voters_two = "";

		snapshot.forEach(function(ss) {
			ref.child("users").child(ss.key()).once('value', function(usersnap) {

				var usernameLocation = "displayName";

				var provider = usersnap.child("provider").val();

				if (provider === "password") {
					usernameLocation = "email";
				}
				if (ss.child("vote").val() === "1") {
					voters_one = voters_one + "   " + usersnap.child(provider).child(usernameLocation).val();
					$('#vote_one' + id).removeAttr("data-original-title");
					$('#vote_one' + id).attr("data-original-title", voters_one);
				} else {
					voters_two = voters_two + "   " + usersnap.child(provider).child(usernameLocation).val();
					$('#vote_two' + id).removeAttr("data-original-title");
					$('#vote_two' + id).attr("data-original-title", voters_two);
				}

			});
		});

	});

	$('#vote_one' + id).text(voteOne);
	$('#vote_two' + id).text(voteTwo);
}


$(document).ready(function() {

	setUserName();

	$('#loggingout').click(function() {

		ref.unauth();
		window.location.href = "/index.html";

	});

	var table = $("#example tbody");

	table.html("<img src='images/468.GIF' />");

	var refCompares = new Firebase("https://infernonero.firebaseio.com/users-compares/" + authData.uid);
	// Attach an asynchronous callback to read the data at our posts reference
	refCompares.on("value", function(snapshot) {

		$('#loadone').hide();

		table.html("");

		// iterate all the elements :((
		snapshot.forEach(function(ss) {

			var userComparesId = ss.key();

			var compareId = ss.child("compare_id").val();

			if (compareId === null) {
			} else {
				var refCompare = new Firebase("https://infernonero.firebaseio.com/compares/" + compareId);

				refCompare.once("value", function(snapshot) {

					var refCompareVotes = new Firebase("https://infernonero.firebaseio.com/compares-votes/" + compareId);
					refCompareVotes.once("value", function(snapshotvotes) {

						var postsRefImages = ref.child("compares-images").child(compareId);

						postsRefImages.once("value", function(snapshotimages) {
							var dateOfCompare = new Date(snapshot.child("date").val());

							var buttonRemove = "<a class='btn btn-danger' onclick=\"removeCompare('" + compareId + "','" + userComparesId + "');\"><i class='fa fa-remove'></i> Remove</a>";

							var buttonVoting = "<a id='action" + compareId + "' class='btn btn-success' onclick=\"closeOpenVotes('" + compareId + "');\"> Open</a>";

							if (snapshot.child("closed").val()) {
								buttonVoting = "<a id='action" + compareId + "' class='btn btn-danger' onclick=\"closeOpenVotes('" + compareId + "');\"> Closed</a>";
							}

							var title = snapshot.child("txt_title").val();
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

							table.prepend("<tr>" + "<td><a href='edit_compare.html#" + ss.key() + "'>" + title + "</a></td>" + "<td><span data-toggle='popover' title='' data-content='Voters' class='label label-primary' id='vote_one" + compareId + "'>" + snapshotvotes.child("vote_one").val() + "</span> " + txt_one + " VS " + txt_two + " <span  data-toggle='popover' title='' data-content='Voters' class='label label-primary' id='vote_two" + compareId + "'>" + snapshotvotes.child("vote_two").val() + "</span></td>" + "<td>" + dateOfCompare.getDate() + "/" + (parseInt(dateOfCompare.getMonth()) + parseInt(1)) + "/" + dateOfCompare.getFullYear() + "</td><td>" + buttonVoting + "</td><td>" + buttonRemove + "</td></tr>");
							$(".label").tooltip({
								placement : "top"

							});
							setVotes(compareId, snapshotvotes.child("vote_one").val(), snapshotvotes.child("vote_two").val());
							listenOnChanges(compareId);

						});

					}, function(errorObject) {
					});

				}, function(errorObject) {
				});

			}

		});
	}, function(errorObject) {
	});

});
