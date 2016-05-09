var client = require('./dbHelper');

module.exports = function(req, res, next) {
	//Get our username, userAnswer, location and actualAnswer
	username = escape(req.query.username);
	location = escape(req.query.location);
	userAnswer = escape(req.query.answer);

	//Check if our users answer matches the correct answer, and return true or false
	client.query("SELECT userID FROM user WHERE username = \"" + username + "\"", function(err, result) {
		if (err !== null) {
			console.log(err);
		}
		else {
			client.query("SELECT questionID FROM user_question WHERE userID = " + result[0]["userID"], function(err, result) {
				if (err !== null) {
					console.log(err);
				}
				else {
					client.query("SELECT * FROM question WHERE questionID = " + result[0]["questionID"], function(err, result) {
						if (err !== null) {
							console.log(err);
						}
						else {
							//Remove the question from user_question and question tables.
							if (userAnswer == result[0]["answer"]) {
								res.result = true;
									//Add our value to the image table.
							}
							else {
								res.result = false;
							}
							next(res);
						};
					});
				};
			});
		};
	});
};
