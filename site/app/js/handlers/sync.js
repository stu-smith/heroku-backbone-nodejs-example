define([
	'backbone',
	'js/views/common/message',
	'js/utility/notify'
], function (Backbone, CommonMessageView, NotifyUtility) {

	'use strict';

	return function () {

		var self = this;

		self.onSaveFailed = function (msg) {
			var model, view;

			if (msg && msg.indexOf('Licence expired') >= 0) {
				Backbone.pubSub.trigger('licence:expired');
				return;
			}

			model = {
				title: 'Oops',
				message: msg || 'Something went wrong.'
			};
			view = new CommonMessageView({model: model});

			self.appView.showDialogView(view);
		};

		self.onSaveBegin = function () {
			NotifyUtility.addNotification('Saving...');
		};

		self.onSaveEnd = function () {
			NotifyUtility.removeNotification();
		};

		self.hook = function (appView) {
			var pubSub = Backbone.pubSub;

			self.appView = appView;

			pubSub.on('save:failed', self.onSaveFailed, self);
			pubSub.on('save:begin', self.onSaveBegin, self);
			pubSub.on('save:end', self.onSaveEnd, self);
		};
	};

});
