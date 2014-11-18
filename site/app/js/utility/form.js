define([
    'jquery'
], function ($) {

    'use strict';

    return {

		clearForm: function (f) {
			$(f).find('input').val('');
		},

		formToModel: function (form, model) {
			var self = this,
				success = true;

			this.clearErrors(form);

			$(form).find('[data-bind]').each(function (i, elem) {
				var jelem = $(elem),
					attr = jelem.data('bind'),
					val = {};

				val[attr] = jelem.val();

				model.set(val, {error: function (m, err) {
					self.addError(elem, err);

					if (success) {
						jelem.focus();
					}

					success = false;
				}});
			});

			return success;
		},

		modelToForm: function (model, form) {
			$(form).find('[data-bind]').each(function (i, elem) {
				var attr = $(elem).data('bind');

				$(elem).val(model.get(attr));
			});
		},

		clearErrors: function (form) {
			var jform = $(form);

			jform.find('.js-form-util-error').remove();
			jform.find('.control-group').removeClass('error');
		},

		addError: function (elem, message) {
			var jelem = $(elem);

			var helpInline = $('<span class="js-form-util-error help-inline"></span>').text(message);

			jelem.after(helpInline);
			jelem.closest('.control-group').addClass('error');
		}

    };

});
