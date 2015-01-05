var ref = new Firebase("https://infernonero.firebaseio.com");

function setUserNameWithDisqus(compare_id,title) {
	var authData = ref.getAuth();
	if (authData) {
		if (authData.provider === "facebook") {
			ref.child("users").child(authData.uid).child("facebook").once("value", function(snap) {
				username = snap.child("displayName").val();
				$('#dropdownMenu1').html(username +" <span class='caret'></span>");
				var useremail  = username.replace(" ","")+"@infernonero.firebaseapp.com";
				reset(compare_id, "http://infernonero.firebaseapp.com/disqus.html/#!/" + compare_id, title, 'en', disqusSignon(authData.uid,username,useremail ), getPubKey());
				$('#disqus_thread').show();
			});
		} else if (authData.provider === "google") {
			ref.child("users").child(authData.uid).child("google").once("value", function(snap) {
				username = snap.child("displayName").val();
				$('#dropdownMenu1').html(username +" <span class='caret'></span>");
				var useremail  = username.replace(" ","")+"@infernonero.firebaseapp.com";
				reset(compare_id, "http://infernonero.firebaseapp.com/disqus.html/#!/" + compare_id, title, 'en', disqusSignon(authData.uid,username,useremail ), getPubKey());
				$('#disqus_thread').show();
			});
		} else if (authData.provider === "twitter") {
			ref.child("users").child(authData.uid).child("twitter").once("value", function(snap) {
				username = snap.child("displayName").val();
				$('#dropdownMenu1').html(username +" <span class='caret'></span>");
				var useremail  = username.replace(" ","")+"@infernonero.firebaseapp.com";
				reset(compare_id, "http://infernonero.firebaseapp.com/disqus.html/#!/" + compare_id, title, 'en', disqusSignon(authData.uid,username,useremail ), getPubKey());
				$('#disqus_thread').show();
			});
		} else if (authData.provider === "password") {
			ref.child("users").child(authData.uid).child("password").once("value", function(snap) {
				email = snap.child("email").val();
				username = email.substr(0, email.indexOf("@"));
				$('#dropdownMenu1').html(username +" <span class='caret'></span>");
				var useremail  = username+"@infernonero.firebaseapp.com";
				reset(compare_id, "http://infernonero.firebaseapp.com/disqus.html/#!/" + compare_id, title, 'en', disqusSignon(authData.uid,username,useremail ), getPubKey());
				$('#disqus_thread').show();
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
				$('#dropdownMenu1').html(username +" <span class='caret'></span>");
			});
		} else if (authData.provider === "google") {
			ref.child("users").child(authData.uid).child("google").once("value", function(snap) {
				username = snap.child("displayName").val();
				$('#dropdownMenu1').html(username +" <span class='caret'></span>");
			});
		} else if (authData.provider === "twitter") {
			ref.child("users").child(authData.uid).child("twitter").once("value", function(snap) {
				username = snap.child("displayName").val();
				$('#dropdownMenu1').html(username +" <span class='caret'></span>");
			});
		} else if (authData.provider === "password") {
			ref.child("users").child(authData.uid).child("password").once("value", function(snap) {
				email = snap.child("email").val();
				username = email.substr(0, email.indexOf("@"));
				$('#dropdownMenu1').html(username +" <span class='caret'></span>");
			});
		}

	}
}
