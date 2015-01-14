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
				$('#action' + id).text("Open Voting");
				$('#action' + id).removeClass("btn-danger");
				$('#action' + id).addClass("btn-success");
			} else {
				$('#action' + id).text("Close Voting");
				$('#action' + id).removeClass("btn-sucess");
				$('#action' + id).addClass("btn-danger");
			}
		});

	});

	var refCompareVotes = new Firebase("https://infernonero.firebaseio.com/compares-votes/" + id);

	refCompareVotes.on('child_changed', function(snapshot) {
		refCompareVotes.once('value', function(snap) {
			$('#vote_one' + id).text(snap.child("vote_one").val());
			$('#vote_two' + id).text(snap.child("vote_two").val());
		});
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

						var button = "<a id='action" + ss.child("compare_id").val() + "' class='btn btn-danger' onclick=\"closeOpenVotes('" + ss.child("compare_id").val() + "');\"> Close Voting</a>";

						if (snapshot.child("closed").val()) {
							button = "<a id='action" + ss.child("compare_id").val() + "' class='btn btn-success' onclick=\"closeOpenVotes('" + ss.child("compare_id").val() + "');\"> Open Voting</a>";
						}

						table.prepend("<tr>" + "<td><a href='edit_compare.html#" + ss.key() + "'>" + snapshot.child("txt_title").val() + "</a></td>" + "<td><span class='badge' id='vote_one" + ss.child("compare_id").val() + "'>" + snapshotvotes.child("vote_one").val() + "</span> " + snapshot.child("txt_one").val() + " VS " + snapshot.child("txt_two").val() + " <span class='badge' id='vote_two" + ss.child("compare_id").val() + "'>" + snapshotvotes.child("vote_two").val() + "</span></td>" + "<td>" + dateOfCompare.getDate() + "/" + (parseInt(dateOfCompare.getMonth()) + parseInt(1)) + "/" + dateOfCompare.getFullYear() + "</td><td>" + button + "</td></tr>");
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
