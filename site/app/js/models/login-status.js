define([
	'backbone'
], function (Backbone) {

	'use strict';

	return Backbone.Model.extend({

		defaults: {
			loggedIn: false,
			user: null
		},

		initialize: function () {
			this.on('change:user', this.onUserChange, this);
		},

		onUserChange: function (status, user) {
			var self = this;

			self.set({'loggedIn': !!user});
		},

		toString: function () {
			return 'loginStatus model';
		}

	});
});
