!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.callbackify=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
		var argsLen = arguments.length;
		var args = argsLen > 1 ? [].slice.call(arguments, 0, argsLen - 1) : [];
		var callback = arguments[argsLen - 1];
		var result;

		if (typeof callback !== 'function') {
			throw new Error('Must pass callback function');
		}

		try {
			result = fn.apply(this, args);
		} catch (_err) {
			callback(_err);
		}

		if (result instanceof Error) {
			callback(result);
		} else {
			callback(null, result);
		}
	};
};

},{"fn-args":2}],2:[function(require,module,exports){
'use strict';
module.exports = function (fn) {
	if (typeof fn !== 'function') {
		throw new TypeError('Expected a function');
	}

	if (fn.length === 0) {
		return [];
	}

	// from https://github.com/jrburke/requirejs
	var reComments = /(\/\*([\s\S]*?)\*\/|([^:]|^)\/\/(.*)$)/mg;

	var reFnArgs = /^function\s*[^(]*\(([^)]+)\)/;

	var match = reFnArgs.exec(fn.toString().replace(reComments, ''));

	return match ? match[1].split(',').map(function (el) {
		return el.trim();
	}) : [];
};

},{}]},{},[1])(1)
});