var ref = new Firebase("https://infernonero.firebaseio.com");

function setUserNameWithDisqus(compare_id) {
	var authData = ref.getAuth();
	if (authData) {
		if (authData.provider === "facebook") {
			ref.child("users").child(authData.uid).child("facebook").once("value", function(snap) {
				username = snap.child("displayName").val();
				$('#username').html("Hi " + username);
				var useremail  = username.replace(" ","")+"@infernonero.firebaseapp.com";
				reset(compare_id, "http://commentscompare/#!/" + compare_id, "Title", 'en', disqusSignon(authData.uid,username,useremail ), getPubKey());
			});
		} else if (authData.provider === "google") {
			ref.child("users").child(authData.uid).child("google").once("value", function(snap) {
				username = snap.child("displayName").val();
				$('#username').html("Hi " + username);
				var useremail  = username.replace(" ","")+"@infernonero.firebaseapp.com";
				reset(compare_id, "http://commentscompare/#!/" + compare_id, "Title", 'en', disqusSignon(authData.uid,username,useremail ), getPubKey());
			});
		} else if (authData.provider === "twitter") {
			ref.child("users").child(authData.uid).child("twitter").once("value", function(snap) {
				username = snap.child("displayName").val();
				$('#username').html("Hi " + username);
				var useremail  = username.replace(" ","")+"@infernonero.firebaseapp.com";
				reset(compare_id, "http://commentscompare/#!/" + compare_id, "Title", 'en', disqusSignon(authData.uid,username,useremail ), getPubKey());
			});
		} else if (authData.provider === "password") {
			ref.child("users").child(authData.uid).child("password").once("value", function(snap) {
				email = snap.child("email").val();
				username = email.substr(0, email.indexOf("@"));
				$('#username').html("Hi " + username);
				var useremail  = username+"@infernonero.firebaseapp.com";
				reset(compare_id, "http://commentscompare/#!/" + compare_id, "Title", 'en', disqusSignon(authData.uid,username,email ), getPubKey());
			});
		}

	}
}

function setUserName() {
	var authData = ref.getAuth();
	if (authData) {

		if (authData.provider === "facebook") {
			ref.child("users").child(authData.uid).child("facebook").once("value", function(snap) {
				username = snap.child("displayName").val();
				$('#username').html("Hi " + username);
			});
		} else if (authData.provider === "google") {
			ref.child("users").child(authData.uid).child("google").once("value", function(snap) {
				username = snap.child("displayName").val();
				$('#username').html("Hi " + username);
			});
		} else if (authData.provider === "twitter") {
			ref.child("users").child(authData.uid).child("twitter").once("value", function(snap) {
				username = snap.child("displayName").val();
				$('#username').html("Hi " + username);
			});
		} else if (authData.provider === "password") {
			ref.child("users").child(authData.uid).child("password").once("value", function(snap) {
				email = snap.child("email").val();
				username = email.substr(0, email.indexOf("@"));
				$('#username').html("Hi " + username);
			});
		}

	}
}
