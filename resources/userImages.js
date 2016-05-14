var client = require('./dbHelper');

module.exports = function(username) {
	query = "SELECT userID FROM user WHERE username = " + client.escape(username);
	client.query(query, function(err, result) {
		if (err !== null) {
			console.log(err);
		}
		else {
			client.query("SELECT imageID FROM user_solvedImage WHERE userID = " + result[0]["userID"], function(err, result) {
				if (err !== null) {
					console.log(err);
				}
				else {
					console.log("All solved images: " + result);
				}
			});
		}
	});
}