define([
	'jquery',
	'backbone',
	'handlebars',
	'text!templates/common/message.html'
], function ($, Backbone, Handlebars, template) {

	'use strict';

	return Backbone.View.extend({

		initialize: function() {
			this.renderTemplate = Handlebars.compile(template);
		},

		events: {
			'click .js-ok': 'onOk'
		},

		onOk: function (e) {
			e.preventDefault();
			Backbone.closeDialogView();
		},

		onKeyEnter: function () {
			Backbone.closeDialogView();
		},

		render: function () {
			var self = this,
				html = self.renderTemplate(self.model);
			$(self.el).html(html);
			return self;
		}

	});
});
