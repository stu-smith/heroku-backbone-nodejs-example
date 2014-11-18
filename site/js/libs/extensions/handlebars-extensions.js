define([
	'handlebars'
], function (Handlebars) {

	'use strict';

	var monthNames = [
			'January', 'February', 'March', 'April', 'May', 'June',
			'July', 'August', 'September', 'October', 'November', 'December'
		];

	Handlebars.registerHelper('if_eq', function (context, options) {
		if (context === options.hash.compare) {
			return options.fn(this);
		}
		return options.inverse(this);
	});

	Handlebars.registerHelper('if_lt', function(context, options) {
		if (context < options.hash.compare) {
			return options.fn(this);
		}
		return options.inverse(this);
	});

	Handlebars.registerHelper('break_lines', function (text) {
		var lines = text.split(/\r\n|\r|\n/),
			result = '', first = true, i;

		for (i = 0; i < lines.length; ++i) {
			if (!first) {
				result += '<br>';
			}
			result += Handlebars.Utils.escapeExpression(lines[i]);
			first = false;
		}

		return new Handlebars.SafeString(result);
	});

	var longDate = function (date) {
		return date.getDate() + ' ' + monthNames[date.getMonth()] + ' ' + date.getFullYear();
	};

	Handlebars.registerHelper('long_date', function (text) {
		var date = new Date(text),
			result = longDate(date);

		return new Handlebars.SafeString(result);
	});

	Handlebars.registerHelper('date_diff_until', function (text) {
		var date = new Date(text),
			today = new Date(),
			days = Math.floor((date - today) / (1000*60*60*24));

		if (today > date) {
			return new Handlebars.SafeString('Overdue');
		}

		if (days < 2) {
			return 'Now';
		} else if (days < 40) {
			return 'In ' + days + ' days\' time (' + longDate(date) + ')';
		} else {
			return 'In about ' + Math.ceil(days / 30) + ' months\' time';
		}
	});

	Handlebars.registerHelper('if_before_today', function (text, options) {
		var date = new Date(text),
			today = new Date();

		if (date <= today) {
			return options.fn(this);
		}

		return '';
	});

	Handlebars.registerHelper('if_after_today', function (text, options) {
		var date = new Date(text),
			today = new Date();

		if (date > today) {
			return options.fn(this);
		}

		return '';
	});

	return Handlebars;
});
