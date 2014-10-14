(function () {

	'use strict';

	var dbUser = require('../db/user.js'),
		authentication = require('../authentication.js'),
		transport = require('../transport.js'),
		utility = require('./utility.js');

	module.exports.setupRouting = function (app, conn) {

		app.get('/api/users/:userid', function (req, res) {
			utility.checkReadAllowed(req, res, function () {
				var userid = utility.getUserId(req);

				dbUser.getUser(conn, userid, function (user) {
					if (user) {
						req.session.user = user;
						res.send(user);
					} else {
						res.send('Not found.', 400);
					}
				});
			});
		});

		app.post('/api/users', function (req, res) {
			var data = transport.unpack(req, ['email', 'password']),
				expiry = new Date();

			expiry.setDate(expiry.getDate() + 30);

			dbUser.addUser(conn, data.email, data.password, expiry, function (user) {
				if (!user) {
					res.send('Failed to create user. The email address supplied may already be in use.', 403);
				} else {
					req.session.user = user;
					res.send(user);
				}
			});
		});

		app.post('/api/logout', function (req, res) {
			var s = req.session;

			if (s.user) {
				delete s.user;
			}
			res.send({});
		});

		app.post('/api/login', function (req, res) {
			var data = transport.unpack(req, ['email', 'password']);

			authentication.authenticate(conn, data.email, data.password, function (user) {
				if (user) {
					req.session.user = user;
					res.send(user);
				} else {
					if (req.session.user) {
						delete req.session.user;
					}
					res.send('Invalid username or password.', 401);
				}
			});
		});

	};
	
}());
