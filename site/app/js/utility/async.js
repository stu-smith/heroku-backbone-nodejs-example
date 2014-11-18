define([], function () {

    'use strict';

    return {

		runAsyncRecurse: function (tasks, n, i, complete) {
			var self = this,
				count = Math.max(tasks.length, n || 0),
				pos = i || 0,
				task;

			if (tasks.length === 0) {
				complete();
				return;
			}

			task = tasks.pop();

			task(function () {
				window.setTimeout(function () {
					self.runAsyncRecurse(tasks, count, i + 1, complete);
				}, 0);
			}, 100 * i / n);
		},

		runAsync: function (tasks, complete) {
			this.runAsyncRecurse(tasks, tasks.length, 0, complete);
		}

	};

});
