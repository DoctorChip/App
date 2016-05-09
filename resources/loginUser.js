var client = require('./dbHelper');
var passHandler = require('./passwordHandler');

module.exports = function(details) {

	passHandler.checkPassword(escape(details.username), escape(details.userpass));
}
