(function () {
	
	'use strict';

	module.exports.getNamedId = function (req, name) {
		return parseInt(req.params[name], 10);
	};

	module.exports.getNamedValue = function (req, name) {
		return req.params[name];
	};

	module.exports.getUserId = function (req) {
		return this.getNamedId(req, 'userid');
	};

	module.exports.checkReadAllowed = function (req, res, success) {
		var userid = this.getUserId(req);

		if (!req.session.user || req.session.user.id !== userid) {
			res.send('Unauthorized.', 401);
			return;
		}
		
		success();
	};

	module.exports.checkWriteAllowed = function (req, res, success) {
		var userid = this.getUserId(req),
			now = new Date(),
			expiry = new Date(req.session.user.expiry);

		if (!req.session.user || req.session.user.id !== userid) {
			res.send('Unauthorized.', 401);
			return;
		}

		if (now > expiry) {
			res.send('Licence expired.');
			return;
		}

		success();
	};

	module.exports.toSlug = function (str) {
		str = str.replace(/^\s+|\s+$/g, '');
		str = str.toLowerCase();

		str = str.replace(/[^a-z0-9 -]/g, '')
				 .replace(/\s+/g, '-')
				 .replace(/-+/g, '-');

		return str;
	};

	module.exports.toSlugChecked = function (str, predicate, callback) {
		var initial = this.toSlug(str);

		predicate(initial, function (ok) {
			if (ok) {
				callback(initial);
			} else {
				toSlugCheckedRecurse(initial, 1, predicate, callback);
			}
		});
	};

}());
