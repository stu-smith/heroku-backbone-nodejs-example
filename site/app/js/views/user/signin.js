define([
	'jquery',
	'backbone',
	'handlebars',
	'js/models/user',
	'js/utility/sync',
	'text!templates/user/signin.html'
], function ($, Backbone, Handlebars, UserModel, syncUtility, template) {

	'use strict';

	return Backbone.View.extend({

		initialize: function () {
			var self = this;

			self.renderTemplate = Handlebars.compile(template);

			self.model.get('loginStatus').on('change', function () {
				self.checkSignedIn();
			});

			self.checkSignedIn();
		},

		events: {
			'submit form': 'onSubmit'
		},

		checkSignedIn: function () {
			var loginStatus = this.model.get('loginStatus');

			if (loginStatus.get('user')) {
				if (this.keepRoute) {
					Backbone.history.loadUrl();
				} else {
					Backbone.pubSub.trigger('login');
				}
			}
		},

		onSubmit: function (e) {
			var self = this,
				form = self.$('.js-login-form');

			e.preventDefault();

			syncUtility.post('/api/login', form.serializeJson(), function (data) {
				var user, loginStatus;

				loginStatus = self.model.get('loginStatus');
				user = new UserModel(data);
				loginStatus.set({user: user});

				if (self.keepRoute) {
					Backbone.history.loadUrl();
				} else {
					Backbone.pubSub.trigger('login');
				}
			});
		},

		render: function () {
			var self = this,
				html = self.renderTemplate(self.model.toJSONRecursive());
			$(self.el).html(html);
			return self;
		}

	});
});
