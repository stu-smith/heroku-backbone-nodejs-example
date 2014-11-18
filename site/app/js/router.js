define([
	'underscore',
	'backbone',
	'async',
	'js/models/error',
	'js/views/home/main',
	'js/views/home/error',
	'js/views/user/new',
	'js/views/user/signin',
	'js/views/user/payment-start',
	'js/views/user/payment-temporary',
	'js/views/user/payment-end',
	'js/views/common/loading',
	'js/views/appview',
	'js/views/loading'
], function(
	_,
	Backbone,
	async,
	ErrorModel,
	HomeMainView,
	HomeErrorView,
	UserNewUserView,
	UserSignInView,
	UserPaymentStartView,
	UserPaymentTemporaryView,
	UserPaymentEndView,
	CommonLoadingView,
	AppView,
	Loading) {

	'use strict';

	var AppRouter = Backbone.Router.extend({

			routes: {
				'': 'goHomeMain',
				'!/': 'goHomeMain',
				'!/user/new': 'goUserNewUser',
				'!/user/signin': 'goUserSignIn',
				'!/user/payment-start': 'goUserPaymentStart',
				'!/user/payment-temporary': 'goUserPaymentTemporary',
				'!/user/payment-end': 'goUserPaymentEnd',
				'*actions': 'goHomeError'
			},

			initialize: function() {
				var self = this;

				self.appView = new AppView(self.model);
				self.loading = new Loading(self.appView);
			},

			getParamValue: function(params, name) {
				return (params || {})[name];
			},

			// HOME

			goHomeMain: function() {
				var view = new HomeMainView({
					model: this.model
				});

				this.appView.showPageView(view);
			},
			goHomeError: function(actions) {
				var model = new ErrorModel({
						message: 'Page not found: #' + actions
					}),
					view = new HomeErrorView({
						model: model
					});

				this.appView.showPageView(view);
			},

			// USER

			goUserNewUser: function() {
				var view = new UserNewUserView({
					model: this.model
				});

				this.appView.showPageView(view);
			},
			goUserSignIn: function() {
				var view = new UserSignInView({
					model: this.model
				});

				this.appView.showPageView(view);
			},
			goUserPaymentStart: function() {
				var self = this;

				self.loading.awaitLoggedIn(function() {
					var user = self.model.get('loginStatus').get('user'),
						view = new UserPaymentStartView({
							model: user
						});

					self.appView.showPageView(view);
				});
			},
			goUserPaymentTemporary: function(params) {
				var self = this;

				self.loading.awaitLoggedIn(function() {
					var user = self.model.get('loginStatus').get('user'),
						view = new UserPaymentTemporaryView({
							model: user,
							key: self.getParamValue(params, 'key')
						});

					self.appView.showPageView(view);
				});
			},
			goUserPaymentEnd: function(params) {
				var self = this;

				self.loading.awaitLoggedIn(function() {
					var user = self.model.get('loginStatus').get('user'),
						view = new UserPaymentEndView({
							model: user,
							key: self.getParamValue(params, 'key'),
							appModel: self.model
						});

					self.appView.showPageView(view);
				});
			},
		}),

		initialize = function(appModel) {
			var appRouter;

			Backbone.pubSub = _.extend({}, Backbone.Events);
			Backbone.pubSub = _.bindAll(Backbone.pubSub);

			appRouter = new AppRouter();
			appRouter.model = appModel;
			appRouter.appView.initialize(appModel);

			Backbone.getHref = function(path) {
				return '#!' + path;
			};

			Backbone.navigate = function(path) {
				window.location.hash = '!' + path;
			};

			Backbone.showDialogView = appRouter.appView.showDialogView;
			Backbone.closeDialogView = appRouter.appView.closeDialogView;
			Backbone.askQuestion = appRouter.appView.askQuestion;
			Backbone.history.start();
		};

	return {
		initialize: initialize
	};
});