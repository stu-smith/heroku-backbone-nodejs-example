define([
    'jquery'
], function ($) {

    'use strict';

    return {

		addNotification: function (msg) {
			var notify = $('#js-notify'),
				count;

			if (notify.length === 0) {
				notify = $('<div id="js-notify" class="top-notify" />');
				$('body').append(notify);
			}

			notify.text(msg);

			count = notify.data('count') || 0;
			count += 1;

			notify.data('count', count);
		},

		removeNotification: function () {
			var notify = $('#js-notify'),
				count = notify.data('count') || 1;

			if (count > 1) {
				count -= 1;
				notify.data('count', count);
			} else {
				notify.remove();
			}
		}

    };

});
