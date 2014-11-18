define([
	'jquery',
	'underscore',
	'backbone',
	'handlebars',
	'js/utility/sync',
	'text!templates/user/payment-temporary.html'
], function ($, _, Backbone, Handlebars, syncUtility, template) {

	'use strict';

	return Backbone.View.extend({

		events: {
			'click .js-checkout': 'onCheckout'
		},

		initialize: function () {
			var self = this;

			self.renderTemplate = Handlebars.compile(template);
		},

		render: function () {
			var self = this,
				html = self.renderTemplate(self.model.toJSONRecursive());

			$(self.el).html(html);
		},

		onCheckout: function () {
			var request = {
				key: this.options.key,
				action: 'payment-ok'
			};

			syncUtility.post('/api/incoming/payment-event', request, function (response) {
				Backbone.pubSub.trigger('payment:end', request.key);
			});
		}

	});

});
