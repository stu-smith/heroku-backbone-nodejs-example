define([
	'backbone'
], function (Backbone) {

	'use strict';

	return Backbone.Model.extend({

		urlRoot: '/api/users',

		defaults: {
			email: '',
			password: '',
			expiry: new Date().setTime(30 * 24 * 60 * 60 * 1000)
		},

		initialize: function () {
		}
	});
});
