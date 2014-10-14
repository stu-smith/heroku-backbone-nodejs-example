(function () {

    'use strict';

    var Handlebars = require('handlebars');

    module.exports.setupRouting = function (app, conn, cache) {

        app.get('/app/', function (req, res) {
            var options = {
                transformPost: function (templateSource, callback) {
                    var template = Handlebars.compile(String(templateSource)),
                        model = {user: req.session.user, cacheId: cache.cacheId},
                        html = template(model);

                    callback(html);
                }
            };
            cache.cacheReadFile('/app/', './site/app/app.html', function (html) {
                res.send(html);
            }, options);
        });

    };

}());