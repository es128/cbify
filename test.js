'use strict';
var assert = require('assert');
var callbackify = require('./');

function sum (a, b) { return a + b; }

it('should make a sync function pass return to a callback', function () {
	var sumCb = callbackify(sum);
	var answer;
	sumCb(32, 96, function (err, result) { answer = result; });
	assert.equal(answer, 128);
});

it('should throw if not given a function', function () {
	assert.throws(function () { callbackify(''); });
});

it('should throw if wrapped function not given a callback', function () {
	var sumCb = callbackify(sum);
	assert.throws(function () { sumCb(32, 96); });
});

it('should preserve functions that already expect a callback', function () {
	function cbFunc1 (a, b, callback) { callback(null, a + b); }
	function cbFunc2 (foo, cb) { cb(null, foo); }
	function cbFunc3 (callback_) { callback_(); }
	function cbFunc4 (bar, badlyNamedCb) { badlyNamedCb(null, bar); }

	callbackify(cbFunc1)(0, 1, function (err, res) { assert.equal(res, 1); });

	var res2 = callbackify(cbFunc2)(2, function (err, res) {
		assert.equal(res, 2);
	});
	assert.strictEqual(res2, undefined);

	var res3;
	callbackify(cbFunc3)(function () { res3 = true; });
	assert.ok(res3);

	callbackify(cbFunc4)(4, function (err, res) {
		assert.equal(res, undefined);
	});
});

it('should preserve function properties', function () {
	sum.foo = 'bar'
	var sumCb = callbackify(sum);
	assert.equal(sumCb.foo, 'bar');
});
