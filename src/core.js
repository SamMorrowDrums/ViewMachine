define([
],
function (viewMachine) {
  viewMachine = function (element, attrs, style) {
    return new viewMachine.init(element, attrs, style);
  };
  viewMachine.init = function (element, attrs, style) {
    var $ = element.toLowerCase() !== 'body' ? document.createElement(element) : document.getElementsByTagName('body')[0];
    this.$ = $;
    $.VM = this;
    this.element = $.tagName;
    if (attrs === undefined) {
      attrs = {};
    }
    if (attrs.id !== null) {
      $.id = attrs.id;
    }
    this.attrs = attrs;
    this.events = [];
    this.style = {};
    this.type = 'ViewMachine';
    return this;
  };
  if (window.onload === null) {window.onload = function() {viewMachine.body = viewMachine('body'); };
  } else if (document.onload === null) {document.onload = function() {viewMachine.body = viewMachine('body'); }; }
  viewMachine.init.prototype = viewMachine.prototype;
  window.viewMachine = window.VM = viewMachine;
  return viewMachine;
});