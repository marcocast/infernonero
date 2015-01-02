var ref = new Firebase("https://infernonero.firebaseio.com");

function setUserName() {
	var authData = ref.getAuth();
	if (authData) {

		if (authData.provider === "facebook") {
			ref.child("users").child(authData.uid).child("facebook").once("value", function(snap) {
				$('#username').html("Hi " + snap.child("displayName").val());
			});
		} else if (authData.provider === "google") {
			ref.child("users").child(authData.uid).child("google").once("value", function(snap) {
				$('#username').html("Hi " + snap.child("displayName").val());
			});
		} else if (authData.provider === "twitter") {
			ref.child("users").child(authData.uid).child("twitter").once("value", function(snap) {
				$('#username').html("Hi " + snap.child("displayName").val());
			});
		} else if (authData.provider === "password") {
			ref.child("users").child(authData.uid).child("password").once("value", function(snap) {
				email = snap.child("email").val();
				$('#username').html("Hi " + email.substr(0, email.indexOf("@")));
			});
		}

	}

	return username;
}

function getUserEmail() {
	var email = "";

	var authData = ref.getAuth();
	if (authData) {

		if (authData.provider === "facebook") {
			ref.child("users").child(authData.uid).child("facebook").once("value", function(snap) {
				username = snap.child("displayName").val();
				email = username.replace(" ", ".") + "@infernonero.com";
			});
		} else if (authData.provider === "google") {
			ref.child("users").child(authData.uid).child("google").once("value", function(snap) {
				username = snap.child("displayName").val();
				email = username.replace(" ", ".") + "@infernonero.com";
			});
		} else if (authData.provider === "twitter") {
			ref.child("users").child(authData.uid).child("twitter").once("value", function(snap) {
				username = snap.child("displayName").val();
				email = username.replace(" ", ".") + "@infernonero.com";
			});
		} else if (authData.provider === "password") {
			ref.child("users").child(authData.uid).child("password").once("value", function(snap) {
				email = snap.child("email").val();
			});
		}

	}
	return email;
}