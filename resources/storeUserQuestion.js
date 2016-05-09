var client = require('./dbHelper');

module.exports = function(req, res, next) {
	client.query("INSERT INTO question (question) VALUE (\"" + res.question + "\")", function(err, result) {
		client.query("SELECT questionID FROM question WHERE questionID = LAST_INSERT_ID()", function(err, result) {
			var questionID = result[0]["questionID"];
			client.query("SELECT userID FROM user WHERE username = \"" + req.query.username + "\"", [questionID], function(err, result) {
				query = "INSERT INTO user_question (userID, questionID) VALUES (" + result[0]["userID"] + ", " + questionID + ")";
				client.query(query, function(err, result) {
					if (err !== null) {
						console.log(err);
					}
				});
				next();
			});		
		});
	});	
}
