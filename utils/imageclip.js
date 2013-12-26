/*
	用于头像图片裁剪
*/
var gm = require('gm'),
	path = require('path'),
	imageMagick = gm.subClass({ imageMagick: true });  


exports.resizeImg = function(imgPath,width,height,namePrefix,callback) {
	var imgDir = path.dirname(imgPath),
		imgExt = path.extname(imgPath),
		newImgPath = imgDir + path.sep +namePrefix + imgExt;

		
		imageMagick(imgPath)
		.resize(width, height)
		.autoOrient()
		.write(newImgPath, function(err){
			if(err) {
				throw err;
			}
			console.log('resized image to fit within ' + width + 'x' + height);
			if(callback) {
				callback();
			}
		});  		
};