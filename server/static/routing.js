(function () {

    'use strict';

    var doCache = !process.env.NO_CACHE;

    module.exports.setupRouting = function (app, conn, cache) {

		var translateFilename = function (url) {
			if (url.indexOf('/app/js/js') === 0) {
				return './site/app/js' + url.substring(10);
			}

			if (url.indexOf('/app/js/templates') === 0) {
				return './site/app/templates' + url.substring(17);
			}
			return './site' + url;
		};

		app.get('/css/site.css', function (req, res) {
			cache.sendCachedLessFile('/css/site.css', './site/css/less/custom.less', res);
		});

		app.get('/app/js/site:cache.js', function (req, res) {
			var options = {
				baseUrl: "./site/app",
				appdir: "./site/app",
				name: "js/main",
				out: "main-built.js",
				mainConfigFile: './site/app/js/main.js',
				optimize: 'uglify',
				uglify: {
					mangle: true
				}
			};
			cache.sendCachedRequireJS('/app/js/site.js', options, res);
		});

        app.get('/*.js', function (req, res) {
			var filename = translateFilename(req.url);

			if (doCache) {
				if (filename.indexOf('./site/app/js/libs') !== 0) {
					console.log('FORBIDDEN: ' + filename);
					res.send('Not found', 404);
					return;
				}
			}

			cache.sendCachedStaticFile(req.url, filename, res, 'text/javascript');
        });

        app.get('/*.(html|png|ico|gif|eot|woff|ttf|svg)', function (req, res) {
			var filename = translateFilename(req.url);

			cache.sendCachedStaticFile(req.url, filename, res);
        });

    };

}());
