var ref = new Firebase('https://infernonero.firebaseio.com');

var followUsersRef = new Firebase('https://infernonero.firebaseio.com/follow-users/');

$('#logout').hide();

var authData = ref.getAuth();

var idx = window.location.href.indexOf('#');
var useridhash = (idx > 0) ? window.location.href.slice(idx + 1) : '';

if (authData) {
	populateTable();
} else {
	window.location.href = "/index.html";
}

ref.onAuth(function(authData) {

	if (authData) {

		ref.child("users").child(authData.uid).set(authData);

		$('#social_media_wrapper').hide();
		$('#sign').hide();
		$('#logout').show();
		$('#username').show();
		$('#compare').show();
		$('#manage').show();

	} else {
		console.log("User is logged out");
		$('#logout').hide();
		$('#username').hide();
		$('#compare').hide();
		$('#manage').hide();
		$('#social_media_wrapper').show();
		$('#sign').show();

	}

});

function createArticle(img, title, link, text1, text2, txtusername, fullDate, vote1, vote2) {

	var article = "";
	if (img === "") {
		article += "<div class='item w2'>";
	} else {
		article += "<div class='item w4'>";
	}
	article += "<p>";
	if (img != "") {

		article += "<a href='" + link + "' >";
		article += "<div style='position:relative;float: left;margin: 0px 15px 15px 0px;'>";
		article += img;
		article += "</div> </a>";

	}
	article += "<p>";

	article += "<h2 class='' style=''><a href='" + link + "' >";
	article += title;
	article += "</a></h2>";
	article += "</p>";
	if (text1 != "") {
		article += "<p>";
		article += text1;
		article += "</p>";
	}
	if (text2 != "") {
		article += "<p>";
		article += text2;
		article += "</p>";
	}
	article += "<p style='position:relative;float: left;'>";
	if (txtusername != "") {
		article += "<span><i class='fa fa-user'></i> </span>";
		article += "<a  href='#'  >";
		article += txtusername;
		article += "</a>";
	}

	article += " <span ><i class='fa fa-clock-o'></i> </span><span>";
	article += fullDate;
	article += "</span>";

	article += " <span ><i class='fa fa-thumbs-o-up'></i> </span> <span >";
	article += vote1;
	article += " - ";
	article += vote2;
	article += "</span> votes";
	article += "</p>";
	article += "<br style='clear: both;' />";
	article += "</p>";
	article += "</div>";

	return article;

}

