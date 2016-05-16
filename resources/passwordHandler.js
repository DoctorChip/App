var client = require('./dbHelper');
var bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = {
	hashPassword : function(req, res) {
		bcrypt.hash(escape(req.query.userpass), saltRounds, function(err, hash) {
			query = "UPDATE user SET userpass = \"" + hash + "\" WHERE username = " + client.escape(req.query.username);
			client.query(query, function(err, res) {
				if (err) {
					console.log(err);
				}
			});
		});
	},

	checkPassword : function(req, res, next) {
		query = "SELECT userpass FROM user WHERE username = " + client.escape(req.query.username);
		client.query(query, function(err, result) {
			bcrypt.compare(escape(req.query.userpass), result[0]["userpass"], function(err, result) {
				if (!result) {
					res.login = false;
					next();
				}
				else {
					res.login = true;
					next();
				}
			});
		});
	}
}
