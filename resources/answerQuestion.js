var client = require('./dbHelper');
var importPPM = require('./importPPM');
var findImage = require('./findImage');
var convert = require('./genGIF');
var exportPPM = require('./makePPM');

module.exports = function(req, res, next) {

	//Build our query to find an answer given the username
	var query = 
		`SELECT 
    		q.answer, q.questionID, q.image, q.imageValue
		FROM 
    		question q 
    		JOIN user_question uq ON q.questionID = uq.questionID 
    		JOIN user u ON u.userID = uq.userID 
		WHERE 
    		u.username = ` + client.escape(req.query.username);

    //Run our query
	client.query(query, function(err, result) {
		if (err) {
			console.log(err);
		}
		else {
			//Remove the question from the database, regardless of if it was correct or not		
			var questionID = result[0]["questionID"];
			var imageID = result[0]["image"];
			client.query("DELETE FROM user_question WHERE questionID = " + questionID, function(err, result) {
				client.query("DELETE FROM question WHERE questionID = " + questionID);
			});

			//Then handle if the question was correct or not
			if (req.query.answer == result[0]["answer"]) {
				res.result = true;
					//Add our value to the image table.
					query = "UPDATE " + req.query.location + "." + imageID + " SET user = raw, complete = true WHERE ID = " + result[0]["imageValue"];
					client.query(query, function(err, result) {
						if (err) {
							console.log(err);
						}
						else {
							//Re-create our image
							exportPPM.make(req.query.location, function() {
                				convert.convert(req.query.location + imageID, function() {
                				}
                			}

							//check if this value was the last one in the table
							client.query("SELECT complete FROM " + req.query.location + "." + imageID + " WHERE !complete", function(err, result) {
								if (result.length = 0) {
									findImage(req.query.location, function(err, result) {
										importPPM(filename, req.query.location);
									});
								}
							});
						}
					});
			}
			else {
				res.result = false;
			}
			next();
		}
	});
};
