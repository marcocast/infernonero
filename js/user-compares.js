var ref = new Firebase("https://infernonero.firebaseio.com");

var authData = ref.getAuth();
if (authData) {

} else {
	window.location.href = "/register.html";
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
	}else if(voteOne > voteTwo) {
		$('#vote_one' + id).removeClass("label-primary");
		$('#vote_one' + id).removeClass("label-danger");
		$('#vote_one' + id).addClass("label-success");

		$('#vote_two' + id).removeClass("label-primary");
		$('#vote_two' + id).removeClass("label-success");
		$('#vote_two' + id).addClass("label-danger");
	}else if(voteOne < voteTwo) {
		$('#vote_one' + id).removeClass("label-primary");
		$('#vote_one' + id).removeClass("label-success");
		$('#vote_one' + id).addClass("label-danger");

		$('#vote_two' + id).removeClass("label-primary");
		$('#vote_two' + id).removeClass("label-danger");
		$('#vote_two' + id).addClass("label-success");
	}

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

			if (ss.child("compare_id").val() === null) {
			} else {
				var refCompare = new Firebase("https://infernonero.firebaseio.com/compares/" + ss.child("compare_id").val());

				refCompare.once("value", function(snapshot) {

					var refCompareVotes = new Firebase("https://infernonero.firebaseio.com/compares-votes/" + ss.child("compare_id").val());
					refCompareVotes.once("value", function(snapshotvotes) {

						var dateOfCompare = new Date(snapshot.child("date").val());

						var button = "<a id='action" + ss.child("compare_id").val() + "' class='btn btn-success' onclick=\"closeOpenVotes('" + ss.child("compare_id").val() + "');\"> Open</a>";

						if (snapshot.child("closed").val()) {
							button = "<a id='action" + ss.child("compare_id").val() + "' class='btn btn-danger' onclick=\"closeOpenVotes('" + ss.child("compare_id").val() + "');\"> Closed</a>";
						}

						table.prepend("<tr>" + "<td><a href='edit_compare.html#" + ss.key() + "'>" + snapshot.child("txt_title").val() + "</a></td>" + "<td><span class='label label-primary' id='vote_one" + ss.child("compare_id").val() + "'>" + snapshotvotes.child("vote_one").val() + "</span> " + snapshot.child("txt_one").val() + " VS " + snapshot.child("txt_two").val() + " <span class='label label-primary' id='vote_two" + ss.child("compare_id").val() + "'>" + snapshotvotes.child("vote_two").val() + "</span></td>" + "<td>" + dateOfCompare.getDate() + "/" + (parseInt(dateOfCompare.getMonth()) + parseInt(1)) + "/" + dateOfCompare.getFullYear() + "</td><td>" + button + "</td></tr>");
						setVotes(ss.child("compare_id").val(),snapshotvotes.child("vote_one").val(), snapshotvotes.child("vote_two").val());
						listenOnChanges(ss.child("compare_id").val());
					}, function(errorObject) {
					});

				}, function(errorObject) {
				});

			}

		});
	}, function(errorObject) {
	});

});
