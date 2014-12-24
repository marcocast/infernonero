var ref = new Firebase("https://infernonero.firebaseio.com");

var authData = ref.getAuth();

$(function() {
	
	var idx = window.location.href.indexOf('#');
	var hash = (idx > 0) ? window.location.href.slice(idx + 1) : '';
	if (hash === '') {
	} else {
		var f = new Firebase('https://infernonero.firebaseio.com/compares/' + hash );
		f.once('value', function(snap) {
			
		var txt_one = snap.child("txt_one").val();
		if (txt_one != null) {
			$('#one_box').html(txt_one);
		} 
		
		var txt_two = snap.child("txt_two").val();
		if (txt_two != null) {
			$('#two_box').html(txt_two);
		} 
		
		var txt_title = snap.child("txt_title").val();
		if (txt_title != null) {
			$('#txt_title').html(txt_title);
		} 	
			
			
			
		var payloadOne = snap.child("file_one").val();
		if (payloadOne != null) {
			var img = new Image();
			img.src = payloadOne;
			document.getElementById("fileDisplayAreaOne").appendChild(img);
		} 
		var payloadTwo = snap.child("file_two").val();
		if (payloadTwo != null) {
			var img = new Image();
			img.src = payloadTwo;
			document.getElementById("fileDisplayAreaTwo").appendChild(img);
		} 
		
		
		

		
		});
	}
});





$(document).ready(function() {
	
	

   
   
  
});