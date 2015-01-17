var ref = new Firebase("https://infernonero.firebaseio.com");

$('#disqus_thread').hide();


$(document).ready(function() {

	$('#loggingout').click(function() {

		ref.unauth();
		window.location.href = "/index.html";

	});

	
	var idx = window.location.href.indexOf('?id=');
	var hash = (idx > 0) ? window.location.href.slice(idx + 4) : '';
	var idxComment = hash.indexOf('#comment');
	if (idxComment > 0) {
		hash = hash.substring(0, idxComment); 
	}
	
	if (hash === '') {
		alert("hash === vuoto");
		window.location.href = "/404.html";
	} else {

		var authData = ref.getAuth();
		if (authData) {
			window.location.href = "/vote.html#"+hash;
		} else {
			window.location.href = "/register.html?vote.html#"+hash;
		}


	}

}); 