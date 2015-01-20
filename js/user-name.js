var ref = new Firebase("https://infernonero.firebaseio.com");

function setUserNameWithDisqus(compare_id,title) {
	var authData = ref.getAuth();
	if (authData) {
		if (authData.provider === "facebook") {
			ref.child("users").child(authData.uid).child("facebook").once("value", function(snap) {
				username = snap.child("displayName").val();
				var useremail  = snap.child("email").val();
				reset(compare_id, "http://infernonero.firebaseapp.com/disqus.html?id=" + compare_id, title, 'en', disqusSignon(authData.uid,username,useremail ), getPubKey());
				$('#disqus_thread').show();
			});
		} else if (authData.provider === "google") {
			ref.child("users").child(authData.uid).child("google").once("value", function(snap) {
				username = snap.child("displayName").val();
				var useremail  = snap.child("email").val();
				reset(compare_id, "http://infernonero.firebaseapp.com/disqus.html?id=" + compare_id, title, 'en', disqusSignon(authData.uid,username,useremail ), getPubKey());
				$('#disqus_thread').show();
			});
		}else if (authData.provider === "twitter") {
			ref.child("users").child(authData.uid).child("twitter").once("value", function(snap) {
				username = snap.child("displayName").val();
				var useremail  = username + "@choozzy.com";
				reset(compare_id, "http://infernonero.firebaseapp.com/disqus.html?id=" + compare_id, title, 'en', disqusSignon(authData.uid,username,useremail ), getPubKey());
				$('#disqus_thread').show();
			});
		} else if (authData.provider === "password") {
			ref.child("users").child(authData.uid).child("password").once("value", function(snap) {
				var useremail = snap.child("email").val();
				reset(compare_id, "http://infernonero.firebaseapp.com/disqus.html?id=" + compare_id, title, 'en', disqusSignon(authData.uid,useremail,useremail ), getPubKey());
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
				var imageprofile = snap.child("cachedUserProfile").child("picture").child("data").child("url").val();
				$('#dropdownMenu1').html("<img widht='24' height='24' src='"+imageprofile+"' /> " +username+" <span class='caret'></span>");
				$(".showAfterLoad").removeClass("hidden");
			});
		} else if (authData.provider === "google") {
			ref.child("users").child(authData.uid).child("google").once("value", function(snap) {
				username = snap.child("displayName").val();
				var imageprofile = snap.child("cachedUserProfile").child("picture").val();
				$('#dropdownMenu1').html("<img widht='24' height='24' src='"+imageprofile+"' /> " +username+" <span class='caret'></span>");
				$(".showAfterLoad").removeClass("hidden");
			});
		}else if (authData.provider === "twitter") {
			ref.child("users").child(authData.uid).child("twitter").once("value", function(snap) {
				username = snap.child("displayName").val();
				var imageprofile = snap.child("cachedUserProfile").child("profile_image_url_https").val();
				$('#dropdownMenu1').html("<img widht='24' height='24' src='"+imageprofile+"' /> " +username+" <span class='caret'></span>");
				$(".showAfterLoad").removeClass("hidden");
			});
		} else if (authData.provider === "password") {
			ref.child("users").child(authData.uid).child("password").once("value", function(snap) {
				email = snap.child("email").val();
				$('#dropdownMenu1').html("<i class='fa fa-user'></i> " +email +" <span class='caret'></span>");
				$(".showAfterLoad").removeClass("hidden");
			});
		}

	}else{
		$(".showAfterLoad").removeClass("hidden");
	}
}
