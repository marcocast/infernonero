var ref = new Firebase("https://infernonero.firebaseio.com");

var authData = ref.getAuth();
if (authData) {
} else {
	window.location.href = "/register.html?compare.html";
}

$(document).ready(function() {

	setUserName();

	if (authData.uid === "simplelogin:53") {
		$('#tags-row').removeClass("hidden");
	}

	var te = document.querySelector('textarea');
	te.addEventListener('keydown', resizeTextarea);

	$('#txt_title').focus();

	$('#txt_one_box').val("");
	$('#txt_two_box').val("");
	$('#txt_title').val("");

	$("#privateCheck").removeAttr('checked');

	$('#edit_submit_btn').hide();
	$('#remove_submit_btn').hide();
	$('#ask_submit_btn').hide();
	$('#disqus_thread').hide();

	// Set up preview.
	$('#txt_one_box').preview({
		key : '0079fbf00cf74fdc8204cc8c611c2c08',
		render : render1
	});

	$('#txt_two_box').preview({
		key : '0079fbf00cf74fdc8204cc8c611c2c08',
		render : render2
	});
	
	
	loadPayload(document.getElementById('fileInputOne'), document.getElementById('fileDisplayAreaOne'), "src1", resize1);
	loadPayload(document.getElementById('fileInputTwo'), document.getElementById('fileDisplayAreaTwo'), "src2", resize2);

	

	$('#loggingout').click(function() {

		ref.unauth();
		window.location.href = "/index.html";

	});

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

	var postID = "";
	var usersComparesID = "";

	$('#save_submit_btn').click(function() {

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

		if (txt_one === "" && scr1scr === "") {
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

		if (txt_two === "" && scr2scr === "") {
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

		var userComparesRef = ref.child("users-compares").child(authData.uid);

		$('#save_submit_btn').hide();
		$('#savediv').html("<img src='images/468.GIF' />");

		var reader = new FileReader();

		usersComparesID = new Date().getTime();

		var postsRef = ref.child("compares");
		var newMessageRef = postsRef.push({
			user_id : authData.uid,
			date : usersComparesID,
			txt_title : txt_title,
			closed : false,
			txt_tags : txt_tags,
			published : published,
			txt_one : txt_one,
			txt_two : txt_two,
			txt_secret : txt_secret,
			txt_username : getUserName(),
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

				$('#savediv').html("");
				$('#save_submit_btn').show();
			} else {

				postID = newMessageRef.key();

				ref.child("compares-votes").child(postID).set({
					user_id : authData.uid,
					vote_one : parseInt(0),
					vote_two : parseInt(0)
				}, function(error) {
					if (error) {
						$.growl("Data could not be saved." + error, {
							type : "danger",
							placement : {
								from : "top",
								align : "center"
							}
						});
						$('#savediv').html("");
						$('#save_submit_btn').show();
					} else {
						userComparesRef.child(usersComparesID).set({
							compare_id : postID
						}, function(error) {
							if (error) {
								$.growl("Data could not be saved." + error, {
									type : "danger",
									placement : {
										from : "top",
										align : "center"
									}
								});
								$('#savediv').html("");
								$('#save_submit_btn').show();
							} else {
								var description = txt_one + " VS " + txt_two;

								var postsRefImages = ref.child("compares-images").child(postID);

								var mixedPayload = convertImagesToSingleImage(txt_one, txt_two, scr1scr, scr2scr);

								postsRefImages.set({
									file_one : scr1scr, //filePayloadOne,
									file_two : scr2scr, //,filePayloadTwo
									file_one_and_two : mixedPayload
								}, function(error) {
									if (error) {
										$.growl("Data could not be saved." + error, {
											type : "danger",
											placement : {
												from : "top",
												align : "center"
											}
										});
										$('#savediv').html("");
										$('#save_submit_btn').show();
									} else {
										userComparesRef.child(usersComparesID).set({
											compare_id : postID
										}, function(error) {
											if (error) {
												$.growl("Data could not be saved." + error, {
													type : "danger",
													placement : {
														from : "top",
														align : "center"
													}
												});
												$('#savediv').html("");
												$('#save_submit_btn').show();
											} else {
												$('#savediv').html("");
												$('#edit_submit_btn').show();
												$('#remove_submit_btn').show();
												$('#ask_submit_btn').show();
												setUserNameWithDisqus(postID, txt_title);
											}
										});
									}
								});
							}
						});
					}
				});

			}
		});

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

			return false;
		}

		if (txt_one === "" && filePayloadOne === "") {
			$.growl("Please enter a value for the first compare", {
				type : "danger",
				placement : {
					from : "top",
					align : "center"
				}
			});

			return false;
		}

		if (txt_two === "" && filePayloadTwo === "") {
			$.growl("Please enter a value for the second compare", {
				type : "danger",
				placement : {
					from : "top",
					align : "center"
				}
			});

			return false;
		}

		var published = true;
		if ($("#privateCheck").is(":checked")) {
			published = false;

		}

		var now = new Date().getTime();

		var postsRef = ref.child("compares").child(postID);
		postsRef.update({
			user_id : authData.uid,
			date : now,
			txt_title : txt_title,
			published : published,
			txt_one : txt_one,
			txt_two : txt_two,
			txt_tags : txt_tags,
			txt_secret : txt_secret,
			vote_one : parseInt(0),
			vote_two : parseInt(0)
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

				var postsRefImages = ref.child("compares-images").child(postID);

				if (filePayloadOne !== "") {

					postsRefImages.update({
						file_one : scr1scr
					});
				}

				if (filePayloadTwo !== "") {

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

		var comparesRef = ref.child("compares").child(postID);
		comparesRef.remove();

		var comparesRef = ref.child("compares-votes").child(postID);
		comparesRef.remove();

		var comparesImagesRef = ref.child("compares-images").child(postID);
		comparesImagesRef.remove();

		var usersComparesRef = ref.child("users-compares").child(authData.uid).child(postID);
		usersComparesRef.remove();

		var votesRef = ref.child("votes").child(postID);

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

		var urlToShare = "http://share.choozzy.com/vote.php?q=" + postID;

		stWidget.addEntry({
			"service" : "facebook",
			"element" : document.getElementById('share_facebook_button'),
			"url" : urlToShare,
			"title" : txt_title,
			"type" : "large",
			"text" : txt_title,
			"image" : "https://www.choozzy.com/images/restart_logo.png",
			"summary" : description
		});

		stWidget.addEntry({
			"service" : "twitter",
			"element" : document.getElementById('share_twitter_button'),
			"url" : urlToShare,
			"title" : txt_title,
			"type" : "large",
			"text" : txt_title,
			"image" : "https://www.choozzy.com/images/restart_logo.png",
			"summary" : description
		});

		stWidget.addEntry({
			"service" : "linkedin",
			"element" : document.getElementById('share_linkedin_button'),
			"url" : urlToShare,
			"title" : txt_title,
			"type" : "large",
			"text" : txt_title,
			"image" : "https://www.choozzy.com/images/restart_logo.png",
			"summary" : description
		});

		stWidget.addEntry({
			"service" : "whatsapp",
			"element" : document.getElementById('share_whatsapp_button'),
			"url" : urlToShare,
			"title" : txt_title,
			"type" : "large",
			"text" : txt_title,
			"image" : "https://www.choozzy.com/images/restart_logo.png",
			"summary" : description
		});

		stWidget.addEntry({
			"service" : "email",
			"element" : document.getElementById('share_email_button'),
			"url" : urlToShare,
			"title" : txt_title,
			"type" : "large",
			"text" : txt_title,
			"image" : "https://www.choozzy.com/images/restart_logo.png",
			"summary" : description
		});

		stWidget.addEntry({
			"service" : "googleplus",
			"element" : document.getElementById('share_googleplus_button'),
			"url" : urlToShare,
			"title" : txt_title,
			"type" : "large",
			"text" : txt_title,
			"image" : "https://www.choozzy.com/images/restart_logo.png",
			"summary" : description
		});

		stWidget.addEntry({
			"service" : "pinterest",
			"element" : document.getElementById('share_pinterest_button'),
			"url" : urlToShare,
			"title" : txt_title,
			"type" : "large",
			"text" : txt_title,
			"image" : "https://www.choozzy.com/images/restart_logo.png",
			"summary" : description
		});

		stWidget.addEntry({
			"service" : "reddit",
			"element" : document.getElementById('share_reddit_button'),
			"url" : urlToShare,
			"title" : txt_title,
			"type" : "large",
			"text" : txt_title,
			"image" : "https://www.choozzy.com/images/restart_logo.png",
			"summary" : description
		});

		$('#share_full_link').html("<input type='text' value='" + urlToShare + "' style='width:350px;background:#eee3c5'>");

	});

});
