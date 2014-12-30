var ref = new Firebase("https://infernonero.firebaseio.com");

var authData = ref.getAuth();
if (authData) {
} else {
	window.location.href = "/register.html";
}

$(document).ready(function() {

	$('#ask_submit_btn').hide();
	$('#edit_submit_btn').hide();
	$('#remove_submit_btn').hide();

	var filePayloadOne = "";
	var fileInputOne = document.getElementById('fileInputOne');
	fileInputOne.files[0] = null;
	var fileDisplayAreaOne = document.getElementById('fileDisplayAreaOne');

	fileInputOne.addEventListener('change', function(e) {
		var file = fileInputOne.files[0];
		var imageType = /image.*/;

		if (file.type.match(imageType)) {
			var reader = new FileReader();

			reader.onload = function(e) {
				fileDisplayAreaOne.innerHTML = "";

				var img = new Image();

				filePayloadOne = reader.result;

				img.src = reader.result;

				fileDisplayAreaOne.appendChild(img);
			}

			reader.readAsDataURL(file);
		} else {
			fileDisplayAreaOne.innerHTML = "File not supported!"
		}
	});

	var filePayloadTwo = "";
	var fileInputTwo = document.getElementById('fileInputTwo');
	var fileDisplayAreaTwo = document.getElementById('fileDisplayAreaTwo');

	fileInputTwo.addEventListener('change', function(e) {
		var file = fileInputTwo.files[0];
		var imageType = /image.*/;

		if (file.type.match(imageType)) {
			var reader = new FileReader();

			reader.onload = function(e) {
				fileDisplayAreaTwo.innerHTML = "";

				var img = new Image();

				filePayloadTwo = reader.result;

				img.src = reader.result;

				fileDisplayAreaTwo.appendChild(img);
			}

			reader.readAsDataURL(file);
		} else {
			fileDisplayAreaTwo.innerHTML = "File not supported!"
		}
	});

	$('#loggingout').click(function() {

		ref.unauth();
		window.location.href = "/index.html";

	});

	$('#txt_one_box').keyup(function() {

		var description = $('#txt_one_box').val();
		$('#one_box').html(description);

	});

	$('#txt_two_box').keyup(function() {

		var description = $('#txt_two_box').val();
		$('#two_box').html(description);

	});

	var postID = "";
	var usersComparesID = "";

	$('#save_submit_btn').click(function() {

		var userComparesRef = ref.child("users-compares").child(authData.uid);

		var tot_compares_so_far = 0;

		userComparesRef.on("value", function(snapshot) {
			
			tot_compares_so_far = 0;
			
			snapshot.forEach(function(childSnapshot) {
				tot_compares_so_far = tot_compares_so_far + parseInt(1);
			});

		});
		userComparesRef.once('value', function(snap) {

			if (tot_compares_so_far > 5) {
				userComparesRef.orderByKey().limitToFirst(1).once("child_added", function(snapshot) {
					var comparesRef = ref.child("compares").child(snapshot.child("compare_id").val());
					comparesRef.remove();

					var usersComparesRef = ref.child("users-compares").child(authData.uid).child(snapshot.key());
					usersComparesRef.remove();

					var votesRef = ref.child("votes").child(snapshot.child("compare_id").val());
					votesRef.remove();
				});
			}

		});

		$('#save_submit_btn').hide();
		$('#edit_submit_btn').show();
		$('#remove_submit_btn').show();
		$('#ask_submit_btn').show();

		var reader = new FileReader();

		var txt_title = $('#txt_title').val();
		var txt_one = $('#txt_one_box').val();
		var txt_two = $('#txt_two_box').val();

		usersComparesID = new Date().getTime();

		var postsRef = ref.child("compares");
		var newMessageRef = postsRef.push({
			user_id : authData.uid,
			date : usersComparesID,
			txt_title : txt_title,
			txt_one : txt_one,
			file_one : filePayloadOne,
			txt_two : txt_two,
			file_two : filePayloadTwo,
			vote_one : parseInt(0),
			vote_two : parseInt(0)
		});

		var description = txt_one + " VS " + txt_two;

		postID = newMessageRef.key();

		userComparesRef.child(usersComparesID).set({

			compare_id : postID

		});

	});

	$('#edit_submit_btn').click(function() {

		var reader = new FileReader();

		var txt_title = $('#txt_title').val();
		var txt_one = $('#txt_one_box').val();
		var txt_two = $('#txt_two_box').val();

		var now = new Date().getTime();

		var postsRef = ref.child("compares").child(postID);
		postsRef.update({
			user_id : authData.uid,
			date : now,
			txt_title : txt_title,
			txt_one : txt_one,
			file_one : filePayloadOne,
			txt_two : txt_two,
			file_two : filePayloadTwo,
			vote_one : parseInt(0),
			vote_two : parseInt(0)
		});

	});

	$('#remove_submit_btn').click(function() {

		var comparesRef = ref.child("compares").child(postID);
		comparesRef.remove();

		var usersComparesRef = ref.child("users-compares").child(authData.uid).child(usersComparesID);
		usersComparesRef.remove();

		var votesRef = ref.child("votes").child(postID);
		votesRef.remove();

		window.location.href = "/user-compares.html";

	});

	$('#ask_submit_btn').click(function() {

		$('#edit_submit_btn').hide();
		$('#remove_submit_btn').hide();
		$('#ask_submit_btn').hide();

		var reader = new FileReader();

		var txt_title = $('#txt_title').val();
		var txt_one = $('#txt_one_box').val();
		var txt_two = $('#txt_two_box').val();

		var description = txt_one + " VS " + txt_two;

		var urlToShare = "https://infernonero.firebaseapp.com/vote.html#" + postID;

		stWidget.addEntry({
			"service" : "facebook",
			"element" : document.getElementById('share_facebook_button'),
			"url" : urlToShare,
			"title" : txt_title,
			"type" : "large",
			"text" : txt_title,
			"image" : "https://infernonero.firebaseapp.com/images/restart_logo.png",
			"summary" : description
		});

		stWidget.addEntry({
			"service" : "twitter",
			"element" : document.getElementById('share_twitter_button'),
			"url" : urlToShare,
			"title" : txt_title,
			"type" : "large",
			"text" : txt_title,
			"image" : "https://infernonero.firebaseapp.com/images/restart_logo.png",
			"summary" : description
		});

		stWidget.addEntry({
			"service" : "linkedin",
			"element" : document.getElementById('share_linkedin_button'),
			"url" : urlToShare,
			"title" : txt_title,
			"type" : "large",
			"text" : txt_title,
			"image" : "https://infernonero.firebaseapp.com/images/restart_logo.png",
			"summary" : description
		});

		stWidget.addEntry({
			"service" : "whatsapp",
			"element" : document.getElementById('share_whatsapp_button'),
			"url" : urlToShare,
			"title" : txt_title,
			"type" : "large",
			"text" : txt_title,
			"image" : "https://infernonero.firebaseapp.com/images/restart_logo.png",
			"summary" : description
		});

		stWidget.addEntry({
			"service" : "email",
			"element" : document.getElementById('share_email_button'),
			"url" : urlToShare,
			"title" : txt_title,
			"type" : "large",
			"text" : txt_title,
			"image" : "https://infernonero.firebaseapp.com/images/restart_logo.png",
			"summary" : description
		});

	});

});
