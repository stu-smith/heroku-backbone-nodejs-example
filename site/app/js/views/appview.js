define([
	'jquery',
	'underscore',
	'backbone',
	'js/views/common/question',
	'js/views/common/message',
	'js/views/common/breadcrumb',
	'js/views/user/status',
	'js/handlers/sync',
	'js/handlers/user',
	'js/handlers/licence',
	'text!templates/common/footer.html'
], function ($, _, Backbone,
			CommonQuestionView, CommonMessageView, CommonBreadcrumbView,
			UserStatusView,
			SyncHandler, UserHandler, LicenceHandler,
			footerTemplate) {

	'use strict';

	return function () {

		var self = this;

		self.initialize = function (model) {
			var self = this,
				syncHandler = new SyncHandler(),
				userHandler = new UserHandler(),
				licenceHandler = new LicenceHandler(),
				handlers = [
					syncHandler,
					userHandler,
					licenceHandler
				];

			self.model = model;
			self.model.get('loginStatus').on('change', self.renderLoginStatus, self);

			_.each(handlers, function (h) {
				h.hook(self);
			});

			$('html').on('keypress', function (e) {
				var view = self.currentDialogView || self.currentPageView;

				if (!view) {
					return;
				}

				if (e.srcElement.localName === 'textarea') {
					return;
				}

				if (e.keyCode === 13) {
					if (view.onKeyEnter) {
						e.preventDefault();

						view.onKeyEnter(e);
					}
				}
			});

			$('a').on('click', function (e) {
				var href = $(this).data('href');

				if (href) {
					e.preventDefault();

					Backbone.navigate(href);
				}
			});
		};

		self.renderLoginStatus = function () {
			var self = this, el;

			if (!self.userStatusView) {
				return;
			}

			self.userStatusView.render();

			el = self.userStatusView.el;

			$('#user-status').html(el);
		};

		self.showPageView = function (view) {
			var self = this, el, breadcrumbView;

			if (self.currentPageView) {
				if (self.currentPageView.bodyClass) {
					$('body').removeClass(self.currentPageView.bodyClass);
				}
				self.currentPageView.close();
			}
			if (self.currentDialogView) {
				self.currentDialogView.close();
			}

			if (view.bodyClass) {
				$('body').addClass(view.bodyClass);
			}

			self.currentPageView = view;
			self.currentPageView.render();

			el = self.currentPageView.el;

			$('#main').html(el);

			if (!self.userStatusView) {
				self.userStatusView = new UserStatusView({model: self.model.get('loginStatus')});
			}

			self.renderLoginStatus();

			$('.js-add-tooltip').tooltip({placement: 'bottom'});

			if (view.getBreadcrumb) {
				breadcrumbView = new CommonBreadcrumbView({model: view.getBreadcrumb()});

				breadcrumbView.render();

				$('#js-breadcrumb').html(breadcrumbView.el);
			} else {
				$('#js-breadcrumb').html('');
			}

			$('.footer').html(footerTemplate);

			$('input[autofocus]:first').focus();
		};

		self.showDialogView = function (view) {
			var el, dv;

			this.closeDialogView();

			view.appView = this;

			self.currentDialogView = view;
			self.currentDialogView.render();

			el = self.currentDialogView.el;

			dv = $('<div id="dialog-view" class="modal" />');

			$('#container').append(dv);

			dv.html(el);
			dv.modal();

			$('.modal-body input:first').focus();

			dv.on('shown', function () {
				dv.find('input:first').focus();
			});
			dv.on('hidden', function () {
				self.closeDialogView();
			});
		};

		self.closeDialogView = function () {
			if (self.currentDialogView) {
				self.currentDialogView.close();
				self.currentDialogView = null;
			}

			$('#dialog-view').modal('hide').remove();
			$('.datepicker').remove();
		};

		self.askQuestion = function (title, message, onYes) {
			var model = {
					title: title,
					message: message,
					onYes: onYes
				},
				view = new CommonQuestionView({model: model});

			this.showDialogView(view);
		};

		self.messageBox = function (title, message) {
			var model = {
					title: title,
					message: message
				},
				view = new CommonMessageView({model: model});

			this.showDialogView(view);
		};

	};

});
