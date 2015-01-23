var ref = new Firebase("https://infernonero.firebaseio.com");

var authData = ref.getAuth();
if (authData) {
	if (authData.provider === "password") {
		history.go(-1);
	} else {
		history.go(-2);
	}
}

var idx = window.location.href.indexOf('?');
var previouspage = null;
if (idx > 0) {
	previouspage = (idx > 0) ? window.location.href.slice(idx + 1) : '';
}

var isNewUser = true;
ref.onAuth(function(authData) {
	if (authData && isNewUser) {
		// save the user's profile into Firebase so we can list users,
		// use them in Security and Firebase Rules, and show profiles
		ref.child("users").child(authData.uid).set(authData);
	}
});

$(document).ready(function() {

	$('#loggingout').click(function() {

		ref.unauth();
		location.reload();

	});

	$('#login_submit_btn').click(function() {

		var email = $('#txtEmail').val();

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
			$('#txtEmail').focus();
			return false;
		} else {
			var atpos = email.indexOf("@");
			var dotpos = email.lastIndexOf(".");
			if (atpos < 1 || dotpos < atpos + 2 || dotpos + 2 >= email.length) {
				$.growl("Please enter a valid email", {
					type : "danger",
					placement : {
						from : "top",
						align : "center"
					}
				});
				$('#txtEmail').focus();
				return false;
			}
		}

		if ($('#txtPass').val() === "") {
			$.growl("Please enter a password", {
				type : "danger",
				placement : {
					from : "top",
					align : "center"
				}
			});
			$('#txtPass').focus();
			return false;
		}

		var rememberVal = "sessionOnly";

		if ($("#rememberme").is(":checked")) {
			rememberVal = "default";
		}

		ref.authWithPassword({
			email : $('#txtEmail').val(),
			password : $('#txtPass').val()
		}, function(error, authData) {
			if (error) {
				$.growl("Login Failed!" + error, {
					type : "danger",
					delay : 10000,
					timer : 1000,
					placement : {
						from : "bottom",
						align : "center"
					}
				});

				console.log("Login Failed!", error);
			} else {
				$.growl("Authenticated successfully", {
					type : "success",
					placement : {
						from : "bottom",
						align : "center"
					}
				});
				console.log("Authenticated successfully with payload:", authData);
				if (previouspage === null) {
					location.reload();
				} else {
					window.location.href = previouspage;
				}

			}
		}, {
			remember : rememberVal
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

	$('#forget_email_btn').click(function() {
		var email = $('#txtEmail').val();

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
			$('#txtEmail').focus();

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
				$('#txtEmail').focus();

				return false;
			}
		}

		ref.resetPassword({
			email : $('#txtEmail').val()
		}, function(error) {
			if (error === null) {
				console.log("Password reset email sent successfully");
				$.growl("Password reset email sent successfully", {
					type : "success",
					placement : {
						from : "top",
						align : "center"
					}
				});
			} else {
				$.growl("Error sending password reset email : " + error, {
					type : "danger",
					delay : 10000,
					timer : 1000,
					placement : {
						from : "top",
						align : "center"
					}
				});
				console.log("Error sending password reset email:", error);
			}
		});

	});

	$('#login_facebook').click(function() {

		var rememberVal = "sessionOnly";

		if ($("#rememberme").is(":checked")) {
			rememberVal = "default";
		}

		ref.authWithOAuthPopup("facebook", function(error, authData) {
			if (error) {
				console.log("Login Failed!", error);
			} else {
				console.log("Authenticated successfully with payload:", authData);
				if (previouspage === null) {
					location.reload();
				} else {
					window.location.href = previouspage;
				}
			}
		}, {
			remember : rememberVal,
			scope : "email"
		});

	});

	$('#login_google').click(function() {

		var rememberVal = "sessionOnly";

		if ($("#rememberme").is(":checked")) {
			rememberVal = "default";
		}

		ref.authWithOAuthPopup("google", function(error, authData) {
			if (error) {
				console.log("Login Failed!", error);
			} else {
				console.log("Authenticated successfully with payload:", authData);
				if (previouspage === null) {
					location.reload();
				} else {
					window.location.href = previouspage;
				}
			}
		}, {
			remember : rememberVal,
			scope : "email"
		});

	});
	
	$('#login_twitter').click(function() {

		var rememberVal = "sessionOnly";

		if ($("#rememberme").is(":checked")) {
			rememberVal = "default";
		}

		ref.authWithOAuthPopup("twitter", function(error, authData) {
			if (error) {
				console.log("Login Failed!", error);
			} else {
				console.log("Authenticated successfully with payload:", authData);
				if (previouspage === null) {
					location.reload();
				} else {
					window.location.href =  previouspage;
				}
			}
		}, {
			remember : rememberVal,
			scope : "email"
		});

	});

});
