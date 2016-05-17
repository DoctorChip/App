var fs = require("fs");
var client = require("./dbHelper");

module.exports = function(location, callback) {
	//Check for the current imageID for the given location
	var query = 
		`SELECT
			li.imageID
		FROM
			location_image li
			JOIN location l ON li.locationID = l.locationID
		WHERE
			l.location = "` + location + "\"";

	client.query(query, function(err, result) { 
		if (err) {
			console.log(err);
		}
		else {
			var filename = result[0]["imageID"] + 1;
			callback(filename);
		}
	});


}