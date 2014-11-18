define([
	'backbone',
	'js/views/common/question',
	'js/utility/notify'
], function (Backbone, CommonQuestionView, NotifyUtility) {

	'use strict';

	return function () {

		var self = this;

		self.onLicenceExpired = function () {
			var model, view;

			model = {
				title: 'Oops',
				message: 'Your licence has expired. Would you like to purchase an extension to your licence?',
				onYes: function () { Backbone.pubSub.trigger('payment:start'); }
			};
			view = new CommonQuestionView({model: model});

			self.appView.showDialogView(view);
		};

		self.hook = function (appView) {
			var pubSub = Backbone.pubSub;

			self.appView = appView;

			pubSub.on('licence:expired', self.onLicenceExpired, self);
		};
	};

});
