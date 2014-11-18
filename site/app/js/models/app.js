define([
	'backbone',
	'js/models/login-status'
], function (Backbone, LoginStatusModel) {

	'use strict';

	return Backbone.Model.extend({

		defaults: {
			loginStatus: new LoginStatusModel()
		},

		initialize: function () {
		}

	});
});
