var ref = new Firebase("https://infernonero.firebaseio.com");

var authData = ref.getAuth();
if (authData) {
	setUserName();
}

$(document).ready(function() {

	$('#loggingout').click(function() {

		ref.unauth();
		window.location.href = "/index.html";

	});

}); 