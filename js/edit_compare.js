var ref = new Firebase("https://infernonero.firebaseio.com");

$('#disqus_thread').hide();

$(document).ready(function() {

	$('#loggingout').click(function() {

		ref.unauth();
		window.location.href = "/index.html";

	});

	var idx = window.location.href.indexOf('#');
	var hash = (idx > 0) ? window.location.href.slice(idx + 1) : '';
	if (hash === '') {
		alert("hash === vuoto");
		window.location.href = "/404.html";
	} else {

		var authData = ref.getAuth();
		if (authData) {
	
				ref.child("users-compares").child(authData.uid).child(hash).once("value", function(snap) {

				if (snap.child("compare_id").val() === null) {
					$('#edit_submit_btn').hide();
				} else {

					var compare_id = snap.child("compare_id").val();
					
					setUserNameWithDisqus(compare_id);

					var f = new Firebase('https://infernonero.firebaseio.com/compares/' + compare_id);
					var tot_one = 0;
					var tot_two = 0;

					f.once('value', function(snap) {

						

						$('#disqus_thread').show();

						var txt_one = snap.child("txt_one").val();
						if (txt_one != null) {
							$('#one_box').html(txt_one);
							$('#txt_one_box').val(txt_one);

						}

						var txt_two = snap.child("txt_two").val();
						if (txt_two != null) {
							$('#two_box').html(txt_two);
							$('#txt_two_box').val(txt_two);
						}

						var txt_title = snap.child("txt_title").val();
						if (txt_title != null) {
							$('#txt_title').val(txt_title);
						}

						var vote_one = snap.child("vote_one").val();
						if (vote_one != null) {
							$('#one_votes_so_far').html("<span class='badge'>"+vote_one+"</span>");
							tot_one = parseInt(vote_one);
						}

						var vote_two = snap.child("vote_two").val();
						if (vote_two != null) {
							$('#two_votes_so_far').html("<span class='badge'>"+vote_two+"</span>");
							tot_two = parseInt(vote_two);
						}

					});

					var fImages = new Firebase('https://infernonero.firebaseio.com/compares-images/' + compare_id);

					fImages.once('value', function(snap) {
						var payloadOne = snap.child("file_one").val();
						$('#loadone').hide();
						if (payloadOne != null) {
							var img = new Image();
							img.src = payloadOne;
							document.getElementById("fileDisplayAreaOne").appendChild(img);
						}
						var payloadTwo = snap.child("file_two").val();
						$('#loadtwo').hide();
						if (payloadTwo != null) {
							var img = new Image();
							img.src = payloadTwo;
							document.getElementById("fileDisplayAreaTwo").appendChild(img);
						}
					});

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

					$('#txt_one_box').keyup(function() {

						var description = $('#txt_one_box').val();
						$('#one_box').html(description);

					});

					$('#txt_two_box').keyup(function() {

						var description = $('#txt_two_box').val();
						$('#two_box').html(description);

					});

					$('#edit_submit_btn').click(function() {

						var reader = new FileReader();

						var txt_title = $('#txt_title').val();
						var txt_one = $('#txt_one_box').val();
						var txt_two = $('#txt_two_box').val();

						var now = new Date().getTime();

						var postsRef = ref.child("compares").child(snap.child("compare_id").val());
						postsRef.update({
							user_id : authData.uid,
							date : now,
							txt_title : txt_title,
							txt_one : txt_one,
							txt_two : txt_two,
							vote_one : parseInt(0),
							vote_two : parseInt(0)
						});
						
						var postsRefImages = ref.child("compares-images").child(snap.child("compare_id").val());

						
						if(filePayloadOne !== "" ){
						
							postsRefImages.update({
								file_one : filePayloadOne
							});
						}
						
						if(filePayloadTwo !== "" ){
						
							postsRefImages.update({
								file_two : filePayloadTwo
							});
						}

					});

					$('#remove_submit_btn').click(function() {

						var comparesRef = ref.child("compares").child(snap.child("compare_id").val());
						comparesRef.remove();

						var comparesImagesRef = ref.child("compares-images").child(snap.child("compare_id").val());
						comparesImagesRef.remove();

						var usersComparesRef = ref.child("users-compares").child(authData.uid).child(hash);
						usersComparesRef.remove();

						var votesRef = ref.child("votes").child(snap.child("compare_id").val());
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

						var postID = snap.child("compare_id").val();

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

				}

			});

		} else {
			$('#logout').hide();
			$('#compare').hide();
			$('#manage').hide();
		}

	}

});
