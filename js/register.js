var ref = new Firebase("https://infernonero.firebaseio.com");

var authData = ref.getAuth();
if (authData) {
	if (authData.provider === "password") {
		history.go(-1);
	} else {
		history.go(-2);
	}
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
				location.reload();
			}
		}, {
			remember : rememberVal
		});

	});

	$('#register_submit_btn').click(function() {

		var rememberVal = "sessionOnly";

		ref.createUser({
			email : $('#txtEmailr').val(),
			password : $('#txtPassr').val()
		}, function(error) {
			if (error === null) {
				console.log("User created successfully");
				ref.authWithPassword({
					email : $('#txtEmailr').val(),
					password : $('#txtPassr').val()

				}, function(error, authData) {
					if (error) {
						console.log("Login Failed!", error);
					} else {
						console.log("Authenticated successfully with payload:", authData);
						location.reload();
					}
				}, {
					remember : rememberVal
				});
			} else {
				console.log("Error creating user:", error);
			}
		});

	});

	$('#forget_email_btn').click(function() {

		ref.resetPassword({
			email : $('#txtEmail').val()
		}, function(error) {
			if (error === null) {
				console.log("Password reset email sent successfully");
			} else {
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
				location.reload();
			}
		}, {
			remember : rememberVal
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
				location.reload();
			}
		}, {
			remember : rememberVal
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
				location.reload();
			}
		}, {
			remember : rememberVal
		});

	});

	$('#forget_email_btn').click(function() {

		ref.resetPassword({
			email : $('#txtEmailr').val()
		}, function(error) {
			if (error === null) {
				$.growl("Password reset email sent successfully", {
					type : "success",
					placement : {
						from : "bottom",
						align : "center"
					}
				});
				console.log("Password reset email sent successfully");
			} else {
				console.log("Error sending password reset email:", error);
			}
		});

	});

});
