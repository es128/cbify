# fn-callbackify

Wraps synchronous functions with a callback-style API so they can match their
async brethren. 

Useful for handling both sync and async methods with the same underlying code.
Preserves the sync-ness of the original function, making it possible to use
values passed to the callback as a return value.

