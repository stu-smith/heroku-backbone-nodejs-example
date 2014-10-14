(function () {

	'use strict';

	var dbUser = require('./db/user.js');

	module.exports.authenticate = function (conn, email, password, callback) {
		dbUser.getUserByEmail(conn, email, password, function (user) {
			if (user === null) {
				callback(null);
			} else {
				callback(user);
			}
		});
	};

}());
