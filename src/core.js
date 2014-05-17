define([
],
function (viewMachine) {
  viewMachine = function (element, properties, style) {
    return new viewMachine.init(element, properties, style);
  };
  viewMachine.init = function (element, properties, style) {
    this.element = element;
    this.$ = document.createElement(element);
    if (properties === undefined) {
      properties = {};
    }
    if (properties.id) {
      this.id = properties.id;
    }
    this.drawn = false;
    this.properties = properties;
    this.children = [];
    this.events = [];
    this.style = {};
    this.parent = 'body';
    this.type = 'ViewMachine';
    return this;
  };
  viewMachine.init.prototype = viewMachine.prototype;
  window.viewMachine = window.VM = viewMachine;
  return viewMachine;
});