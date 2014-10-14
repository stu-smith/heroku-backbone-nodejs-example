(function () {

    'use strict';

    var pg = require('pg'),
        fs = require('fs'),
        _ = require('underscore'),
        allSql = String(fs.readFileSync('./schema/schema.sql')),
        conn, sqlParts;

    sqlParts = allSql.split('--GO--');

    console.log('--> PostgreSQL: ' + process.env.DATABASE_URL);

    conn = new pg.Client(process.env.DATABASE_URL);
    conn.connect();

    console.log('Creating schema...');

    _.each(sqlParts, function (sql) {
        conn.query({text:sql}, function (err, result) {
            if (err) {
                console.log('ERROR: ' + err.message);
            } else if (result) {
                console.log(sql);
            }
        });
    });

    conn.once('drain', function () {
        process.exit(0);
    });

}());
