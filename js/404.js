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
	
	$('#login_facebook_up').click(function() {

		ref.authWithOAuthPopup("facebook", function(error, authData) {
			if (error) {
				if (error.code === "TRANSPORT_UNAVAILABLE") {
					// fall-back to browser redirects, and pick up the session
					// automatically when we come back to the origin page
					ref.authWithOAuthRedirect("facebook", function(error, authData) {
						if (error) {
							console.log("Login Failed!", error);
						}
					});
				}

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
				if (error.code === "TRANSPORT_UNAVAILABLE") {
					// fall-back to browser redirects, and pick up the session
					// automatically when we come back to the origin page
					ref.authWithOAuthRedirect("google", function(error, authData) {
						if (error) {
							console.log("Login Failed!", error);
						}
					});
				}

			} else {
				console.log("Authenticated successfully with payload:", authData);

			}
		}, {
			remember : "default",
			scope : "email"
		});

	});

	$('#login_twitter_up').click(function() {

		ref.authWithOAuthPopup("twitter", function(error, authData) {
			if (error) {
				if (error.code === "TRANSPORT_UNAVAILABLE") {
					// fall-back to browser redirects, and pick up the session
					// automatically when we come back to the origin page
					ref.authWithOAuthRedirect("twitter", function(error, authData) {
						if (error) {
							console.log("Login Failed!", error);
						}
					});
				}

			} else {
				console.log("Authenticated successfully with payload:", authData);

			}
		}, {
			remember : "default",
			scope : "email"
		});

	});

}); 