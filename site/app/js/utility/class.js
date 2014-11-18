define(['Underscore'], function(_) {

	'use strict';

	return {

		inherits: function (ChildCtor, ParentCtor) {
			var TempCtor = function () {};

			TempCtor.prototype = ParentCtor.prototype;
			ChildCtor.prototype = new TempCtor();
			ChildCtor.prototype.constructor = ChildCtor;

			return ParentCtor.prototype;
		}
	};

});
