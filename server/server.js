(function () {

	'use strict';

	var express, connect, session, _, pg, conn, app, port, routingModules, cache, doCache;
	var redis, RedisStore, rtg;
	var bodyParser, cookieParser, errorHandler;

	console.log('--> Starting...');

	connect = require('connect');
	express = require('express');
	session = require('express-session');
	bodyParser = require('body-parser');
	cookieParser = require('cookie-parser');
	errorHandler = require('errorhandler');

	RedisStore = require('connect-redis')(session);
	_ = require('underscore');
	pg = require('pg');
	cache = require('./cache.js');
	doCache = !process.env.NO_CACHE;

	console.log('--> Caching:    ' + doCache);

	console.log('--> PostgreSQL: ' + process.env.DATABASE_URL);

	conn = new pg.Client(process.env.DATABASE_URL);
	conn.connect();

	console.log('--> Redis:      ' + process.env.REDISTOGO_URL);

	if (process.env.REDISTOGO_URL) {
		rtg = require('url').parse(process.env.REDISTOGO_URL);
		redis = require('redis').createClient(rtg.port, rtg.hostname);
		redis.auth(rtg.auth.split(':')[1]);
	} else {
		redis = require("redis").createClient();
	}

	console.log('--> Express...');

	app = express();
	port = process.env.PORT || 3000;

	console.log('--> Port:       ' + port);

	app.use(bodyParser.urlencoded({ extended: false }))
	app.use(bodyParser.json());

	app.use(cookieParser());
	app.use(errorHandler({ dumpExceptions: true }));
	app.use(session({
		secret: process.env.CLIENT_SECRET || 'secret-session-hash',
		store: new RedisStore({client: redis, ttl: 60 * 60 * 24 * 30 * 1000}),
		cookie: { maxAge: 60 * 60 * 24 * 30 * 1000 },
		resave: true,
		saveUninitialized: true
	}));

	app.use(function(err, req, res, next){
		console.error(err.stack);
		res.status(500).send('Something broke!');
	});

	routingModules = [
		'./app/routing.js',
		'./api/routing.js',
		'./static/routing.js',
		'./dynamic/routing.js'
	];

	_.each(routingModules, function (p) {
		var r = require(p);

		r.setupRouting(app, conn, cache);
	});

	app.all('*', function () {
		console.error('404?');
	});

	console.log('--> Listen.');

	app.listen(port);

	process.on('uncaughtException', function (err) {
		console.log(err);
	});

}());
