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

			this.set({'loggedIn': !!user});

			if (user) {
				user.events.on('all', function (eventName) {
					self.trigger('events:' + eventName);
				});
				user.events.fetch();
			}
		},

		toString: function () {
			return 'loginStatus model';
		}

	});
});
