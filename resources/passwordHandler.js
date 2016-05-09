var client = require('./dbHelper');
var bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = {
	hashPassword : function(userName, userPassword) {
		bcrypt.hash(userPassword, saltRounds, function(err, hash) {
			query = "UPDATE user SET userpass = \"" + hash + "\" WHERE username = \"" + userName + "\"";
			client.query(query, function(err, res) {
				if (err) {
					console.log(err);
				}
			});
		});
	},

	checkPassword : function(userName, userPassword) {
		query = "SELECT userpass FROM user WHERE username = \'" + userName + "\';";
		client.query(query, function(err, result) {
			console.log(result[0]["userpass"]);
			bcrypt.compare(userPassword, result[0]["userpass"], function(err, res) {
				if (!res) {
					console.log("Try again.");
				}
				else {
					console.log("Logging in...");
				}
			});
		});
	}
}
