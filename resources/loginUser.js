var client = require('./dbHelper');
var passHandler = require('./passwordHandler');

module.exports = function(details) {

	passHandler.checkPassword(details.username, details.userpass);
}
