var client = module.exports = require('mysql').createConnection({
	user : 'root',
	password : 'sudowoodo',
	database : 'mathsDB'
});

client.connect();
