var ref = new Firebase("https://infernonero.firebaseio.com");

$('#disqus_thread').hide();

var te = document.querySelector('textarea');
te.addEventListener('keydown', resizeTextarea);

var idx = window.location.href.indexOf('#');
var hash = (idx > 0) ? window.location.href.slice(idx + 1) : '';
var idxComment = hash.indexOf('#comment');
if (idxComment > 0) {
	hash = hash.substring(0, idxComment);
}
var authData = ref.getAuth();
if (authData) {
} else {
	window.location.href = "/register.html?edit_compare.html#" + hash;
}

$(document).ready(function() {

	var image1Exists = false;
	var image2Exists = false;

	setUserName();

	if (authData.uid === "simplelogin:53") {
		$('#tags-row').removeClass("hidden");
	}

	$('#edit_submit_btn').hide();
	$('#remove_submit_btn').hide();
	$('#ask_submit_btn').hide();

	$('#loggingout').click(function() {

		ref.unauth();
		window.location.href = "/index.html";

	});

	// Set up preview.
	$('#txt_one_box').preview({
		key : '0079fbf00cf74fdc8204cc8c611c2c08',
		render : render1
	});

	$('#txt_two_box').preview({
		key : '0079fbf00cf74fdc8204cc8c611c2c08',
		render : render2
	});

	if (hash === '') {
		window.location.href = "/404.html";
	} else {

		ref.child("users-compares").child(authData.uid).child(hash).once("value", function(snap) {

			if (snap.child("compare_id").val() === null) {
				$('#edit_submit_btn').hide();
			} else {

				var compare_id = snap.child("compare_id").val();

				var f = new Firebase('https://infernonero.firebaseio.com/compares/' + compare_id);

				f.once('value', function(snap) {

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

					var txt_tags = snap.child("txt_tags").val();
					if (txt_tags != null) {
						$('#txt_tags').val(txt_tags);
					}

					var published = snap.child("published").val();
					if (published === false) {
						$("#privateCheck").attr('checked', 'checked');
						$('#txt_secret').removeClass("hidden");
					} else {
						$("#privateCheck").removeAttr('checked');
					}

					var txt_secret = snap.child("txt_secret").val();
					if (txt_secret != null && txt_secret != "") {
						$("#txt_secret").val(txt_secret);

					} else {
						$("#txt_secret").val("");
					}

					var p1 = snap.child("preview_one").val();
					if (p1 != null) {
						renderImage(null,null,p1,$('#feed1'));						
					}

					var p2 = snap.child("preview_two").val();
					if (p2 != null) {
						renderImage(null,null,p2,$('#feed2'));
					}

					setUserNameWithDisqus(compare_id, snap.child("txt_title").val());

				});

				var comparesVotesRef = new Firebase('https://infernonero.firebaseio.com/compares-votes/' + compare_id);
				var tot_one = 0;
				var tot_two = 0;

				comparesVotesRef.on('value', function(snap) {

					var vote_one = snap.child("vote_one").val();
					if (vote_one != null) {
						$('#one_votes_so_far').html("<span id='labelVoteOne' class='label'>" + vote_one + "</span>");
						tot_one = parseInt(vote_one);
					}

					var vote_two = snap.child("vote_two").val();
					if (vote_two != null) {
						$('#two_votes_so_far').html("<span id='labelVoteTwo' class='label'>" + vote_two + "</span>");
						tot_two = parseInt(vote_two);
					}

					if (vote_one === vote_two) {
						$('#labelVoteOne').addClass("label-primary");
						$('#labelVoteTwo').addClass("label-primary");
					} else if (vote_one > vote_two) {
						$('#labelVoteOne').addClass("label-success");
						$('#labelVoteTwo').addClass("label-danger");
					} else if (vote_one < vote_two) {
						$('#labelVoteOne').addClass("label-danger");
						$('#labelVoteTwo').addClass("label-success");
					}

				});

				var fImages = new Firebase('https://infernonero.firebaseio.com/compares-images/' + compare_id);

				fImages.once('value', function(snap) {
					var payloadOne = snap.child("file_one").val();
					$('#loadone').hide();
					if (payloadOne !== null && payloadOne !== "") {
						image1Exists = true;
						var img = new Image();
						img.src = payloadOne;
						document.getElementById("fileDisplayAreaOne").appendChild(img);
					}
					var payloadTwo = snap.child("file_two").val();
					$('#loadtwo').hide();
					if (payloadTwo !== null && payloadTwo !== "") {
						image2Exists = true;
						var img = new Image();
						img.src = payloadTwo;
						document.getElementById("fileDisplayAreaTwo").appendChild(img);
					}

				});

				loadPayload(document.getElementById('fileInputOne'), document.getElementById('fileDisplayAreaOne'), "src1", resize1);
				loadPayload(document.getElementById('fileInputTwo'), document.getElementById('fileDisplayAreaTwo'), "src2", resize2);

				$('#edit_submit_btn').show();
				$('#remove_submit_btn').show();
				$('#ask_submit_btn').show();

				$('#txt_title').keypress(function(e) {
					if (e.which == 13) {
						$("#txt_one_box").focus();
					}
				});

				$('#txt_one_box').blur(function() {
					$('#one_box').html($('#txt_one_box').val());
				});

				$('#txt_one_box').keypress(function(e) {
					if (e.which == 13) {
						$('#one_box').html("");
						$('#one_box').html($('#txt_one_box').val());
						$("#txt_two_box").focus();
					}
				});

				$('#txt_two_box').blur(function() {
					$('#two_box').html($('#txt_two_box').val());
				});

				$('#txt_two_box').keypress(function(e) {
					if (e.which == 13) {
						$('#two_box').html("");
						$('#two_box').html($('#txt_two_box').val());
						$('#txt_two_box').blur();
					}
				});

				$('#privateCheck').click(function() {
					if ($("#privateCheck").is(":checked")) {
						$('#txt_secret').removeClass("hidden");
					} else {
						$('#txt_secret').addClass("hidden");
						$('#txt_secret').val("");
					}

				});

				$('#edit_submit_btn').click(function() {

					var reader = new FileReader();

					var txt_title = $('#txt_title').val().trim();
					var txt_one = $('#txt_one_box').val().trim();
					var txt_two = $('#txt_two_box').val().trim();
					var txt_secret = $('#txt_secret').val().trim();
					var txt_tags = $('#txt_tags').val().trim();
					var scr1scr = $('#src1').attr('src');
					var scr2scr = $('#src2').attr('src');
					if (scr1scr === undefined) {
						scr1scr = "";
					}

					if (scr2scr === undefined) {
						scr2scr = "";
					}

					if (txt_title === "") {
						$.growl("Please enter a title for this compare", {
							type : "danger",
							placement : {
								from : "top",
								align : "center"
							}
						});
						$('#txt_title').focus();
						return false;
					}

					if (txt_one === "" && !image1Exists) {
						$.growl("Please enter a value for the first compare", {
							type : "danger",
							placement : {
								from : "top",
								align : "center"
							}
						});
						$('#txt_one_box').focus();
						return false;
					}

					if (txt_two === "" && !image2Exists) {
						$.growl("Please enter a value for the second compare", {
							type : "danger",
							placement : {
								from : "top",
								align : "center"
							}
						});
						$('#txt_two_box').focus();
						return false;
					}

					var published = true;
					if ($("#privateCheck").is(":checked")) {
						published = false;
					}

					var now = new Date().getTime();

					var postsRef = ref.child("compares").child(snap.child("compare_id").val());
					postsRef.update({
						user_id : authData.uid,
						date : now,
						txt_title : txt_title,
						txt_one : txt_one,
						txt_two : txt_two,
						txt_tags : txt_tags,
						published : published,
						txt_secret : txt_secret,
						vote_one : parseInt(0),
						vote_two : parseInt(0),
						preview_one : $('#txt_one_box').data('preview'),
						preview_two : $('#txt_two_box').data('preview')
					}, function(error) {
						if (error) {
							$.growl("Data could not be saved." + error, {
								type : "danger",
								placement : {
									from : "top",
									align : "center"
								}
							});
						} else {

							$('#socialrow').html("");
							$('#share_full_link').html("");
							$('#ask_submit_btn').show();

							var postsRefImages = ref.child("compares-images").child(snap.child("compare_id").val());

							if (scr1scr !== "") {

								postsRefImages.update({
									file_one : scr1scr
								});
							}

							if (scr2scr !== "") {

								postsRefImages.update({
									file_two : scr2scr
								});
							}

							if (scr1scr !== "" || scr2scr !== "") {

								var mixedPayload = convertImagesToSingleImage(txt_one, txt_two, scr1scr, scr2scr);

								if (mixedPayload !== "") {

									postsRefImages.update({
										file_one_and_two : mixedPayload
									});
								}
							}

							$.growl("Updated successfully", {
								type : "success",
								placement : {
									from : "top",
									align : "center"
								}
							});
						}
					});

				});

				$('#remove_submit_btn').click(function() {

					var comparesRef = ref.child("compares").child(snap.child("compare_id").val());
					comparesRef.remove();

					var comparesRef = ref.child("compares-votes").child(snap.child("compare_id").val());
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

					$('#ask_submit_btn').hide();

					$('#socialrow').html("<span id='share_facebook_button'></span><span id='share_googleplus_button'></span><span id='share_twitter_button'></span><span id='share_linkedin_button'></span><span id='share_pinterest_button'></span><span id='share_reddit_button'></span><span id='share_whatsapp_button'></span><span id='share_email_button'></span>");

					var reader = new FileReader();

					var txt_title = $('#txt_title').val();
					var txt_one = $('#txt_one_box').val();
					var txt_two = $('#txt_two_box').val();

					var description = "";

					if (txt_one != null && txt_one != "" && txt_two != null && txt_two != "") {
						description = txt_one + " VS " + txt_two;
					}

					var postID = snap.child("compare_id").val();

					var urlToShare = "share.choozzy.com/vote.php?q=" + postID;
					var urlToShareStatic = "www.choozzy.com/vote.html#" + postID;

					stWidget.addEntry({
						"service" : "facebook",
						"element" : document.getElementById('share_facebook_button'),
						"url" : urlToShare,
						"title" : txt_title,
						"type" : "large",
						"text" : txt_title,
						"image" : "https://www.choozzy.com/choozzy_logo.png",
						"summary" : description
					});

					stWidget.addEntry({
						"service" : "twitter",
						"element" : document.getElementById('share_twitter_button'),
						"url" : urlToShareStatic,
						"title" : txt_title,
						"type" : "large",
						"text" : txt_title,
						"image" : "https://www.choozzy.com/choozzy_logo.png",
						"summary" : description
					});

					stWidget.addEntry({
						"service" : "linkedin",
						"element" : document.getElementById('share_linkedin_button'),
						"url" : urlToShare,
						"title" : txt_title,
						"type" : "large",
						"text" : txt_title,
						"image" : "https://www.choozzy.com/choozzy_logo.png",
						"summary" : description
					});

					stWidget.addEntry({
						"service" : "whatsapp",
						"element" : document.getElementById('share_whatsapp_button'),
						"url" : urlToShare,
						"title" : txt_title,
						"type" : "large",
						"text" : txt_title,
						"image" : "https://www.choozzy.com/choozzy_logo.png",
						"summary" : description
					});

					stWidget.addEntry({
						"service" : "email",
						"element" : document.getElementById('share_email_button'),
						"url" : urlToShare,
						"title" : txt_title,
						"type" : "large",
						"text" : txt_title,
						"image" : "https://www.choozzy.com/choozzy_logo.png",
						"summary" : description
					});

					stWidget.addEntry({
						"service" : "googleplus",
						"element" : document.getElementById('share_googleplus_button'),
						"url" : urlToShare,
						"title" : txt_title,
						"type" : "large",
						"text" : txt_title,
						"image" : "https://www.choozzy.com/choozzy_logo.png",
						"summary" : description
					});

					stWidget.addEntry({
						"service" : "pinterest",
						"element" : document.getElementById('share_pinterest_button'),
						"url" : urlToShare,
						"title" : txt_title,
						"type" : "large",
						"text" : txt_title,
						"image" : "https://www.choozzy.com/choozzy_logo.png",
						"summary" : description
					});

					stWidget.addEntry({
						"service" : "reddit",
						"element" : document.getElementById('share_reddit_button'),
						"url" : urlToShare,
						"title" : txt_title,
						"type" : "large",
						"text" : txt_title,
						"image" : "https://www.choozzy.com/choozzy_logo.png",
						"summary" : description
					});

					$('#share_full_link').html("<input type='text' value='" + urlToShare + "' style='width:350px;background:#eee3c5'>");

				});

			}

		});

	}

});
