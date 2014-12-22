var ref = new Firebase('https://infernonero.firebaseio.com');

$('#logout').hide();

function authDataCallback(authData) {
	if (authData) {
		console.log("User " + authData.uid + " is logged in with " + authData.provider);
		$('#social_media_wrapper').hide();
		$('#sign').hide();
		$('#logout').show();
	} else {
		console.log("User is logged out");
		$('#logout').hide();
		$('#social_media_wrapper').show();
		$('#sign').show();
		
	}
}

	

$(document).ready(function() {
	

	ref.onAuth(authDataCallback);
	
	$('#logout').click(function(){ 
        
		ref.unauth();
        

       
    });
	
	

    
   $('#login_facebook_up').click(function(){ 
    	
        
	   ref.authWithOAuthPopup("facebook", function(error, authData) {
        	if (error) {
        		console.log("Login Failed!", error);
    		} else {
        		console.log("Authenticated successfully with payload:", authData);
        		//location.href = "/index.html"
    		}
    	});
    
    });
    
    
    
    
});