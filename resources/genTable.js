var client = require('./dbHelper');

module.exports = function(tableName) {
	client.query("CREATE TABLE " + tableName + " (ID INT NOT NULL AUTO_INCREMENT, raw TINYINT(3) UNSIGNED, user TINYINT(3) UNSIGNED NOT NULL DEFAULT 0, complete BOOLEAN NOT NULL DEFAULT 0, PRIMARY KEY(ID))");
}
