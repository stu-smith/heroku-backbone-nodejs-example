(function () {

	'use strict';

	var Handlebars = require('handlebars'),
		_ = require('underscore'),
		fs = require('fs'),
		footer = fs.readFileSync('./site/app/templates/common/footer.html');

	module.exports.setupRouting = function (app, conn, cache) {

		var pages = [
			{
				path: '/',
				master: 'toplevel',
				content: 'toplevel/home'
			},
			{
				path: '/about',
				master: 'toplevel',
				content: 'toplevel/about'
			},
			{
				path: '/terms',
				master: 'toplevel',
				content: 'toplevel/terms'
			},
			{
				path: '/privacy',
				master: 'toplevel',
				content: 'toplevel/privacy'
			},
			{
				path: '/contact',
				master: 'toplevel',
				content: 'toplevel/contact'
			},
			{
				path: '*',
				master: 'toplevel',
				content: 'toplevel/404'
			}
		];

		_.each(pages, function (page) {
			var masterFile = './site/content/master/' + page.master + '.html',
				contentFile = './site/content/' + page.content + '.html';

			app.get(page.path, function (req, res) {
				var options;

				if (page.path === '/' && req.session.user) {
					res.redirect('/app/#!/');
				} else {
					options = {
						transformPre: function (templateSource, callback) {
							cache.cacheReadFile(masterFile, masterFile, function (masterSource) {
								var masterTemplate = Handlebars.compile(String(masterSource)),
									model = {
										content: new Handlebars.SafeString(String(templateSource)),
										footer: new Handlebars.SafeString(String(footer)),
										cacheId: cache.cacheId
									},
									html = masterTemplate(model);

								callback(html);
							});
						}
					};

					cache.cacheReadFile(page.path, contentFile, function (html) {
						res.send(html);
					}, options);
				}
			});
		});

	};

}());
