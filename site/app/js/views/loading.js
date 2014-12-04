define([
	'underscore',
	'js/views/common/loading',
	'js/views/user/signin'
], function (_, CommonLoadingView, UserSignInView) {

	'use strict';

	var Loading = function (appView) {
		this.appView = appView;
	};

	Loading.prototype.awaitLoggedIn = function (callback) {
		var self = this,
			loginStatus = self.appView.model.get('loginStatus'),
			user = loginStatus.get('user'),
			signInView;

		if (!user) {
			signInView = new UserSignInView({model: self.appView.model});
			signInView.keepRoute = true;
			self.appView.showPageView(signInView);
			return;
		}

		callback();
	};

	Loading.prototype.awaitUserCollection = function (collection, callback) {
		var self = this,
			loginStatus = self.appView.model.get('loginStatus'),
			user = loginStatus.get('user'),
			loadingView;

		self.awaitLoggedIn(function () {
			if (user[collection].isFetched) {
				callback();
			} else {
				loadingView = new CommonLoadingView();

				self.appView.showPageView(loadingView);

				user[collection].fetch({success: function () {
					callback();
				}});
			}
		});
	};

	Loading.prototype.awaitCollection = function (data, item, collection, callback) {
		var itemValue = data[item], output;

		if (itemValue[collection].isFetched) {
			output = {};
			output[item] = itemValue;
			output[collection] = itemValue[collection];

			callback(null, _.extend(data, output));
		} else {
			this.appView.showPageView(new CommonLoadingView());

			itemValue[collection].fetch({success: function () {
				output = {};
				output[item] = itemValue;
				output[collection] = itemValue[collection];

				callback(null, _.extend(data, output));
			}});
		}
	};

	return Loading;

});
