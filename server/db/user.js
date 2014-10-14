(function () {

	'use strict';

	var crypto = require('crypto'),
		_ = require('underscore'),
		hash = function (pass, salt) {
			var h = crypto.createHash('sha512');

			h.update(pass);
			h.update(salt);

			return h.digest('hex');
		};

	module.exports.toString = function () {
		return '<db-user>';
	};

	module.exports.getUser = function (conn, userid, callback) {
		conn.query({
			name: 'getUser',
			text: 'SELECT "email", "passwordHash", "expiry" FROM "user" WHERE "id" = $1 LIMIT 1',
			values: [userid]
		}, function (err, result) {
			var row;

			if (err) {
				console.error(err);
				callback(null);
			} else {
				if (result.rows.length === 0) {
					callback(null);
				} else {
					row = result.rows[0];

					callback({id: userid, email: row.email, expiry: row.expiry});
				}
			}
		});
	};

	module.exports.getUserByEmail = function (conn, email, password, callback) {
		conn.query({
			name: 'getUserByEmail',
			text: 'SELECT "id", "passwordHash", "expiry" FROM "user" WHERE "email" = $1 LIMIT 1',
			values: [email]
		}, function (err, result) {
			var newHash, row;

			if (err) {
				throw err;
			}
			if (result.rows.length === 0) {
				callback(null);
			} else {
				newHash = hash(password, email);
				row = result.rows[0];

				if (row.passwordHash === newHash) {
					callback({id: row.id, email: email, expiry: row.expiry});
				} else {
					callback(null);
				}
			}
		});
	};

	module.exports.addUser = function (conn, email, password, expiry, callback) {
		var newHash = hash(password, email);

		conn.query({
			name: 'addUser',
			text: 'INSERT INTO "user" ("email", "passwordHash", "expiry") VALUES ($1, $2, $3) RETURNING "id"',
			values: [email, newHash, expiry]
		}, function (err, result) {
			var id;

			if (err) {
				console.error(err);
				callback(null);
			} else {
				id = result.rows[0].id;

				callback({id: id, email: email, expiry: expiry});
			}
		});
	};

	module.exports.extendExpiry = function (conn, userid, extend, callback) {
		conn.query({
			name: 'extendExpiry',
			text: 'UPDATE "user" SET "expiry" = ("expiry" + ($2 || \' month\')::INTERVAL) WHERE "id" = $1',
			values: [userid, extend]
		}, function (err, result) {
			if (err) {
				console.error(err);
				callback(null);
			} else {
				callback({});
			}
		});
	};

}());
