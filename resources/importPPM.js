var client = require('./dbHelper');
var addTable = require('./genTable');
var fs = require('fs');

module.exports = function(filename, location) {	

	//Initialise our variables
	var dataArray = [];
	var dataLength = "";
	var chunk = "";
	var dataString = "";
	var targetTable = "";
	var length = 0;
	var width = 0;
	var height = 0;
	var counter = 0;

	//Create our Datastream to read from our .PPM file
	var dataStream = fs.createReadStream("./img/src" + filename + ".ppm");
	dataStream.setEncoding('ascii');
	dataStream.on('readable', function() {
		while ((chunk=dataStream.read()) != null) {
			dataString += chunk;			
		}
	});

	//Once our stream has read the entire file and has saved it to our buffer, 'dataString'...
	dataStream.on('end', function() {
		dataArray = dataString.split("\n");
		dataLength = dataArray.length;
		width = dataArray[2].split(" ")[0];
		height = dataArray[2].split(" ")[1];

		//Finally add all of our data to our location's Database
		client.query("SELECT COUNT(ID) FROM " + location + ".dimensions", function(err, result) {
			if (err) {
				console.log(err);
			}
			else {
				length = result[0]["COUNT(ID)"];

				//Add our new dimensions to our dimensions table	
				client.query("INSERT INTO " + location + ".dimensions (ID, width, height) VALUES (" + length + ", " + width + ", " + height + ")", function(err, result) {

					//Check how many images we have stored in total
					client.query("SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = '" + location + "'", function(err, result) {
						if (err) {
							console.log(err);
						}
						else {
							var tableNumber = parseInt(result[0]["COUNT(*)"]) - 1;
							targetTable = location + ".image" + tableNumber;
							addTable(targetTable);
							while (counter <= (dataLength - 2)) {
								if (counter >= 3) {
									client.query("INSERT INTO " + targetTable + " (raw) VALUES (" + dataArray[counter] + ")");
								}
								counter++;
							}
						}
					});
				});	
			}
		});
	});
}