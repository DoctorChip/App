var client = require('./dbHelper');

module.exports = function(username) {
	//Check how many points the user has
	query = "SELECT userPoints FROM user WHERE username = \"" + escape(username) + "\"";
	client.query(query, function(err, result) {
		console.log(result);
	});
}
