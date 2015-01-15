var ref = new Firebase("https://infernonero.firebaseio.com");

var authData = ref.getAuth();
if (authData) {

} else {
	window.location.href = "/register.html";
}

var te = document.querySelector('textarea');
te.addEventListener('keydown', resizeTextarea);

function resizeTextarea(ev) {
	this.style.height = '24px';
	this.style.height = this.scrollHeight + 14 + 'px';
}

var template = ['<div class="row">', '<div class="col-sm-4 column">', '<img class="thumb" src="{{thumbnail_url}}"></img>',
 '</div>', '<div class="col-sm-7 column">', '<a href="{{original_url}}">{{title}}</a>', '<p>{{description}}</p>', '</div>', '</div>'].join('');

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
	$('#feed1').append(html);
	return false;
};

var render2 = function(data, options) {
	var preview = $('#txt_two_box').data('preview');
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
	$('#feed2').append(html);
	return false;
};



    var mainCanvas;


    /* 
     * Creates a new image object from the src
     * Uses the deferred pattern
     */
    var createImage = function (src) {
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
    var startResize = function () {
        $.when(
            createImage($("#inputImage").attr('src'))
        ).then(resize, function () {console.log('error')});
    };

    /*
     * Draw the image object on a new canvas and half the size of the canvas
     * until the darget size has been reached
     * Afterwards put the base64 data into the target image
     */
    var resize1 = function (image) {
        mainCanvas = document.createElement("canvas");
        WIDTH = 800;
        if (image.width>WIDTH) {
	        ratio = image.width/image.height;
	        mainCanvas.width = WIDTH;
	        mainCanvas.height = WIDTH/ratio;
	        var ctx = mainCanvas.getContext("2d");
	        ctx.drawImage(image, 0, 0, mainCanvas.width, mainCanvas.height);
	        $('#src1').attr('src', mainCanvas.toDataURL("image/jpeg"));
        }
    };

    var resize2 = function (image) {
        mainCanvas = document.createElement("canvas");
        WIDTH = 800;
        if (image.width>WIDTH) {
	        ratio = image.width/image.height;
	        mainCanvas.width = WIDTH;
	        mainCanvas.height = WIDTH/ratio;
	        var ctx = mainCanvas.getContext("2d");
	        ctx.drawImage(image, 0, 0, mainCanvas.width, mainCanvas.height);
	        $('#src2').attr('src', mainCanvas.toDataURL("image/jpeg"));
        }
    };
    /*
     * Draw initial canvas on new canvas and half it's size
     */
    var halfSize = function (i) {
        var canvas = document.createElement("canvas");
        canvas.width = i.width / 2;
        canvas.height = i.height / 2;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(i, 0, 0, canvas.width, canvas.height);
        return canvas;
    };



$(document).ready(function() {

	setUserName();


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
				img.id="src1";

				fileDisplayAreaOne.appendChild(img);
 		
		 		$.when(
		            createImage(img.src)
		        ).then(resize1, function () {console.log('error')});
        
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

				img.id="src2";

				fileDisplayAreaTwo.appendChild(img);
 		
		 		$.when(
		            createImage(img.src)
		        ).then(resize2, function () {console.log('error')});
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

		var txt_title = $('#txt_title').val();
		var txt_one = $('#txt_one_box').val();
		var txt_two = $('#txt_two_box').val();

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

		if (txt_one === "") {
			$.growl("Please enter a value for the first compare", {
				type : "danger",
				placement : {
					from : "top",
					align : "center"
				}
			});

			return false;
		}

		if (txt_two === "") {
			$.growl("Please enter a value for the second compare", {
				type : "danger",
				placement : {
					from : "top",
					align : "center"
				}
			});

			return false;
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
			txt_one : txt_one,
			txt_two : txt_two,
			preview_one : $('#txt_one_box').data('preview'),
			preview_two : $('#txt_two_box').data('preview')
		}, function(error) {
			if (error) {
				alert("Data could not be saved." + error);
			} else {

				postID = newMessageRef.key();

				ref.child("compares-votes").child(postID).set({
					user_id : authData.uid,
					vote_one : parseInt(0),
					vote_two : parseInt(0)
				}, function(error) {
					if (error) {
						alert("Data could not be saved." + error);
					} else {
						userComparesRef.child(usersComparesID).set({
							compare_id : postID
						}, function(error) {
							if (error) {
								alert("Data could not be saved." + error);
							} else {
								var description = txt_one + " VS " + txt_two;

								var postsRefImages = ref.child("compares-images").child(postID);
								postsRefImages.set({
									file_one : $('#src1').attr('src'), //filePayloadOne,
									file_two : $('#src2').attr('src') //,filePayloadTwo
								}, function(error) {
									if (error) {
										alert("Data could not be saved." + error);
									} else {
										userComparesRef.child(usersComparesID).set({
											compare_id : postID
										}, function(error) {
											if (error) {
												alert("Data could not be saved." + error);
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

		var txt_title = $('#txt_title').val();
		var txt_one = $('#txt_one_box').val();
		var txt_two = $('#txt_two_box').val();

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

		if (txt_one === "") {
			$.growl("Please enter a value for the first compare", {
				type : "danger",
				placement : {
					from : "top",
					align : "center"
				}
			});

			return false;
		}

		if (txt_two === "") {
			$.growl("Please enter a value for the second compare", {
				type : "danger",
				placement : {
					from : "top",
					align : "center"
				}
			});

			return false;
		}

		var now = new Date().getTime();

		var postsRef = ref.child("compares").child(postID);
		postsRef.update({
			user_id : authData.uid,
			date : now,
			txt_title : txt_title,
			txt_one : txt_one,
			txt_two : txt_two,
			vote_one : parseInt(0),
			vote_two : parseInt(0)
		}, function(error) {
			if (error) {
				alert("Data could not be saved." + error);
			} else {

			}
		});

		var postsRefImages = ref.child("compares-images").child(postID);

		if (filePayloadOne !== "") {

			postsRefImages.update({
				file_one : filePayloadOne
			});
		}

		if (filePayloadTwo !== "") {

			postsRefImages.update({
				file_two : filePayloadTwo
			});
		}

		$.growl("Updated successfully", {
			type : "success",
			placement : {
				from : "top",
				align : "center"
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

		stWidget.addEntry({
			"service" : "googleplus",
			"element" : document.getElementById('share_googleplus_button'),
			"url" : urlToShare,
			"title" : txt_title,
			"type" : "large",
			"text" : txt_title,
			"image" : "https://infernonero.firebaseapp.com/images/restart_logo.png",
			"summary" : description
		});

		stWidget.addEntry({
			"service" : "pinterest",
			"element" : document.getElementById('share_pinterest_button'),
			"url" : urlToShare,
			"title" : txt_title,
			"type" : "large",
			"text" : txt_title,
			"image" : "https://infernonero.firebaseapp.com/images/restart_logo.png",
			"summary" : description
		});

		stWidget.addEntry({
			"service" : "reddit",
			"element" : document.getElementById('share_reddit_button'),
			"url" : urlToShare,
			"title" : txt_title,
			"type" : "large",
			"text" : txt_title,
			"image" : "https://infernonero.firebaseapp.com/images/restart_logo.png",
			"summary" : description
		});

	});

});
