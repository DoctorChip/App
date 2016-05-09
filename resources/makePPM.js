var client = require('./dbHelper');
var fs = require('fs');

module.exports = {
	make : function(callback) {
		var width = "";
		var height = "";

		client.query("SHOW TABLES FROM mathsDB", function(err, result) { 
			
			//Find the latest table in our Database, i.e. the image still being solved
			var lastTable = result[result.length - 7]["Tables_in_mathsDB"];
			var dimensionID = lastTable.substring(5);

			//Find the width and height of our image
			client.query("SELECT width FROM dimensions WHERE ID=" + dimensionID + "", function(err, result) {
				if (err)
					console.log(err);
				else
					width = result[0]["width"];
			});

			client.query("SELECT height FROM dimensions WHERE ID=" + dimensionID + "", function(err, result) {
				if (err)
					console.log(err);
				else
					height = result[0]["height"];
			});
			
			//Get all of the values from the table and save them to a PPM file
			var imageData = client.query("SELECT * FROM " + lastTable + "", function(err, result) {
				if (err)
					console.log(err);
				else
					var stream = fs.createWriteStream("./img/" + lastTable + ".ppm");
					stream.once('open', function() {
						stream.write("P3\n");
						stream.write(width + " " + height + "\n");
						for (var count = 0; count < result.length; count++) {
							stream.write(result[count]["raw"] + "\n");
						};
					callback();
					});
			});
		});
	}
}
	
