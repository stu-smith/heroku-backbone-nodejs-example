(function () {

	'use strict';

	var _ = require('underscore');

	module.exports.setupRouting = function (app, conn) {

		var routingModules = [
				'./user.js'
			];

		_.each(routingModules, function (p) {
			var m = require(p);

			m.setupRouting(app, conn);
		});

		app.all('/api/*', function (req, res) {
			res.send('No such API function.', 400);
		});
	};

}());