function populateTable() {

	var table = $("#container1");

	var refCompares = new Firebase("https://infernonero.firebaseio.com/users-compares/" + useridhash);
	// Attach an asynchronous callback to read the data at our posts reference
	refCompares.on("value", function(snapshot) {

		// iterate all the elements :((
		snapshot.forEach(function(ss) {

			var userComparesId = ss.key();

			var compareId = ss.child("compare_id").val();

			var refCompare = new Firebase("https://infernonero.firebaseio.com/compares/" + compareId);

			refCompare.once("value", function(snapshot) {

				var title = snapshot.child("txt_title").val();
				var txt_secret = snapshot.child("txt_secret").val();
				var user_id = snapshot.child("user_id").val();
				var published = snapshot.child("published").val();
				if (published === null || published != true || title === null || (txt_secret != null && txt_secret != "")) {

				} else {
					var refCompareVotes = new Firebase("https://infernonero.firebaseio.com/compares-votes/" + compareId);
					refCompareVotes.once("value", function(snapshotvotes) {

						var voteone = snapshotvotes.child("vote_one").val();
						var votetwo = snapshotvotes.child("vote_two").val();

						var postsRefImages = ref.child("compares-images").child(compareId);

						postsRefImages.once("value", function(snapshotimages) {
							var dateOfCompare = new Date(snapshot.child("date").val());

							var fullTitle = snapshot.child("txt_title").val();
							var txt_one = snapshot.child("txt_one").val();
							var txt_two = snapshot.child("txt_two").val();
							var txt_username = snapshot.child("txt_username").val();
							if (txt_username === null) {
								txt_username = "";
							} else {
								$("#username").text(txt_username);
							}
							var img_one = "";
							var img_two = "";

							var payloadOne = snapshotimages.child("file_one").val();

							if (payloadOne !== null && payloadOne !== "") {
								var img = new Image();
								img.src = payloadOne;
								img_one = "<img src='" + payloadOne + "' height='80' width='80'>";
							} else {
								if (txt_one.indexOf("www.youtube") > -1) {
									img_one = "<img src='images/youtube.png' height='80' width='80'>";
								} else if (txt_one.indexOf("www.ebay") > -1) {
									img_one = "<img src='images/ebay.png' height='80' width='80'>";
								} else if (txt_one.indexOf("www.amazon") > -1) {
									img_one = "<img src='images/amazon.png' height='80' width='80'>";
								} else if (txt_one.indexOf("www.") > -1 || txt_one.indexOf("http:") > -1 || txt_one.indexOf("https:") > -1) {
									img_one = "<img src='images/link.png' height='80' width='80' >";
								} else {
									img_one = "<img src='images/abc.png' height='80' width='80' >";
								}
							}

							var payloadTwo = snapshotimages.child("file_two").val();

							if (payloadOne !== null && payloadOne !== "") {
								var img = new Image();
								img.src = payloadTwo;
								img_two = "<img src='" + payloadTwo + "' height='80' width='80'>";
							} else {
								if (txt_two.indexOf("www.youtube") > -1) {
									img_two = "<img src='images/youtube.png' height='80' width='80'>";
								} else if (txt_two.indexOf("www.ebay") > -1) {
									img_two = "<img src='images/ebay.png' height='80' width='80'>";
								} else if (txt_two.indexOf("www.amazon") > -1) {
									img_two = "<img src='images/amazon.png' height='80' width='80'>";
								} else if (txt_two.indexOf("www.") > -1 || txt_two.indexOf("http:") > -1 || txt_two.indexOf("https:") > -1) {
									img_two = "<img src='images/link.png' height='80' width='80' >";
								} else {
									img_two = "<img src='images/abc.png' height='80' width='80' >";
								}
							}

							var fullDate = dateOfCompare.getDate() + "/" + (parseInt(dateOfCompare.getMonth()) + parseInt(1)) + "/" + dateOfCompare.getFullYear();

							var newDiv = createArticle(img_one + img_two, title, "vote.html#" + compareId, txt_one, txt_two, txt_username, fullDate, voteone, votetwo);

							table.prepend(newDiv).masonry('appended', newDiv);
						});

					}, function(errorObject) {
					});
				}

			}, function(errorObject) {
			});

		});
	}, function(errorObject) {
	});

}


$(document).ready(function() {

	if (authData) {

		followUsersRef.child(authData.uid).child(useridhash).once("value", function(snap) {
			if (snap.child("user_id").val() === null) {
				$('#unfollow').hide();
				$('#follow').show();
			} else {
				$('#follow').hide();
				$('#unfollow').show();
			}
		});

	}

	setUserName();

	$('#loggingout').click(function() {

		ref.unauth();
		window.location.href = "/index.html";

	});

	$('#follow').click(function() {

		if (authData) {

			followUsersRef.child(authData.uid).child(useridhash).set({
				user_id : useridhash
			}, function(error) {
				if (error) {
					$.growl("Compare could not be followed." + error, {
						type : "danger",
						placement : {
							from : "top",
							align : "center"
						}
					});
				} else {

					$('#follow').hide();
					$('#unfollow').show();
					following = true;
					$.growl("User followed", {
						type : "success",
						placement : {
							from : "top",
							align : "right"
						}
					});
				}
			});

		}

	});

	$('#unfollow').click(function() {

		if (authData) {

			followUsersRef.child(authData.uid).child(useridhash).remove();

			$('#follow').show();
			$('#unfollow').hide();
			following = false;
			$.growl("User unfollowed", {
				type : "success",
				placement : {
					from : "top",
					align : "right"
				}
			});

		}

	});

});
