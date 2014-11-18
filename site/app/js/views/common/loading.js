define([
	'jquery',
	'backbone',
	'text!templates/common/loading.html'
], function ($, Backbone, template) {

	'use strict';

	return Backbone.View.extend({

		render: function () {
			$(this.el).html(template);
			return this;
		}

	});
});
