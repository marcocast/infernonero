function convertImagesToSingleImage(text1, text2, src1, src2) {

	if (src1 !== null && src1 !== "" && src2 !== null && src2 !== "") {
		x = 500;
		y = 200;

		var canvas = document.createElement('CANVAS');

		canvas.width = x;
		canvas.height = y;
		var ctx = canvas.getContext('2d');
		var img1 = new Image();
		var img2 = new Image();
		var imgVS = new Image();
		img1.src = src1;
		img2.src = src2;
		imgVS.src = "vs.png";
		ctx.drawImage(img1, 0, 0, 200, 200);
		ctx.drawImage(imgVS, 200, 80, 100, 40);
		ctx.drawImage(img2, 300, 0, 200, 200);

		return canvas.toDataURL("image/png");

	} else {
		return "";
	}

}

