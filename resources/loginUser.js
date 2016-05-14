var client = require('./dbHelper');
var passHandler = require('./passwordHandler');

module.exports = function(req, res, next) {

	passHandler.checkPassword(req, res, next);
}
