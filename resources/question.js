var client = require('./dbHelper');

module.exports = {
	gen : function(req, res, next) {
		//Query our database
        client.query("SHOW TABLES FROM " + req.query.location, [req, res, next], function(err, result) {
                if (err) {
                        console.log(err);
                }

                else {          
                        //Calculate the length of our table and then the last image in the table
                        res.currentImage = "image" + (result.length - 2);
                        //Now we know the correct image, get a random value
                        query = "SELECT * FROM " + req.query.location + "." + res.currentImage + " WHERE complete = 0 ORDER BY RAND() LIMIT 1;";
						client.query(query, [req, res, next], function(err, result) {
							res.answer = result[0]["raw"];
							res.answerID = result[0]["ID"];
							//Now we have our value, format our Question
							formatQuestion(req, res, next);
						});
                }
        });
	}
}

//Function to accept a value and form a question
function formatQuestion(req, res, next) {
	var value1 = 0;
	var value2 = 0;
	var val_max = 255;
	var val_min = 0;
	var operand = "";
	var isPrime = false;

	if (checkPrime(res.answer) == true) {
		isPrime = true;
	}

	//Randomly choose one of 4 possible cases
	switch (selectCase(isPrime)) {
		case 0: 
				value1 = Math.round(Math.random() * (val_max - val_min) + val_min); //Randomly generate a number between 0 and 255;
				while (value1 >= res.answer) {
					value1 = Math.round(Math.random() * (val_max - val_min) + val_min); //Check if we need to do it again...
				}
				value2 = res.answer - value1; //Calculate our last value from our two knowns.
				operand = "+";
				break;
		case 1: 
				value1 = Math.round(Math.random() * (val_max - val_min) + val_min); //Randomly generate a number between 0 and 255;
				value2 = value1 + res.answer; //Calculate how much we need to add on to our value2 to get our answer...
				operand = "-";
				break;
		case 2: 
				value1 = Math.round(Math.random() * 10); //Randomly generate a value from 0 to 10
				while ((res.answer / value1) % 1 != 0 || value1 == 1) { //Check if our value is a denom of our answer
					value1 = Math.round(Math.random() * 10); //If not, find a new value
				}
				value2 = res.answer / value1; //Calculate our last value from our two knowns
				operand = "*";
				break;
		case 3: 
				value1 = Math.round(Math.random() * 5); //Randomly generate a value from 0 to 10
				value2 = res.answer * value1; //Calculate our last value from our two knowns
				operand = "/";
				break;
	}

	//Form our question
	res.question = value2 + " " + operand + " " + value1;
	next();
}

//Determine if the number is prime
function checkPrime(value) {
    for(var i = 2; i < value; i++) {
        if(value % i === 0) {
            return false;
        }
    }
    return true;
}

//Take into account if number is prime to select our case
function selectCase(isPrime) {
	var value = Math.round(Math.random() * 3);
	if (isPrime == true && value == 2) {
		value = Math.round(Math.random());
	}
	return value;
}
