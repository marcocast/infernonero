var ref = new Firebase("https://infernonero.firebaseio.com");

var authData = ref.getAuth();
if (authData) {
}else{
	window.location.href = "/register.html";  
}

	

$(document).ready(function() {
	

   $('#loggingout').click(function(){ 
        
		ref.unauth();
		window.location.href = "/index.html";
        
    });
   
   
   $('#txt_one_box').keyup(function(){ 
       
	   var description = $('#txt_one_box').val();
	   $('#one_box').html(description);
       
   });
 
	
    $('#txt_two_box').keyup(function(){ 
       
	   var description = $('#txt_two_box').val();
	   $('#two_box').html(description);
       
   });
    
   
  $('#save_submit_btn').click(function(){ 
      
	  var txt_title =  $('#txt_title').val();
	  var txt_one =  $('#txt_one_box').val();
	  var txt_two =  $('#txt_two_box').val();
	  
	  var postsRef = ref.child("compares").child(authData.uid);
	  postsRef.push({
		  txt_title: txt_title,
		  txt_one: txt_one,
		  txt_two: txt_two
	  });
        
    }); 
    
});