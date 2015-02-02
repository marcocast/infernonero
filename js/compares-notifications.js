var ref = new Firebase("https://infernonero.firebaseio.com");

$(document).ready(function() {

	var authData = ref.getAuth();
	if (authData) {
		var refCompares = new Firebase("https://infernonero.firebaseio.com/users-compares/" + authData.uid);
		// Attach an asynchronous callback to read the data at our posts reference
		refCompares.on("value", function(snapshot) {

			// iterate all the elements :((
			snapshot.forEach(function(ss) {

				if (ss.child("compare_id").val() === null) {
				} else {
					var refCompare = new Firebase("https://infernonero.firebaseio.com/compares/" + ss.child("compare_id").val());
					refCompare.once("value", function(refComparesnapshot) {

						var refCompareVotes = new Firebase("https://infernonero.firebaseio.com/compares-votes/" + ss.child("compare_id").val());

						refCompareVotes.on("child_changed", function(snapshotvotes) {

							$.growl({
								message : "<strong>You just received a vote for : " + refComparesnapshot.child("txt_title").val() + "</strong>",
								url : "https://www.choozzy.com/edit_compare.html#" + ss.key()
							}, {
								type : "warning",
								delay: 10000,
								placement : {
									from : "top",
									align : "right"
								},
								animate : {
									enter : 'animated bounceIn',
									exit : 'animated bounceOut'
								}
							});
						}, function(errorObject) {
						});

					}, function(errorObject) {
					});

				}

			});
		}, function(errorObject) {
		});
	}

});
