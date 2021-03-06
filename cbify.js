!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.cbify=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var wrappy = require('wrappy');
var fnArgs = require('fn-args');

module.exports = wrappy(function cbify (fn) {
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
			result = _err;
		} finally {
			if (result instanceof Error) {
				callback(result);
			} else {
				callback(null, result);
			}
		}

	};
});

},{"fn-args":2,"wrappy":3}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
// Returns a wrapper function that returns a wrapped callback
// The wrapper function should do some stuff, and return a
// presumably different callback function.
// This makes sure that own properties are retained, so that
// decorations and such are not lost along the way.
module.exports = wrappy
function wrappy (fn, cb) {
  if (fn && cb) return wrappy(fn)(cb)

  if (typeof fn !== 'function')
    throw new TypeError('need wrapper function')

  Object.keys(fn).forEach(function (k) {
    wrapper[k] = fn[k]
  })

  return wrapper

  function wrapper() {
    var args = new Array(arguments.length)
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i]
    }
    var ret = fn.apply(this, args)
    var cb = args[args.length-1]
    if (typeof ret === 'function' && ret !== cb) {
      Object.keys(cb).forEach(function (k) {
        ret[k] = cb[k]
      })
    }
    return ret
  }
}

},{}]},{},[1])(1)
});