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

