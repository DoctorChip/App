var client = require('./dbHelper');

module.exports = function() {
	//Get the top 25 scores globally
	query = "SELECT username, userPoints FROM user ORDER BY userPoints DESC LIMIT 25";
	client.query(query, function(err, result) {
		if (err !== null) {
			console.log(err);
		}
		else {
			console.log(result);			
		}
	});
}