var ref = new Firebase('https://infernonero.firebaseio.com');

$('#logout').hide();

var authData = ref.getAuth();

var isNewUser = true;
ref.onAuth(function(authData) {

	if (authData) {

		window.location.href = "wall.html";

	} else {
		console.log("User is logged out");
		$('#logout').hide();
		$('#username').hide();
		$('#compare').hide();
		$('#manage').hide();
		$('#social_media_wrapper').show();
		$('#sign').show();

	}

});

$(document).ready(function() {

	setUserName();

	$('#snapshotsCarousel').carousel({
		interval : 5000
	});

	$('.carousel .item').each(function() {
		var next = $(this).next();
		if (!next.length) {
			next = $(this).siblings(':first');
		}
		next.children(':first-child').clone().appendTo($(this));

		for (var i = 0; i < 2; i++) {
			next = next.next();
			if (!next.length) {
				next = $(this).siblings(':first');
			}

			next.children(':first-child').clone().appendTo($(this));
		}
	});

	$('#loggingout').click(function() {

		ref.unauth();

	});

	$('#comparenow').click(function() {
		if (authData) {
			window.location.href = "wall.html";
		} else {
			window.location.href = "register.html?wall.html";
		}

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
				window.location.href = "wall.html";
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

	$('#register_submit_btn').click(function() {

		var email = $('#txtEmailr').val();

		if (email === "") {
			$.growl("Please enter an email", {
				type : "danger",
				delay : 10000,
				timer : 1000,
				placement : {
					from : "top",
					align : "center"
				}
			});
			$('#txtEmailr').focus();

			return false;
		} else {
			var atpos = email.indexOf("@");
			var dotpos = email.lastIndexOf(".");
			if (atpos < 1 || dotpos < atpos + 2 || dotpos + 2 >= email.length) {
				$.growl("Please enter a valid email", {
					type : "danger",
					delay : 10000,
					timer : 1000,
					placement : {
						from : "top",
						align : "center"
					}
				});
				$('#txtEmailr').focus();
				return false;
			}
		}

		if ($("#termsandcondition").is(":checked")) {
		} else {
			$.growl("Please read and accept the terms and conditions", {
				type : "danger",
				delay : 10000,
				timer : 1000,
				placement : {
					from : "top",
					align : "center"
				}
			});
			$('#termsandcondition').focus();

			return false;
		}

		var rememberVal = "sessionOnly";

		ref.createUser({
			email : $('#txtEmailr').val(),
			password : "tempPassword"
		}, function(error) {
			if (error === null) {
				ref.resetPassword({
					email : $('#txtEmailr').val()
				}, function(error) {
					if (error === null) {
						console.log("Email confirmtion sent successfully.");
						$.growl("Email confirmtion sent successfully. Follow the instruction in the email to activate your account", {
							type : "success",
							delay : 35000,
							timer : 1000,
							placement : {
								from : "top",
								align : "center"
							}
						});
					} else {
						$.growl("Error sending Email confirmtion : " + error, {
							type : "danger",
							delay : 10000,
							timer : 1000,
							placement : {
								from : "top",
								align : "center"
							}
						});
						console.log("Error sending Email confirmtion:", error);
					}
				});
			} else {
				$.growl("Error creating user : " + error, {
					type : "danger",
					delay : 10000,
					timer : 1000,
					placement : {
						from : "top",
						align : "center"
					}
				});
				console.log("Error creating user:", error);
			}
		});

	});

});
