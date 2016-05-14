var client = require('./dbHelper');
var fs = require('fs');

module.exports = {
	make : function(location, callback) {
		var width = "";
		var height = "";

		client.query("SHOW TABLES FROM " + location, function(err, result) { 
			
			//Find the latest table in our Database, i.e. the image still being solved
			var lastTable = result.length - 2;

			//Find the width and height of our image
			client.query("SELECT width FROM " + location + ".dimensions WHERE ID=" + lastTable, function(err, result) {
				if (err)
					console.log(err);
				else
					width = result[0]["width"];
			});

			client.query("SELECT height FROM " + location + ".dimensions WHERE ID=" + lastTable, function(err, result) {
				if (err)
					console.log(err);
				else
					height = result[0]["height"];
			});
			
			//Get all of the values from the table and save them to a PPM file
			var imageData = client.query("SELECT * FROM " + location + ".image" + lastTable, function(err, result) {
				if (err)
					console.log(err);
				else
					var stream = fs.createWriteStream("./img/" + location + lastTable + ".ppm");
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
	
