var ref = new Firebase('https://infernonero.firebaseio.com');

$('#logout').hide();

var authData = ref.getAuth();

if (authData) {
	populatePopular();

	populateTableByUser();

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
	if (img != "") {
		article += "<p>";
		article += "<a href='" + link + "' >";
		article += "<div style='position:relative;float: right;margin: 0px 0px 15px 15px;'>";
		article += img;
		article += "</div> </a>";
		article += "<p>";
	}

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
	if (img === "") {
		article += "<div class='item w3'>";
	} else {
		article += "<div class='item w4'>";
	}

	if (img != "") {
		article += "<p>";
		article += "<a href='" + link + "' >";
		article += "<div style='position:relative;float: left;margin: 0px 15px 15px 0px;'>";
		article += img;
		article += "</div> </a>";
		article += "<p>";
	}

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

function createArticlePerUsers(img, title, link, text1, text2, txtusername, fullDate, vote1, vote2, userlink) {

	var article = "";
	if (img === "") {
		article += "<div class='item'>";
	} else {
		article += "<div class='item'>";
	}

	if (img != "") {
		article += "<p>";
		article += "<a href='" + link + "' >";
		article += "<div style='position:relative;float: right;margin: 0px 15px 15px 0px;'>";
		article += img;
		article += "</div> </a>";
		article += "<p>";
	}

	article += "<h4 class='' style=''><a href='" + link + "' >";
	article += title;
	article += "</a></h4>";
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

	var refCompares = new Firebase("https://infernonero.firebaseio.com/follow-compares/" + authData.uid);
	refCompares.on("value", function(followsnapshot) {

		// iterate all the elements :((
		followsnapshot.forEach(function(ss) {

			var userComparesId = ss.key();

			var compareId = ss.child("compare_id").val();

			if (compareId === null) {
			} else {
				var refCompare = new Firebase("https://infernonero.firebaseio.com/compares/" + compareId);

				refCompare.once("value", function(snapshot) {

					var title = snapshot.child("txt_title").val();

					if (title === null) {

					} else {
						var refCompareVotes = new Firebase("https://infernonero.firebaseio.com/compares-votes/" + compareId);
						refCompareVotes.once("value", function(snapshotvotes) {

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
									img_one = "<img src='" + payloadOne + "' height='120' width='120'>";
								} else {
									if (txt_one.indexOf("www.youtube") > -1) {
										img_one = "<img src='images/youtube.png' height='120' width='120'>";
									} else if (txt_one.indexOf("www.ebay") > -1) {
										img_one = "<img src='images/ebay.png' height='120' width='120'>";
									} else if (txt_one.indexOf("www.amazon") > -1) {
										img_one = "Collignon<img src='images/amazon.png' height='120' width='120'>";
									}
								}

								var payloadTwo = snapshotimages.child("file_two").val();

								if (payloadOne !== null && payloadOne !== "") {
									var img = new Image();
									img.src = payloadTwo;
									img_two = "<img src='" + payloadTwo + "' height='120' width='120'>";
								} else {
									if (img_two.indexOf("www.youtube") > -1) {
										img_two = "<img src='images/youtube.png' height='120' width='120'>";
									} else if (img_two.indexOf("www.ebay") > -1) {
										img_two = "<img src='images/ebay.png' height='120' width='120'>";
									} else if (img_two.indexOf("www.amazon") > -1) {
										img_two = "<img src='images/amazon.png' height='120' width='120'>";
									}
								}
								var voteone = snapshotvotes.child("vote_one").val();
								var votetwo = snapshotvotes.child("vote_two").val();

								var fullDate = dateOfCompare.getDate() + "/" + (parseInt(dateOfCompare.getMonth()) + parseInt(1)) + "/" + dateOfCompare.getFullYear();

								var userlink = "userwall.html#" + user_id;
								var choozzelink = "vote.html#" + ss.key();

								var newDiv = createArticle(img_one + img_two, title, choozzelink, txt_one, txt_two, txt_username, fullDate, voteone, votetwo, userlink);

								table.prepend(newDiv).masonry('appended', newDiv);
							});

						}, function(errorObject) {
						});
					}

				}, function(errorObject) {
				});

			}

		});
	}, function(errorObject) {
	});
}

function populateTableByUser() {

	var table = $("#container1");

	var refCompares = new Firebase("https://infernonero.firebaseio.com/follow-users/" + authData.uid);
	refCompares.on("value", function(followsnapshot) {

		// iterate all the elements :((
		followsnapshot.forEach(function(ss) {

			populateTableByUserId(ss.key());

		});
	}, function(errorObject) {
	});
}

function populateTableByUserId(useridhash) {

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

				if (published === null || published != true  || title === null || (txt_secret != null && txt_secret != "")) {

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
								img_one = "<img src='" + payloadOne + "' height='60' width='60'>";
							} else {
								if (txt_one.indexOf("www.youtube") > -1) {
									img_one = "<img src='images/youtube.png' height='60' width='60'>";
								} else if (txt_one.indexOf("www.ebay") > -1) {
									img_one = "<img src='images/ebay.png' height='60' width='60'>";
								} else if (txt_one.indexOf("www.amazon") > -1) {
									img_one = "<img src='images/amazon.png' height='60' width='60'>";
								}
							}

							var payloadTwo = snapshotimages.child("file_two").val();

							if (payloadOne !== null && payloadOne !== "") {
								var img = new Image();
								img.src = payloadTwo;
								img_two = "<img src='" + payloadTwo + "' height='60' width='60'>";
							} else {
								if (img_two.indexOf("www.youtube") > -1) {
									img_two = "<img src='images/youtube.png' height='60' width='60'>";
								} else if (img_two.indexOf("www.ebay") > -1) {
									img_two = "<img src='images/ebay.png' height='60' width='60'>";
								} else if (img_two.indexOf("www.amazon") > -1) {
									img_two = "<img src='images/amazon.png' height='60' width='60'>";
								}
							}

							var fullDate = dateOfCompare.getDate() + "/" + (parseInt(dateOfCompare.getMonth()) + parseInt(1)) + "/" + dateOfCompare.getFullYear();

							var userlink = "userwall.html#" + useridhash;
							var choozzelink = "vote.html#" + compareId;

							var newDiv = createArticlePerUsers(img_one + img_two, title, choozzelink, txt_one, txt_two, txt_username, fullDate, voteone, votetwo, userlink);

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

function populatePopular() {

	var table = $("#container2");

	var refCompares = new Firebase("https://infernonero.firebaseio.com/compares");
	refCompares.limitToLast(100).on("value", function(followsnapshot) {

		// iterate all the elements :((
		followsnapshot.forEach(function(ss) {

			var compareId = ss.key();

			var refCompare = new Firebase("https://infernonero.firebaseio.com/compares/" + ss.key());

			refCompare.once("value", function(snapshot) {

				var title = snapshot.child("txt_title").val();
				var txt_secret = snapshot.child("txt_secret").val();
				var published = snapshot.child("published").val();

				if (published === null || published != true || title === null || (txt_secret != null && txt_secret != "")) {

				} else {
					var refCompareVotes = new Firebase("https://infernonero.firebaseio.com/compares-votes/" + compareId);
					refCompareVotes.once("value", function(snapshotvotes) {

						var voteone = snapshotvotes.child("vote_one").val();
						var votetwo = snapshotvotes.child("vote_two").val();

						if (parseInt(voteone) > 20 || parseInt(votetwo) > 20) {

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
