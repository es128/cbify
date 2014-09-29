'use strict';
var assert = require('assert');
var cbify = require('./');

function sum (a, b) { return a + b; }

it('should make a sync function pass return to a callback', function () {
	var sumCb = cbify(sum);
	var answer;
	sumCb(32, 96, function (err, result) { answer = result; });
	assert.equal(answer, 128);
});

it('should throw if not given a function', function () {
	assert.throws(function () { cbify(''); });
});

it('should throw if wrapped function not given a callback', function () {
	var sumCb = cbify(sum);
	assert.throws(function () { sumCb(32, 96); });
});

it('should preserve functions that already expect a callback', function () {
	function cbFunc1 (a, b, callback) { callback(null, a + b); }
	function cbFunc2 (foo, cb) { cb(null, foo); }
	function cbFunc3 (callback_) { callback_(); }
	function cbFunc4 (bar, badlyNamedCb) { badlyNamedCb(null, bar); }

	cbify(cbFunc1)(0, 1, function (err, res) { assert.equal(res, 1); });

	var res2 = cbify(cbFunc2)(2, function (err, res) {
		assert.equal(res, 2);
	});
	assert.strictEqual(res2, undefined);

	var res3;
	cbify(cbFunc3)(function () { res3 = true; });
	assert.ok(res3);

	cbify(cbFunc4)(4, function (err, res) {
		assert.equal(res, undefined);
	});
});

it('should pass errors to callback', function () {
	function throwsErr () { throw new Error('oops'); }
	function returnsErr () { return new Error('darn'); }

	cbify(returnsErr)(function (err) {
		assert(err instanceof Error, 'returned error not returned');
	});

	assert.doesNotThrow(function () {
		cbify(throwsErr)(function (err) {
			assert(err instanceof Error, 'thrown error not returned');
		});
	});

});

it('should preserve function properties', function () {
	sum.foo = 'bar';
	var sumCb = cbify(sum);
	assert.equal(sumCb.foo, 'bar');
});

it('should preserve this context', function () {
	var hasFoo = cbify(function () { return 'foo' in this; });

	hasFoo(function (err, res) { assert(!res); });
	hasFoo.call({foo: 1}, function (err, res) { assert.equal(res, true); })
});
