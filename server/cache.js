(function () {

	'use strict';

	var _ = require('underscore'),
		fs = require('fs'),
		Handlebars = require('handlebars'),
		less = require('less'),
		requirejs = require('requirejs'),
		utility = require('./utility.js'),
		cache = {},
		defaults = {
			transformPre: function (input, callback) {
				callback(input);
			},
			transformPost: function (input, callback) {
				callback(input);
			}
		},
		doCache = !process.env.NO_CACHE,
		cacheId;

	if (doCache) {
		cacheId = utility.guidGen();
	}

	module.exports.cacheId = cacheId;

	module.exports.cacheCommon = function (key, func, callback, transformPost) {
		var result = cache[key],
			doCache = !process.env.NO_CACHE;

		if (!transformPost) {
			transformPost = function (input, callback) {
				callback(input);
			};
		}

		if (result && doCache) {
			transformPost(result, function (r) {
				callback(r);
			});
		} else {
			func(function (r) {
				result = r;

				if (!result) {
					console.error('Warning: falsy for "' + key + '"');
				}

				cache[key] = result;

				transformPost(result, function (rr) {
					callback(rr);
				});
			});
		}
	};

	module.exports.cacheReadFile = function (key, file, callback, options) {
		options = _.defaults(options || {}, defaults);

		this.cacheCommon(key, function (func) {
			fs.readFile(file, function (err, contents) {
				if (err) {
					console.error(err);
				}

				options.transformPre(contents, function (result) {
					func(result);
				});
			});
		}, callback, options.transformPost);
	};

	module.exports.sendCachedStaticFile = function (key, file, res, contentType, options) {
		var doCache = !process.env.NO_CACHE;

		this.cacheReadFile(key, file, function (result) {
			if (doCache) {
				res.header('Expires', 'Tue, 1 Jan 2030 00:00:00 GMT');
			}

			if (contentType) {
				res.writeHead(200, { 'Content-type': contentType });
			}

			res.end(result);
		}, options);
	};

	module.exports.sendCachedLessFile = function (key, file, res) {
		var doCache = !process.env.NO_CACHE;
		var options = {
			transformPre: function (contents, callback) {
				var parser = new(less.Parser)({
					paths: ['./site', './site/css', './site/css/less'],
					filename: file
				});

				parser.parse(String(contents), function (err, tree) {
					var css;

					if (err) {
						console.error(err);
					}

					css = tree.toCSS({ compress: doCache });

					callback(css);
				});
			}
		};

		this.sendCachedStaticFile(key, file, res, 'text/css', options);
	};

	module.exports.sendCachedRequireJS = function (key, fileOptions, res) {
		var doCache = !process.env.NO_CACHE;

		this.cacheCommon(key, function (callback) {
			console.log('About to optimize JS');

			if (fs.existsSync(fileOptions.out)) {
				fs.unlinkSync(fileOptions.out);
			}

			requirejs.optimize(fileOptions, function () {
				var output = fs.readFileSync(fileOptions.out);
				
				fs.unlinkSync(fileOptions.out);
				console.log('Done optimizing JS (' + Math.ceil(output.length / 1024) + ' kb)');

				callback(output);
			});
		}, function (output) {
			if (doCache) {
				res.header('Expires', 'Tue, 1 Jan 2030 00:00:00 GMT');
			}
			res.writeHead(200, { 'Content-type': 'text/javascript' });
			res.end(output);
		});
	};

}());
