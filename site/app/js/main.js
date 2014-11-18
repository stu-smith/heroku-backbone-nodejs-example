require.config({
	paths: {
		jquery: 'js/libs/jquery/jquery-cdn',
		underscore: 'js/libs/underscore/underscore-min',
		backbone: 'js/libs/backbone/backbone-max',
		'backbone.queryparams': 'js/libs/backbone/backbone.queryparams',
		handlebars: 'js/libs/handlebars/handlebars-lib',
		async: 'js/libs/async/async',
		templates: 'templates'
	},
	shim: {
		async: {
			exports: 'async'
		},
		jquery: {
			exports: '$'
		},
		underscore: {
			exports: '_'
		},
		backbone: {
			deps: ['underscore', 'jquery'],
			exports: 'backbone'
		},
		handlebars: {
			exports: 'handlebars'
		},
		'backbone.queryparams': {
			deps: ['backbone']
		}
	}
});

require([
	'js/launcher',
	'jquery',
	'backbone.queryparams'
], function (launcher) {

	'use strict';

	launcher();

});
