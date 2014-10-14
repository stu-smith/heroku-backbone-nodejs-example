(function () {

    'use strict';

    var _ = require('underscore');

    module.exports.unpack = function (req, keys) {
        var data = {};

        _.each(keys, function (key) {
            var bk, pk;

            if (req.body) {
                bk = req.body[key];
            }
            if (_.isFunction(req.params)) {
                pk = req.params(key);
            }

            data[key] = bk;

            if (data[key] === undefined) {
                data[key] = pk;
            }
            if (data[key] === undefined) {
                data[key] = '';
            }
        });

        return data;
    };

}());
