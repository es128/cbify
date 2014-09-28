'use strict';
var assert = require('assert');
var callbackify = require('./');

it('should make a sync function pass return to a callback', function () {
	function sum (a, b) { return a + b; }
	var sumCb = callbackify(sum);
	var answer;
	sumCb(32, 96, function (err, result) { answer = result; });
	assert.equal(answer, 128);
});
