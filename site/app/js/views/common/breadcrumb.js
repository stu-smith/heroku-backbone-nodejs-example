define([
	'jquery',
	'backbone',
	'handlebars',
	'text!templates/common/breadcrumb.html'
], function($, Backbone, Handlebars, template) {

	'use strict';

	return Backbone.View.extend({

		initialize: function() {
			this.renderTemplate = Handlebars.compile(template);
		},

		render: function () {
			var self = this,
				html = self.renderTemplate(self.model);
			$(self.el).html(html);
			return self;
		}

	});
});
