var ref = new Firebase('https://infernonero.firebaseio.com');

$('#logout').hide();

var authData = ref.getAuth();

if (authData) {
	populatePopular();

	populateTable();
} else {
	window.location.href = "/index.html";
}

var isNewUser = true;
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

function createArticlePopular(img, title, link, text1, text2, txtusername, fullDate, vote1, vote2) {

	var article = "";
	article += "<div class='item w4'>";
	article += "<p>";
	if (img != "") {

		article += "<a href='" + link + "' >";
		article += "<div>";
		article += img;
		article += "</div> </a>";

	}
	article += "<p>";
	article += "<b><a href='" + link + "' >";
	article += title;
	article += "</a></b>";
	article += "</p>";

	article += "<br style='clear: both;' />";
	article += "</p>";
	article += "</div>";

	return article;

}

function createArticle(img, title, link, text1, text2, txtusername, fullDate, vote1, vote2, userlink) {

	var article = "";
	article += "<div class='item w4'>";

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
	article += "<p style='position:relative;float: right;'>";
	if (txtusername != "") {
		article += "<span><i class='fa fa-user'></i> </span>";
		article += "<a  href='" + userlink + "'  >";
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

	var refCompares = new Firebase("https://infernonero.firebaseio.com/users-compares/simplelogin:53");
	refCompares.limitToLast(100).on("value", function(followsnapshot) {

		// iterate all the elements :((
		followsnapshot.forEach(function(ss) {

			var compareId = ss.child("compare_id").val();

			var refCompare = new Firebase("https://infernonero.firebaseio.com/compares/" + compareId);

			refCompare.once("value", function(snapshot) {

				var title = snapshot.child("txt_title").val();
				var txt_secret = snapshot.child("txt_secret").val();
				var published = snapshot.child("published").val();
				var txt_tags = snapshot.child("txt_tags").val();

				if (txt_tags === null || published === null || published != true || title === null || (txt_secret != null && txt_secret != "")) {

				} else {
					var thisContext = false;
					txt_tags.split("/\s*,\s*").forEach(function(myString) {
						if (myString === "gossip") {
							thisContext = true;
						}
					});
					if (thisContext) {
						var refCompareVotes = new Firebase("https://infernonero.firebaseio.com/compares-votes/" + compareId);
						refCompareVotes.once("value", function(snapshotvotes) {

							var voteone = snapshotvotes.child("vote_one").val();
							var votetwo = snapshotvotes.child("vote_two").val();

							var postsRefImages = ref.child("compares-images").child(compareId);

							postsRefImages.once("value", function(snapshotimages) {
								var dateOfCompare = new Date(snapshot.child("date").val());

								var fullTitle = snapshot.child("txt_title").val();
								var txt_one = snapshot.child("txt_one").val();
								var user_id = snapshot.child("user_id").val();
								var txt_two = snapshot.child("txt_two").val();
								var txt_username = snapshot.child("txt_username").val();
								if (txt_username === null) {
									txt_username = "";
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
									}
								}

								var payloadTwo = snapshotimages.child("file_two").val();

								if (payloadOne !== null && payloadOne !== "") {
									var img = new Image();
									img.src = payloadTwo;
									img_two = "<img src='" + payloadTwo + "' height='80' width='80'>";
								} else {
									if (img_two.indexOf("www.youtube") > -1) {
										img_two = "<img src='images/youtube.png' height='80' width='80'>";
									} else if (img_two.indexOf("www.ebay") > -1) {
										img_two = "<img src='images/ebay.png' height='80' width='80'>";
									} else if (img_two.indexOf("www.amazon") > -1) {
										img_two = "<img src='images/amazon.png' height='80' width='80'>";
									}
								}

								var fullDate = dateOfCompare.getDate() + "/" + (parseInt(dateOfCompare.getMonth()) + parseInt(1)) + "/" + dateOfCompare.getFullYear();

								var userlink = "userwall.html#" + user_id;
								var choozzelink = "vote.html#" + ss.key();

								var newDiv = createArticle(img_one + img_two, title, choozzelink, txt_one, txt_two, txt_username, fullDate, voteone, votetwo, userlink);
								table.prepend(newDiv).masonry('appended', newDiv);
							});

						}, function(errorObject) {
						});
					}
				}

			}, function(errorObject) {
			});

		});
	}, function(errorObject) {
	});

}

function populatePopular() {

	var table = $("#container2");

	var refCompares = new Firebase("https://infernonero.firebaseio.com/users-compares/simplelogin:53");
	refCompares.limitToLast(100).on("value", function(followsnapshot) {

		// iterate all the elements :((
		followsnapshot.forEach(function(ss) {

			var compareId = ss.child("compare_id").val();

			var refCompare = new Firebase("https://infernonero.firebaseio.com/compares/" + compareId);

			refCompare.once("value", function(snapshot) {

				var title = snapshot.child("txt_title").val();
				var txt_secret = snapshot.child("txt_secret").val();
				var published = snapshot.child("published").val();
				var txt_tags = snapshot.child("txt_tags").val();

				if (txt_tags === null || published === null || published != true || title === null || (txt_secret != null && txt_secret != "")) {

				} else {
					var refCompareVotes = new Firebase("https://infernonero.firebaseio.com/compares-votes/" + compareId);
					refCompareVotes.once("value", function(snapshotvotes) {

						var voteone = snapshotvotes.child("vote_one").val();
						var votetwo = snapshotvotes.child("vote_two").val();
						var thisContext = false;
						txt_tags.split("/\s*,\s*").forEach(function(myString) {
							if (myString === "gossip") {
								thisContext = true;
							}
						});
						if (thisContext && (parseInt(voteone) > 20 || parseInt(votetwo) > 20)) {

							var postsRefImages = ref.child("compares-images").child(compareId);

							postsRefImages.once("value", function(snapshotimages) {
								var dateOfCompare = new Date(snapshot.child("date").val());

								var fullTitle = snapshot.child("txt_title").val();
								var txt_one = snapshot.child("txt_one").val();
								var txt_two = snapshot.child("txt_two").val();
								var txt_username = snapshot.child("txt_username").val();
								if (txt_username === null) {
									txt_username = "";
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
									}
								}

								var payloadTwo = snapshotimages.child("file_two").val();

								if (payloadOne !== null && payloadOne !== "") {
									var img = new Image();
									img.src = payloadTwo;
									img_two = "<img src='" + payloadTwo + "' height='80' width='80'>";
								} else {
									if (img_two.indexOf("www.youtube") > -1) {
										img_two = "<img src='images/youtube.png' height='80' width='80'>";
									} else if (img_two.indexOf("www.ebay") > -1) {
										img_two = "<img src='images/ebay.png' height='80' width='80'>";
									} else if (img_two.indexOf("www.amazon") > -1) {
										img_two = "<img src='images/amazon.png' height='80' width='80'>";
									}
								}

								var fullDate = dateOfCompare.getDate() + "/" + (parseInt(dateOfCompare.getMonth()) + parseInt(1)) + "/" + dateOfCompare.getFullYear();

								var newDiv = createArticlePopular(img_one + img_two, title, "vote.html#" + ss.key(), txt_one, txt_two, txt_username, fullDate, voteone, votetwo);

								table.prepend(newDiv).masonry('appended', newDiv);
							});
						}
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

	setUserName();

	$('#loggingout').click(function() {

		ref.unauth();
		window.location.href = "/index.html";

	});

});
