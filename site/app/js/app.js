define([
	'underscore',
	'js/router',
	'js/models/app'
], function (_, Router, AppModel) {

	'use strict';

	var appModel = new AppModel(),
		initialize = function () {
			Router.initialize(appModel);
		};

	return {
		initialize: initialize,
		model: appModel
	};

});
