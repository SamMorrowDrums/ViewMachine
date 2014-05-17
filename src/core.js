define([
],
function (viewMachine) {
  viewMachine = function (element, properties, style) {
    if (this instanceof(viewMachine) === false) {
      return new viewMachine(element, properties, style);
    }
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
  window.viewMachine = window.VM = viewMachine;
  return viewMachine;
});