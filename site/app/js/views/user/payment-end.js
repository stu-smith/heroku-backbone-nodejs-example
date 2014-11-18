define([
	'jquery',
	'underscore',
	'backbone',
	'handlebars',
	'js/utility/sync',
	'text!templates/user/payment-end.html'
], function ($, _, Backbone, Handlebars, syncUtility, template) {

	'use strict';

	return Backbone.View.extend({

		initialize: function () {
			var self = this;

			self.renderTemplate = Handlebars.compile(template);

			self._timerId = window.setInterval(_.bind(self.onTimer, self), 5000);
			self.viewModel.status = 0;
			self.viewModel.checking = 'Waiting for payment confirmation...';
			self.viewModel.expiry = null;
		},

		unbind: function () {
			var self = this;

			self.stopChecking();

			Backbone.View.prototype.unbind.call(self);
		},

		stopChecking: function () {
			var self = this;

			if (self._timerId) {
				window.clearInterval(self._timerId);
				self._timerId = null;
				self.viewModel.checking = null;
				self.render();
			}
		},

		reloadUser: function () {
			var self = this;

			self.viewModel.checking = 'Checking licence information...';
			self.render();

			syncUtility.get('/api/users/' + self.model.get('id'), {}, function (user) {
				self.options.appModel.set({user: user});
				self.viewModel.checking = null;
				self.viewModel.expiry = user.expiry;
				self.render();
			});
		},

		render: function () {
			var self = this,
				html = self.renderTemplate(self.viewModel);

			$(self.el).html(html);

			return self;
		},

		onTimer: function () {
			this.getPaymentDetails();
		},

		getPaymentDetails: function () {
			var self = this,
				userid = self.model.get('id'),
				request = {},
				requestUri = '/api/users/' + userid + '/payment-status/' + self.options.key;

			syncUtility.get(requestUri, request, function (response) {
				self.viewModel.status = response.status;

				self.render();

				if (self.viewModel.status === 2 || self.viewModel.status === 3) {
					self.stopChecking();
				}

				self.reloadUser();
			}, function (err) {
				self.viewModel.status = -1;

				self.render();
				self.stopChecking();
				self.reloadUser();
			});
		},

		viewModel : {
			status: 0,
			checking: null
		}

	});

});
