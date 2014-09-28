# fn-callbackify

Wraps synchronous functions with a callback-style API so they can match their
async brethren. 

Useful for handling both sync and async methods with the same underlying code.
Preserves the sync-ness of the original function, making it possible to use
values passed to the callback as a return value.

## Install

**npm**
```sh
npm install --save fn-callbackify
```

**Bower**
```sh
bower install --save fn-callbackify
```
The browser build for bower includes a UMD wrapper which adapts to various
module systems, or exposes a `callbackify` global if none are present.

**Duo**
```js
var callbackify = require('es128/fn-callbackify')
```

## Usage

```js
var callbackify = require('fn-callbackify');

var sum = callbackify(function (a, b) {
	return a + b;
});

var answer;
sum(32, 96, function (err, result) {
	answer = result;
});

console.log(answer); // 128
// would have been undefined if `sum` had handled the callback asynchronously
```

If provided a function whose last named argument is `cb` or `callback` (or even
if it just contains `callback`), then that function will be returned unchanged.

The `this` context the callbackify'd function is called with will be preserved
for the underlying function. Feel free to use `bind`, `apply`, etc as you would
have before implementing callbackify.

