define([
	'backbone'
], function (Backbone) {

	'use strict';

	Backbone.View.prototype.close = function () {
		this.remove();
		this.unbind();
	};

	Backbone.Model.prototype.toJSONRecursive = function(){
		return JSON.parse(JSON.stringify(this));
	};

	Backbone.Model.prototype.destroyNoSync = function (options) {
		var self = this;

		self.trigger('destroy', self, self.collection, options);
	};

});
