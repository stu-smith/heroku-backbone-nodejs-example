/*global window: true */

define([
	'js/app',
	'js/models/user'
], function (App, User) {

	'use strict';

	return function () {
		var appLoginStatus;

		App.initialize();

		appLoginStatus = window._loginStatus;

		if (wpLoginStatus) {
			var loginStatus = App.model.get('loginStatus');

			loginStatus.set({
				user: new User({
					id: appLoginStatus.id,
					email: appLoginStatus.email,
					expiry: new Date(appLoginStatus.expiry)
				})
			});
		}
	};

});
