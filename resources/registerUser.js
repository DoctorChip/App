var client = require('./dbHelper');
var passHandler = require('./passwordHandler');

module.exports = function(details) {
	//Check if the username is available
	client.query("SELECT * FROM user WHERE username = \'" + details.username + "\'", function(err, result) {
		if (result[0] == undefined) {
			//Find our user's location ID
			client.query("SELECT locationID FROM location WHERE location = \'" + details.location + "\'", function(err, result) {
				if (result[0] !== undefined) {
					//Our location is in the database
					var locationID = result[0]["locationID"];
					addDetails(locationID, details);
				}
				else {
					//Our location isn't in the database, so add it
					client.query("INSERT INTO location (location) VALUES(\"" + details.location + "\")", function(err, result) {
						if (err !== null) { 
							console.log(err);
						}
						else {
							client.query("SELECT locationID FROM location WHERE location = \'" + details.location + "\'", function(err, result) {
								//Find the ID of our newly added location
								if (err !== null) {
									console.log(err);
								}
								else {
									var locationID = result[0]["locationID"];
									addDetails(locationID, details);	
									
									//Create our location Database
									client.query("CREATE DATABASE " + details.location, function(err, result) {
										if (err) {
											console.log(err);
										}
										else {
											client.query("CREATE TABLE " + details.location + ".dimensions (ID INT NOT NULL DEFAULT 0, width INT, height INT)");
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

function addDetails(locationID, details) {
	//Create a new user entry
	var query = "INSERT INTO user (username, userPoints, locationID) VALUES (\'" + details.username + "\', 0, " + locationID + ")";
	client.query(query, function(err, result) {
		if (err !== null) {
			console.log(err);
		}
		else {
			passHandler.hashPassword(details.username, details.userpass);			
		}
	});
}
