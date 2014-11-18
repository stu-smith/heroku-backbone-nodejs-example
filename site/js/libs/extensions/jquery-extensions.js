define([
	'jquery'
], function (jQuery) {

	'use strict';

	jQuery.ajaxSetup({
		contentType: 'application/json; charset=utf-8'
	});

	jQuery.fn.serializeJson = function () {
		var o = {},
			a = this.serializeArray();

		jQuery.each(a, function () {
			if (o[this.name] !== undefined) {
				if (!o[this.name].push) {
					o[this.name] = [o[this.name]];
				}
				o[this.name].push(this.value || '');
			} else {
				o[this.name] = this.value || '';
			}
		});
		return o;
	};

	jQuery.fn.findAny = function(selector) {
		return this.filter(selector).add(this.find(selector));
	};

	jQuery.postJson = function (url, data, success, error) {
		return jQuery.ajax({
			type: 'POST',
			url: url,
			data: JSON.stringify(data),
			success: success,
			error: function (jqXHR) {
				error(jqXHR.responseText);
			}
		});
	};

	jQuery.getJson = function (url, data, success, error) {
		return jQuery.ajax({
			type: 'GET',
			url: url,
			data: JSON.stringify(data),
			success: success,
			error: function (jqXHR) {
				error(jqXHR.responseText);
			}
		});
	};

	return jQuery;
});
