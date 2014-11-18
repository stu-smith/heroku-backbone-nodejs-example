define([
	'jquery',
	'backbone',
	'handlebars',
	'js/models/user',
	'js/utility/sync',
	'js/utility/form',
	'text!templates/user/new.html'
], function ($, Backbone, Handlebars, UserModel, syncUtility, formUtility, template) {

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
				Backbone.navigate('/');
			}
		},

		onSubmit: function (e) {
			var self = this,
				email, password1, password2, newUser, form = self.$('form');

			e.preventDefault();

			formUtility.clearErrors(form);

			self.$('.validation-error').remove();

			email = self.$('.js-email').val();
			password1 = self.$('.js-password1').val();
			password2 = self.$('.js-password2').val();

			if (password1 !== password2) {
				formUtility.addError(self.$('.js-password2'), 'Passwords differ.');
				return;
			}

			self.$('.js-submit').attr('disabled', true);

			newUser = new UserModel({email: email, password: password1});

			syncUtility.saveModel(newUser, null, function (data) {
				var loginStatus;

				loginStatus = self.model.get('loginStatus');
				newUser = data;
				loginStatus.set({user: newUser});

				Backbone.pubSub.trigger('login');
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
