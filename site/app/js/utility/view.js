define([
		'jquery'
], function ($) {

		'use strict';

		return {

		findViewByModel: function (elem, model) {
			var modelCid = model.cid;

			return $(elem).find('*').filter(function () {
				var elemModel = $(this).data('model');

				return elemModel && elemModel.cid === modelCid;
			});
		}

		};

});
