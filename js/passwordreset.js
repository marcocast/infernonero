var ref = new Firebase("https://infernonero.firebaseio.com");

var authData = ref.getAuth();


var isNewUser = true;
ref.onAuth(function(authData) {
	if (authData && isNewUser) {
		// save the user's profile into Firebase so we can list users,
		// use them in Security and Firebase Rules, and show profiles
		ref.child("users").child(authData.uid).set(authData);
	}
});

$(document).ready(function() {

	var idx = window.location.href.indexOf('?newpass=');
	var idxemail = window.location.href.indexOf('&email=');
	var oldPassword = window.location.href.substring(idx + 9, idxemail);
	var email = window.location.href.substring(idxemail + 7);

	$('#txtOldPass').val(oldPassword);
	$('#txtEmail').val(email);

	$('#loggingout').click(function() {

		ref.unauth();
		location.reload();

	});

	$('#reset_password_btn').click(function() {

		var email = $('#txtEmail').val();

		if (email === "") {
			$.growl("Please enter an email", {
				type : "danger",
				placement : {
					from : "top",
					align : "center"
				}
			});

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

			return false;
		}

		if ($('#txtOldPass').val() === "") {
			$.growl("Please enter the old password", {
				type : "danger",
				placement : {
					from : "top",
					align : "center"
				}
			});

			return false;
		}

		var rememberVal = "default";

		ref.changePassword({
			email : $('#txtEmail').val(),
			oldPassword : $('#txtOldPass').val(),
			newPassword : $('#txtPass').val()
		}, function(error) {
			if (error === null) {
				console.log("Password changed successfully");
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
						window.location.href = "compare.html";
						console.log("Authenticated successfully with payload:", authData);
					}
				}, {
					remember : rememberVal
				});
			} else {
				console.log("Error changing password:", error);
			}
		});

	});

});
