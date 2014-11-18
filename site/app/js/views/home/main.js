define([
	'jquery',
	'underscore',
	'backbone',
	'handlebars',
	'text!templates/home/main.html'
], function ($, _, Backbone, Handlebars, template) {

	'use strict';

	return Backbone.View.extend({

		events: {
			'click .js-new-event': 'onNewEvent'
		},

		onNewEvent: function () {
			var user = this.getUser();

			Backbone.pubSub.trigger('add:event', user.events);
		},

		initialize: function () {
			var self = this,
				loginStatus = self.model.get('loginStatus');

			self.renderTemplate = Handlebars.compile(template);

			self.model.on('change', self.render, self);
			loginStatus.on('change', self.render, self);

			_.each(['reset', 'add', 'remove', 'change'], function (e) {
				loginStatus.on('events:' + e, self.render, self);
			});
		},

		getUser: function () {
			return this.model.get('loginStatus').get('user');
		},

		render: function () {
			var self = this,
				html = self.renderTemplate(self.model.toJSONRecursive()),
				user = self.getUser();

			$(self.el).html(html);

			if (user) {

			} else {

			}

			return self;
		}

	});
});
