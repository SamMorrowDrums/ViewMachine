define([
],
function (viewMachine) {
  
  // Main function/object for the library

  viewMachine = function (element, attrs, style) {
    return new viewMachine.init(element, attrs, style);
  };

  // Old IE check

  (function () {
    var undef,
    ie,
    v = 3,
    div = document.createElement('div'),
    all = div.getElementsByTagName('i');

    while (
        div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
        all[0]
    );

    ie = v > 4 ? v : undef;
    if (ie && ie < 9) {
      viewMachine.old = true;
    } else {
      viewMachine.old = null;
    }

  })();

  // Constructor function

  viewMachine.init = function (element, attrs, style) {
    var $;

    // Check if passed element was a DOM element
    if (element === null) {
      throw('Value Error: element must be either an HTMLElement, or a string of an HTMLElement');
    }
    else if (element.nodeType === 1) {
      $ = element;
      if ($.VM !== undefined) {

        // If already a viewMachine element, extend it and return it
        
        $.VM.attrs(attrs);
        $.VM.css(style);
        return $.VM;
      }
    } else if (typeof element === 'string'){

      // If element is string, create DOM element

      $ = element.toLowerCase() !== 'body' ? document.createElement(element) : document.body;
    } else if (element instanceof viewMachine.init === true) {

      // If already a viewMachine Element

      element.attrs(attrs);
      element.css(style);
      return element;
    } else {

      // Invalid input

      throw('Value Error: element must be either an HTMLElement, or a string of an HTMLElement');
    }

    // Create circular relationship with DOM if not IE8

    this.$ = $;

    if (!viewMachine.old) {
      $.VM = this;
    }

    // Use the new DOM element to get browser's tagName
    this.element = $.tagName;

    // Set attributes and any inline styiling

    this.attrs(attrs);
    this.css(style);
    return this;
  };

  // Initialize the body element as a viewMachine Element once an onload event has fired

  if (window.onload === null) {window.onload = function() {viewMachine.body = viewMachine(document.body); };
  } else if (document.onload === null) {document.onload = function() {viewMachine.body = viewMachine(document.body); }; }

  // Share prototype with constructor and add viewmachine and VM to the global namespace

  viewMachine.init.prototype = viewMachine.prototype;
  window.viewMachine = window.VM = viewMachine;
  
  return viewMachine;

});