function convertImagesToSingleImage(text1, text2, src1, src2) {

	if (src1 !== null && src1 !== "" && src2 !== null && src2 !== "") {

		var canvas = document.createElement('CANVAS');

		canvas.width = 500;
		canvas.height = 250;
		var ctx = canvas.getContext('2d');
		var img1 = new Image();
		var img2 = new Image();
		var imgVS = new Image();
		img1.src = src1;
		img2.src = src2;

		imgVS.src = "https://www.choozzy.com/images/versus.png";

		ctx.drawImage(img1, 0, 0, 250, 250);
		ctx.drawImage(img2, 250, 0, 250, 250);

		var txt = "Choozze-it!";
		ctx.font="bold 40px Arial";
		ctx.fillStyle="#FFFFFF";
		//shadow ;-)
		ctx.fillText(txt,160,110);
		ctx.fillText(txt,164,114);
		ctx.fillText(txt,160,114);
		ctx.fillText(txt,164,110);

		ctx.fillStyle="#3fa891";
		ctx.fillRect(167, 197, 185, 50);
		
		ctx.fillStyle="#4fb8a1";
		ctx.fillText(txt,162,112);
		ctx.fillRect(165, 195, 185, 50);
		ctx.fillStyle="#FFFFFF";
		ctx.fillText("VOTE",200,235);

		
		return canvas.toDataURL("image/jpeg");

	} else {
		return "";
	}

}

