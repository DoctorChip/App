var client = require('./dbHelper');

module.exports = function(location) {
	//Find our user's location ID
	client.query("SELECT locationID FROM location WHERE location = \'" + location + "\'", function(err, result) {
		if (result[0] !== undefined) {
			//Our location is in the database
			var locationID = result[0]["locationID"];

			//Get the top 25 scores in this area
			query = "SELECT username, userPoints FROM user WHERE locationID = " + locationID + " ORDER BY userPoints DESC LIMIT 25";
			client.query(query, function(err, result) {
				if (err !== null) {
					console.log(err);
				}
				else {
					console.log(result);
				}
			});
		}
		else {
			console.log("Location doesn't have a high score...");
		}
	});
}