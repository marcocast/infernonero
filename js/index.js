var ref = new Firebase('https://infernonero.firebaseio.com');

$('#logout').hide();

var authData = ref.getAuth();

var isNewUser = true;
ref.onAuth(function(authData) {
if (authData && isNewUser) {
	// save the user's profile into Firebase so we can list users,
	// use them in Security and Firebase Rules, and show profiles
	ref.child("users").child(authData.uid).set(authData);
}
});	

function authDataCallback(authData) {
	if (authData) {
		console.log("User " + authData.uid + " is logged in with " + authData.provider);
		$('#social_media_wrapper').hide();
		$('#sign').hide();
		$('#logout').show();
		$('#compare').show();
		$('#manage').show();
	} else {
		console.log("User is logged out");
		$('#logout').hide();
		$('#compare').hide();
		$('#manage').hide();
		$('#social_media_wrapper').show();
		$('#sign').show();
		
	}
}

	

$(document).ready(function() {
	

	ref.onAuth(authDataCallback);
	
	$('#loggingout').click(function(){ 
        
		ref.unauth();
        
    });
	
	

    
   $('#login_facebook_up').click(function(){ 
    	       
	   ref.authWithOAuthPopup("facebook", function(error, authData) {
        	if (error) {
        		console.log("Login Failed!", error);
    		} else {
        		console.log("Authenticated successfully with payload:", authData);
        		location.reload();
    		}
    	});
    
    });
    
    
    
    
});