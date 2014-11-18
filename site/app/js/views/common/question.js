define([
	'jquery',
	'backbone',
	'handlebars',
	'text!templates/common/question.html'
], function ($, Backbone, Handlebars, template) {

	'use strict';

	return Backbone.View.extend({

		initialize: function() {
			this.renderTemplate = Handlebars.compile(template);
		},

		events: {
			'click .js-yes': 'onYes',
			'click .js-no': 'onNo'
		},

		onYes: function (e) {
			e.preventDefault();
			Backbone.closeDialogView();
			this.model.onYes();
		},

		onNo: function (e) {
			e.preventDefault();
			Backbone.closeDialogView();
		},

		onKeyEnter: function () {
			Backbone.closeDialogView();
			this.model.onYes();
		},

		render: function () {
			var self = this,
				html = self.renderTemplate(self.model);
			$(self.el).html(html);
			return self;
		}

	});
});
