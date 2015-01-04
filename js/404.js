var ref = new Firebase("https://infernonero.firebaseio.com");

function authDataCallback(authData) {
	if (authData) {
		console.log("User " + authData.uid + " is logged in with " + authData.provider);
		$('#social_media_wrapper').hide();
		$('#sign').hide();
		$('#logout').show();
		setUserName();
		$('#username').show();
		$('#compare').show();
		$('#manage').show();
	} else {
		console.log("User is logged out");
		$('#logout').hide();
		$('#username').hide();
		$('#compare').hide();
		$('#manage').hide();
		$('#social_media_wrapper').show();
		$('#sign').show();

	}
}

$(document).ready(function() {
	
	ref.onAuth(authDataCallback);

	$('#loggingout').click(function() {

		ref.unauth();
		window.location.href = "/index.html";

	});

}); 