var client = require('./dbHelper');

module.exports = function(req, res, next, callback) {
	query =
		`SELECT 
    		q.question, q.questionID, q.answer
		FROM 
    		question q 
    		JOIN user_question uq ON q.questionID = uq.questionID 
    		JOIN user u ON u.userID = uq.userID 
		WHERE 
    		u.username = ` + client.escape(req.query.username);

	client.query(query, function(err, result) {
		if (err) {
			console.log(err);
		}
		else {
			if (result[0] == null) {
				callback();
			}
			else {
				//give them the Q
				var question = result[0]["question"];
				var questionID = result[0]["questionID"];
				var answer = result[0]["answer"];

				client.query("SELECT question FROM question WHERE questionID = " + questionID, function(err, result) {
					if (err) {
						console.log(err);
					}
					else {
						res.send(question + " = " + answer);
						res.end();
					}
				});
			}
		}
	});
}