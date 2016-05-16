var client = require('./dbHelper');
var passHandler = require('./passwordHandler');

module.exports = function(req, res) {
	//Check if the username is available
	client.query("SELECT * FROM user WHERE username = " + client.escape(req.query.username), function(err, result) {
		if (result[0] == undefined) {
			//Find our user's location ID
			client.query("SELECT locationID FROM location WHERE location = " + client.escape(req.query.location), function(err, result) {
				if (result[0] !== undefined) {
					//Our location is in the database
					var locationID = result[0]["locationID"];
					addDetails(locationID, req, res);
				}
				else {
					//Our location isn't in the database, so add it
					client.query("INSERT INTO location (location) VALUES(" + client.escape(req.query.location) + ")", function(err, result) {
						if (err !== null) { 
							console.log(err);
						}
						else {
							client.query("SELECT locationID FROM location WHERE location = " + client.escape(req.query.location), function(err, result) {
								//Find the ID of our newly added location
								if (err !== null) {
									console.log(err);
								}
								else {
									var locationID = result[0]["locationID"];
									addDetails(locationID, req, res);	
									
									//Create our location Database
									client.query("CREATE DATABASE " + req.query.location, function(err, result) {
										if (err) {
											console.log(err);
										}
										else {
											client.query("CREATE TABLE " + req.query.location + ".dimensions (ID INT NOT NULL DEFAULT 0, width INT, height INT)");
										}
									});
								}
							});
						}
					});
				}
			});			
		}
		//If our username is taken
		else {
			console.log("USERNAME NOT AVAILABLE");
		}
	});		
}

function addDetails(locationID, req, res) {
	//Create a new user entry
	var query = "INSERT INTO user (username, userPoints, locationID) VALUES (" + client.escape(req.query.username) + ", 0, " + locationID + ")";
	client.query(query, function(err, result) {
		if (err !== null) {
			console.log(err);
		}
		else {
			passHandler.hashPassword(req, res);			
		}
	});
}
