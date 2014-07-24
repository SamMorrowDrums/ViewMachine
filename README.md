ViewMachine
===========

### New structure

___VM is currently undergoing the following changes:___

* Using more of the built-in methods for DOM interaction
* Cleaning up source since move to r.js
* Tests need to be added
* Documentation needs to be written once final decisions have been made

Using VM enables you to keep your entire codebase in Javascript, rather than using HTML templating systems, or derivatives.

Please use, fork, improve and submit a pull request if you want to contribute. All contributions welcome.

### Contributing to the Project

Devlopers and Users of Latest Branch, there are a bunch of new types.

### Running tests

Tests can be run with grunt, or in the browser (dependecies must still be installed to run tests, as the QUnit js and CSS is taken from the QUnit library, so tests can be run without web access and so updates are managed, without adding QUnit into source control).

If using IE < 9 a shim is added to the testing page, but support of IE < 9 us unnofficial, and in production use it is expected a custom HTML 5 shim would be used if support from early browsers is neccessary.