define([
],
function (viewMachine) {
  
  viewMachine = function (element, attrs, style) {
    return new viewMachine.init(element, attrs, style);
  };

  viewMachine.init = function (element, attrs, style) {
    var $;
    if (element instanceof HTMLElement === true) {
      $ = element;
      if ($.VM !== undefined) return $.VM;
    } else {
      $ = element.toLowerCase() !== 'body' ? document.createElement(element) : document.body;
    }
    this.$ = $;
    $.VM = this;
    this.element = $.tagName;
    if (attrs === undefined) {
      attrs = {};
    }
    if (attrs.id !== undefined) {
      $.id = attrs.id;
    }
    this.attrs = attrs;
    this.events = [];
    this.style = {};
    return this;
  };

  if (window.onload === null) {window.onload = function() {viewMachine.body = viewMachine(document.body); };
  } else if (document.onload === null) {document.onload = function() {viewMachine.body = viewMachine(document.body); }; }
  viewMachine.init.prototype = viewMachine.prototype;
  window.viewMachine = window.VM = viewMachine;
  
  return viewMachine;

});