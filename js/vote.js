var ref = new Firebase("https://infernonero.firebaseio.com");

$('#disqus_thread').hide();

var template = ['<div class="row">', '<div class="col-sm-4 columns">', '<img class="thumb" src="{{thumbnail_url}}"></img>', '</div>', '<div class="col-sm-7 column">', '<a href="{{original_url}}">{{title}}</a>', '<p>{{description}}</p>', '</div>', '</div>'].join('');

function objToString(obj) {
	var str = '';
	for (var p in obj) {
		if (obj.hasOwnProperty(p)) {
			str += p + '::' + obj[p] + '\n';
		}
	}
	return str;
}


$(document).ready(function() {

	setUserName();

	$('#loggingout').click(function() {

		ref.unauth();
		window.location.href = "/index.html";

	});

	var idx = window.location.href.indexOf('#');
	var hash = (idx > 0) ? window.location.href.slice(idx + 1) : '';
	var idxComment = hash.indexOf('#comment');
	if (idxComment > 0) {
		hash = hash.substring(0, idxComment);
	}

	if (hash === '') {
		window.location.href = "/404.html";
	} else {

		var authData = ref.getAuth();
		if (authData) {

		} else {
			$('#logout').hide();
			$('#compare').hide();
			$('#manage').hide();
		}

		var f = new Firebase('https://infernonero.firebaseio.com/compares/' + hash);

		f.on("child_removed", function(snap) {
			window.location.href = "/index.html";
		});

		f.once("value", function(snap) {
			if (snap.child("txt_title").val() === null) {
				window.location.href = "/404.html";
			}
		});

		f.on('value', function(snap) {

			if (snap.child("closed").val()) {
				$('#vote_one').hide();
				$('#vote_two').hide();
			} else {
				if (authData) {
					ref.child("votes").child(hash).child(authData.uid).on("value", function(snapvotes) {
						if (snapvotes.child("vote").val() === null) {
							$('#vote_one').show();
							$('#vote_two').show();
						} else {
							$('#vote_one').hide();
							$('#vote_two').hide();
						}

					});
				}

			}

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
				$('#feed1').empty();
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
				$('#feed2').empty();
				$('#feed2').append(html);
			}

		});

		f.once('value', function(snap) {

			if (authData) {
				setUserNameWithDisqus(hash, snap.child("txt_title").val());
			}

		});

		var comparesVotesRef = new Firebase('https://infernonero.firebaseio.com/compares-votes/' + hash);
		var tot_one = 0;
		var tot_two = 0;

		comparesVotesRef.on('value', function(snap) {

			var vote_one = snap.child("vote_one").val();
			if (vote_one != null) {
				$('#result_one').html("<span id='labelVoteOne' class='label'>" + vote_one + "</span>");
				tot_one = parseInt(vote_one);
			}

			var vote_two = snap.child("vote_two").val();
			if (vote_two != null) {
				$('#result_two').html("<span id='labelVoteTwo' class='label'>" + vote_two + "</span>");
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

		var fImages = new Firebase('https://infernonero.firebaseio.com/compares-images/' + hash);

		fImages.on('value', function(snap) {

			$('#fileDisplayAreaOne').html("");
			var payloadOne = snap.child("file_one").val();
			$('#loadone').hide();
			if (payloadOne !== null && payloadOne !== "") {
				var img = new Image();
				img.src = payloadOne;
				document.getElementById("fileDisplayAreaOne").appendChild(img);
			}

			$('#fileDisplayAreaTwo').html("");
			var payloadTwo = snap.child("file_two").val();
			$('#loadtwo').hide();
			if (payloadTwo !== null && payloadTwo !== "") {
				var img = new Image();
				img.src = payloadTwo;
				document.getElementById("fileDisplayAreaTwo").appendChild(img);
			}

		});

		$('#vote_one').click(function() {

			if (authData) {
				comparesVotesRef.update({
					"vote_one" : tot_one + parseInt(1)
				});

				ref.child("votes").child(hash).child(authData.uid).set({
					vote : "1"
				});

				$('#vote_one').hide();
				$('#vote_two').hide();
				$.growl("Thanks for voting", {
					type : "success",
					placement : {
						from : "top",
						align : "left"
					}
				});
			} else {
				window.location.href = "/register.html?vote.html#"+hash;
			}

		});

		$('#vote_two').click(function() {

			if (authData) {
				comparesVotesRef.update({
					"vote_two" : tot_two + parseInt(1)
				});

				ref.child("votes").child(hash).child(authData.uid).set({
					vote : "2"
				});

				$('#vote_two').hide();
				$('#vote_one').hide();
				$.growl("Thanks for voting", {
					type : "success",
					placement : {
						from : "top",
						align : "right"
					}
				});
			} else {
				window.location.href = "/register.html?vote.html#"+hash;
			}

		});
	}

});
