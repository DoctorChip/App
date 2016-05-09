var easyimg = require('easyimage');
var srcImg  = "";
var destImg = "";

module.exports = {
    convert : function(input, callback) {
	srcImg  = "./img/" + input + ".ppm";
	destImg = "./img/" + input + ".gif";

	easyimg.convert({src:srcImg, dst:destImg, quality:100}).then(
  			function(file) {
  				callback();
  			},
  			function(err) {
  				console.log(err);
  			}
  		);
    }
}
