define([
  './core'
], function (viewMachine) {

  viewMachine.prototype.text = function (text) {
    this.properties.text = text;
    return this;
  };

   
  viewMachine.trim = function (str, max, append) {
    if (str.length >= max) {
      str = str.substring(0, max);
    }
    return append ? str + append : str;
  };

  return viewMachine;
});