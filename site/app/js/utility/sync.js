define([
		'jquery',
		'backbone'
], function ($, Backbone) {

		'use strict';

		return {

		saveModel: function (model, collection, success, failure) {
			var buttons = $('form button'),
				pubSub = Backbone.pubSub;

			buttons.attr('disabled', true);

			if (collection) {
				collection.add(model);
			}

			if (!model.collection) {
				console.log('NO COLLECTION');
			}

			pubSub.trigger('save:begin');

			model.save({}, {
				success: function (data) {
					buttons.attr('disabled', false);

					pubSub.trigger('save:end');
					pubSub.trigger('save:success');

					if (success) {
						success(data);
					}
				}, error: function (m, res) {
					if (collection) {
						collection.remove(model);
					}
					buttons.attr('disabled', false);

					pubSub.trigger('save:end');
					pubSub.trigger('save:failed', res.responseText);

					if (failure) {
						failure(res.responseText);
					}
				}
			});
		},

		deleteModel: function (model) {
			var pubSub = Backbone.pubSub;

			pubSub.trigger('save:begin');

			model.destroy({
				wait: true,
				success: function () {
					pubSub.trigger('save:end');
					pubSub.trigger('save:success');
				}, error: function (m, res) {
					pubSub.trigger('save:end');
					pubSub.trigger('save:failed', res.responseText);
				}
			});
		},

		post: function (url, data, success, failure) {
			var pubSub = Backbone.pubSub;

			pubSub.trigger('save:end');

			$.postJson(url, data, function (x) {
				pubSub.trigger('save:end');

				if (success) {
					success(x);
				}
			}, function (x) {
				pubSub.trigger('save:end');

				if (failure) {
					failure(x);
				} else {
					pubSub.trigger('save:failed', x);
				}
			});
		},

		get: function (url, data, success, failure) {
			$.getJson(url, data, function (x) {
				if (success) {
					success(x);
				}
			}, function (x) {
				if (failure) {
					failure(x);
				}
			});
		}

		};

});
