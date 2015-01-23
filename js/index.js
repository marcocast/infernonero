var ref = new Firebase('https://infernonero.firebaseio.com');

$('#logout').hide();

var authData = ref.getAuth();

var isNewUser = true;
ref.onAuth(function(authData) {
	if (authData && isNewUser) {
		ref.child("users").child(authData.uid).set(authData);
	}
});

function authDataCallback(authData) {
	if (authData) {
		console.log("User " + authData.uid + " is logged in with " + authData.provider);
		$('#social_media_wrapper').hide();
		$('#sign').hide();
		$('#logout').show();
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
	setUserName();

}


$(document).ready(function() {

	ref.onAuth(authDataCallback);

	$('#loggingout').click(function() {

		ref.unauth();

	});
	
	$('#comparenow').click(function() {
		if (authData) {
			window.location.href = "compare.html";
		}else{
			window.location.href = "register.html?compare.html";
		}
		

	});

	$('#login_facebook_up').click(function() {

		ref.authWithOAuthPopup("facebook", function(error, authData) {
			if (error) {
				console.log("Login Failed!", error);
			} else {
				console.log("Authenticated successfully with payload:", authData);
				window.location.href = "compare.html";
			}
		}, {
			remember : "default",
			scope : "email"
		});

	});

	$('#login_google_up').click(function() {

		ref.authWithOAuthPopup("google", function(error, authData) {
			if (error) {
				console.log("Login Failed!", error);
			} else {
				console.log("Authenticated successfully with payload:", authData);
				window.location.href = "compare.html";

			}
		}, {
			remember : "default",
			scope : "email"
		});

	});
	
	$('#login_twitter_up').click(function() {

		ref.authWithOAuthPopup("twitter", function(error, authData) {
			if (error) {
				console.log("Login Failed!", error);
			} else {
				console.log("Authenticated successfully with payload:", authData);
				window.location.href = "compare.html";

			}
		}, {
			remember : "default",
			scope : "email"
		});

	});


});
