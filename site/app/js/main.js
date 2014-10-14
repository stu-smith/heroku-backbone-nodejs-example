require.config({
	paths: {
		jquery: '../../js/libs/jquery/jquery-cdn',
		underscore: '../../js/libs/underscore/underscore-min',
		Backbone: '../../js/libs/backbone/backbone-max',
		Handlebars: '../../js/libs/handlebars/handlebars-lib',
		async: '../../js/libs/async/async-min',
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
		Backbone: {
			deps: ['underscore', 'jquery'],
			exports: 'Backbone'
		},
		Handlebars: {
			exports: 'Handlebars'
		},
		'js/libs/backbone/backbone.queryparams': {
			deps: ['Backbone']
		}
	}
});

require([
	'js/launcher',
	'jquery',
	'js/libs/backbone/backbone.queryparams'
], function (launcher) {

	'use strict';

	launcher();

});
