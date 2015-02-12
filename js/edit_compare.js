var ref = new Firebase("https://infernonero.firebaseio.com");

$('#disqus_thread').hide();

var te = document.querySelector('textarea');
te.addEventListener('keydown', resizeTextarea);

function resizeTextarea(ev) {
	this.style.height = '24px';
	this.style.height = this.scrollHeight + 14 + 'px';
}

function objToString(obj) {
	var str = '';
	for (var p in obj) {
		if (obj.hasOwnProperty(p)) {
			str += p + '::' + obj[p] + '\n';
		}
	}
	return str;
}

var template = ['<div class="row">', '<div class="col-sm-4 columns">', '<img class="thumb" src="{{thumbnail_url}}"></img>', '</div>', '<div class="col-sm-7 column">', '<a href="{{original_url}}">{{title}}</a>', '<p>{{description}}</p>', '</div>', '</div>'].join('');

var render1 = function(data, options) {
	var preview = $('#txt_one_box').data('preview');

	html = $(Mustache.to_html(template, preview));
	html.data('preview', preview);
	html.on('click', function() {
		var data = $(this).data('preview');
		// Insert the video or rich object.
		if (data.media.type === 'video' || data.media.type === 'rich') {
			$(this).html(data.media.html);
			return false;
		}
		return true;
	});
	// Display the item in the feed.
	$('#feed1').empty();
	$('#feed1').append(html);
	return false;
};

var render2 = function(data, options) {
	var preview = $('#txt_two_box').data('preview');
	// Create a post using mustache, i.e. the nice way.

	html = $(Mustache.to_html(template, preview));
	html.data('preview', preview);
	html.on('click', function() {
		var data = $(this).data('preview');
		// Insert the video or rich object.
		if (data.media.type === 'video' || data.media.type === 'rich') {
			$(this).html(data.media.html);
			return false;
		}
		return true;
	});
	// Display the item in the feed.
	$('#feed2').empty();
	$('#feed2').append(html);
	return false;
};

var mainCanvas;

/*
 * Creates a new image object from the src
 * Uses the deferred pattern
 */
var createImage = function(src) {
	var deferred = $.Deferred();
	var img = new Image();

	img.onload = function() {
		deferred.resolve(img);
	};
	img.src = src;
	return deferred.promise();
};

/*
 * Create an Image, when loaded pass it on to the resizer
 */
var startResize = function() {
	$.when(createImage($("#inputImage").attr('src'))).then(resize, function() {
		console.log('error')
	});
};

/*
 * Draw the image object on a new canvas and half the size of the canvas
 * until the darget size has been reached
 * Afterwards put the base64 data into the target image
 */
var resize1 = function(image) {
	mainCanvas = document.createElement("canvas");
	WIDTH = 400;
	if (image.width > WIDTH) {
		ratio = image.width / image.height;
		mainCanvas.width = WIDTH;
		mainCanvas.height = WIDTH / ratio;
		var ctx = mainCanvas.getContext("2d");
		ctx.drawImage(image, 0, 0, mainCanvas.width, mainCanvas.height);
		$('#src1').attr('src', mainCanvas.toDataURL("image/jpeg"));
	}
};

var resize2 = function(image) {
	mainCanvas = document.createElement("canvas");
	WIDTH = 400;
	if (image.width > WIDTH) {
		ratio = image.width / image.height;
		mainCanvas.width = WIDTH;
		mainCanvas.height = WIDTH / ratio;
		var ctx = mainCanvas.getContext("2d");
		ctx.drawImage(image, 0, 0, mainCanvas.width, mainCanvas.height);
		$('#src2').attr('src', mainCanvas.toDataURL("image/jpeg"));
	}
};
/*
 * Draw initial canvas on new canvas and half it's size
 */
var halfSize = function(i) {
	var canvas = document.createElement("canvas");
	canvas.width = i.width / 2;
	canvas.height = i.height / 2;
	var ctx = canvas.getContext("2d");
	ctx.drawImage(i, 0, 0, canvas.width, canvas.height);
	return canvas;
};

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

					var txt_secret = snap.child("txt_secret").val();
					if (txt_secret != null && txt_secret != "") {
						$("#privateCheck").attr('checked', 'checked');
						$("#txt_secret").val(txt_secret);
						$('#txt_secret').removeClass("hidden");

					} else {
						$("#privateCheck").removeAttr('checked');
						$("#txt_secret").val("");
					}

					var published = snap.child("published").val();
					if (published === null || published != true) {
						$("#publicCheck").removeAttr('checked');
					} else {
						$("#publicCheck").attr('checked', 'checked');
					}

					var p1 = snap.child("preview_one").val();
					if (p1 != null) {

						html = $(Mustache.to_html(template, p1));
						html.data('preview', p1);
						html.on('click', function() {
							var data = $(this).data('preview');
							// Insert the video or rich object.
							if (data.media.type === 'video' || data.media.type === 'rich') {
								$(this).html(data.media.html);
								return false;
							}
							return true;
						});
						$('#feed1').append(html);
					}

					var p2 = snap.child("preview_two").val();
					if (p2 != null) {
						html = $(Mustache.to_html(template, p2));
						html.data('preview', p2);
						html.on('click', function() {
							var data = $(this).data('preview');
							// Insert the video or rich object.
							if (data.media.type === 'video' || data.media.type === 'rich') {
								$(this).html(data.media.html);
								return false;
							}
							return true;
						});
						$('#feed2').append(html);
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

							img.id = "src1";

							fileDisplayAreaOne.appendChild(img);

							$.when(createImage(img.src)).then(resize1, function() {
								console.log('error')
							});
						}

						reader.readAsDataURL(file);

						image1Exists = true;
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

							img.id = "src2";

							fileDisplayAreaTwo.appendChild(img);

							$.when(createImage(img.src)).then(resize2, function() {
								console.log('error')
							});
						}

						reader.readAsDataURL(file);
						image2Exists = true;
					} else {
						fileDisplayAreaTwo.innerHTML = "File not supported!"
					}
				});

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

					if ($("#privateCheck").is(":checked")) {
						if (txt_secret === "") {
							$.growl("Please enter a secret key", {
								type : "danger",
								placement : {
									from : "top",
									align : "center"
								}
							});
							$('#txt_secret').focus();
							return false;
						}
					}

					var published = false;
					if ($("#publicCheck").is(":checked")) {
						published = true;
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

							if (filePayloadOne !== "") {

								postsRefImages.update({
									file_one : $('#src1').attr('src')
								});
							}

							if (filePayloadTwo !== "") {

								postsRefImages.update({
									file_two : $('#src2').attr('src')
								});
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

					var urlToShare = "https://www.choozzy.com/vote.html#" + postID;

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
						"url" : urlToShare,
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
