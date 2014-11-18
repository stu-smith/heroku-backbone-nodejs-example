define([
	'jquery',
	'backbone',
	'handlebars',
	'text!templates/user/status.html'
], function ($, Backbone, Handlebars, template) {

	'use strict';

	return Backbone.View.extend({

		onLogout: function (e) {
			e.preventDefault();

			Backbone.pubSub.trigger('logout');
		},

		onPaymentStart: function (e) {
			e.preventDefault();

			Backbone.pubSub.trigger('payment:start');
		},

		addLiveEvent: function (sel, fn) {
			var self = this;

			$(sel).live('click', function (e) {
				self[fn](e);
			});
		},

		initialize: function () {
			var self = this;

			self.renderTemplate = Handlebars.compile(template);

			self.addLiveEvent('#js-logout', 'onLogout');
			self.addLiveEvent('#js-payment-start', 'onPaymentStart');
		},

		render: function () {
			var self = this,
				html = self.renderTemplate(self.model.toJSONRecursive());
			$(self.el).html(html);
			return self;
		}

	});
});
