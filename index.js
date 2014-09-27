'use strict';

var fnArgs = require('fn-args');

module.exports = function callbackify (fn) {
	if (typeof fn !== 'function') {
		throw new TypeError('Expected a function');
	}

	var origArgs = fnArgs(fn);
	var lastArg = origArgs[origArgs.length - 1];

	if (
		origArgs.length &&
		lastArg.toLowerCase().indexOf('callback') !== -1 ||
		lastArg === 'cb'
	) {
		return fn;
	}

	return function () {
		var argsL = arguments.length;
		var args = argsL > 1 ? [].slice.call(arguments, 0, argsL - 1) : [];
		var cb = arguments[argsL - 1];

		if (typeof cb !== 'function') {
			throw new Error('Must pass callback function');
		}

		try {
			cb(null, fn.apply(this, args));
		} catch (_err) {
			cb(_err);
		}
	};
};
