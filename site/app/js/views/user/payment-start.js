define([
	'jquery',
	'underscore',
	'backbone',
	'handlebars',
	'js/utility/licence',
	'js/utility/sync',
	'text!templates/user/payment-start.html'
], function ($, _, Backbone, Handlebars, licenceUtility, syncUtility, template) {

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
				html = self.renderTemplate(self.model.toJSONRecursive()),
				form, radios, first = true;

			$(self.el).html(html);

			radios = _.map(licenceUtility.paymentOptions, function (po) {
				var label = $('<label class="radio" />'),
					radio = $('<input type="radio" name="ext" />'),
					priceDisplay = self.getPriceDisplay(po);

				radio.attr('value', po.key).data('po', po);

				if (first) {
					radio.prop('checked', true);
					first = false;
				}

				label.append(radio);
				label.append(po.description + ' - ' + priceDisplay);

				return label;
			});

			form = $(self.el).find('.js-options-form');

			_.each(radios, function (r) {
				form.append(r);
			});

			return self;
		},

		getPriceDisplay: function (po) {
			return po.prices.USD.display;
		},

		onCheckout: function () {
			var self = this,
				userid = self.model.get('id'),
				paymentOption = $(self.el).find(':radio:checked').data('po'),
				request = {
					kind: paymentOption.key,
					originator: window.location.href
				};

			syncUtility.post('/api/users/' + userid + '/payment-start', request, function (response) {
				window.location.href = response.redirect;
			});
		}

	});

});