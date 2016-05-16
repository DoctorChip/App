
var client = require('./dbHelper');
var importPPM = require('./importPPM');

module.exports = function(fileName) {
	//Check how many locations we have
	client.query("SELECT location FROM location", function(err, result) {
		if (err) {
			console.log(err);
		}
		else {
			locationNum = result.length;
			
			//For each location, import our PPM into the table
			for (i = 0; i < locationNum; i++) {
				importPPM(fileName, result[i]["location"]);
			}
		}
	});
}