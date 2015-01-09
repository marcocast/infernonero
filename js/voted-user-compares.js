var ref = new Firebase("https://infernonero.firebaseio.com");

var authData = ref.getAuth();
if (authData) {

} else {
	window.location.href = "/register.html";
}

$(document).ready(function() {

	setUserName();

	$('#loggingout').click(function() {

		ref.unauth();
		window.location.href = "/index.html";

	});
	
	var table = $("#example tbody");
	
    table.html("<img src='images/468.GIF' />");

	var refCompares = new Firebase("https://infernonero.firebaseio.com/voted-user-compares/" + authData.uid);
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

					var dateOfCompare = new Date(snapshot.child("date").val());

					table.prepend("<tr>" + "<td><a href='vote.html#" + ss.child("compare_id").val() + "'>" + snapshot.child("txt_title").val() + "</a></td>" + "<td><span class='badge'>" + snapshot.child("vote_one").val() + "</span> " + snapshot.child("txt_one").val() + " VS " + snapshot.child("txt_two").val() + " <span class='badge'>" + snapshot.child("vote_two").val() + "</span></td>" + "<td>" + dateOfCompare.getDate() + "/" + (parseInt(dateOfCompare.getMonth()) + parseInt(1)) + "/" + dateOfCompare.getFullYear() + "</td>" + "</tr>");
				}, function(errorObject) {
				});

			}

		});
	}, function(errorObject) {
	});

});
