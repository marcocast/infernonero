function convertImagesToSingleImage(text1, text2, src1, src2) {

	if (src1 !== null && src1 !== "" && src2 !== null && src2 !== "") {
		x = 200;
		y = 100;

		var canvas = document.createElement('CANVAS');

		canvas.width = x;
		canvas.height = y;
		var ctx = canvas.getContext('2d');
		var img1 = new Image();
		var img2 = new Image();
		img1.src = src1;
		img2.src = src2;
		ctx.drawImage(img1, 0, 0, 100, 100);
		ctx.drawImage(img2, 100, 0, 100, 100);

		return canvas.toDataURL("image/png");

	} else {
		return "";
	}

}

