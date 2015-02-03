var ref = new Firebase("https://infernonero.firebaseio.com");

function authDataCallback(authData) {
	if (authData) {
		$('#social_media_wrapper').hide();
		$('#sign').hide();
		$('#logout').show();
		$('#username').show();
		$('#compare').show();
		$('#manage').show();
	} else {
		$('#logout').hide();
		$('#username').hide();
		$('#compare').hide();
		$('#manage').hide();
		$('#social_media_wrapper').show();
		$('#sign').show();

	}
	setUserName();
}

$(document).ready(function() {
	
	ref.onAuth(authDataCallback);

	$('#loggingout').click(function() {

		ref.unauth();
		window.location.href = "/index.html";

	});

}); 