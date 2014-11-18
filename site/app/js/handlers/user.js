define([
	'backbone',
	'js/utility/sync'
], function (Backbone, syncUtility) {

	'use strict';

	return function () {

		var self = this;

		self.onLogin = function () {
			Backbone.navigate('/');
		};

		self.onLogout = function () {
			syncUtility.post('/api/logout', {}, function (data) {
				self.appView.model.get('loginStatus').set({user: null});
				window.location.href = '/';
			});
		};

		self.onPaymentStart = function () {
			Backbone.navigate('/user/payment-start');
		};

		self.onPaymentEnd = function (key) {
			Backbone.navigate('/user/payment-end?key=' + key);
		};

		self.hook = function (appView) {
			var pubSub = Backbone.pubSub;

			self.appView = appView;

			pubSub.on('login', self.onLogin, self);
			pubSub.on('logout', self.onLogout, self);
			pubSub.on('payment:start', self.onPaymentStart, self);
			pubSub.on('payment:end', self.onPaymentEnd, self);
		};
	};

});
