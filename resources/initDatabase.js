var client = require('./dbHelper');

module.exports = function() {
	//Create our dimensions table to store information about image dimensions
	client.query("CREATE TABLE dimensions (ID INT NOT NULL DEFAULT 0, width INT, height INT)");
	//Create our location table
	client.query("CREATE TABLE location (locationID INT(255) NOT NULL AUTO_INCREMENT PRIMARY KEY, location VARCHAR(255))");
	//Create the user table, which references location
	client.query("CREATE TABLE user (userID INT(9) ZEROFILL AUTO_INCREMENT NOT NULL PRIMARY KEY, username VARCHAR(15), userpass VARCHAR(255), userPoints INT(255), locationID INT(255), FOREIGN KEY (locationID) REFERENCES location(locationID))");
	//Create the solvedImage table
	client.query("CREATE TABLE solvedImage (imageID INT(255) PRIMARY KEY)");
	//Create the join table between user and solvedImage
	client.query("CREATE TABLE user_solvedImage (userID INT(9) ZEROFILL NOT NULL, imageID INT(255), FOREIGN KEY (userID) REFERENCES user(userID), FOREIGN KEY (imageID) REFERENCES solvedImage(imageID))");
	//Create the question table
	client.query("CREATE TABLE question (questionID INT(255) AUTO_INCREMENT PRIMARY KEY, question VARCHAR(255), answer INT(225))");
	//Create the join table between user and question
	client.query("CREATE TABLE user_question (questionID INT(255), userID INT(9) ZEROFILL AUTO_INCREMENT NOT NULL PRIMARY KEY, FOREIGN KEY (questionID) REFERENCES question(questionID) FOREIGN_KEY_CHECKS=0, FOREIGN KEY (userID) REFERENCES user(userID))");
}