var client = require('./dbHelper');

module.exports = function(req, res, next) {
	//Get our username, userAnswer, location and actualAnswer
	username = req.query.username;
	location = req.query.location;
	userAnswer = req.query.answer;
	query = "SELECT raw FROM image0 in DATABASE " + location + "WHERE username = \'" + username + "\'";

	//Check if our users answer matches the correct answer, and return true or false
	client.query(query, function(err, result) {
		if (err !== null) {
			console.log(err);
		}
		else {
			if (userAnswer == actualAnswer) {
				res.result = true;
			}
			else {
				res.result = false;
			};
			next(res);
		}
	});	
}