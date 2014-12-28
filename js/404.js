var ref = new Firebase("https://infernonero.firebaseio.com");



$(document).ready(function() {
	
	
	$('#loggingout').click(function(){ 
        
		ref.unauth();
		window.location.href = "/index.html";  
        
    });

	
  
});