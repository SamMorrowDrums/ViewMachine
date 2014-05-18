define([
  './core'
],function (viewMachine, document) {

  var events = [];

  viewMachine.prototype.event = function (event, callback){
    //Method for adding events, that persist after a redraw
    this.events.push({event: event, callback: callback});
    if (typeof callback === 'function') {
      if (this.drawn) {
        viewMachine.addEventListener(document.getElementById(this.properties.id), event, function (e) {
          e.data = this;
          callback(e);
        });
      }
    } else if (typeof callback === 'string') {
      if (this.drawn) {
        var that = this;
        viewMachine.addEventListener(document.getElementById(this.properties.id), event, function (e){
          viewMachine.trigger(callback, that);
        });
      }
    }
    return this;
  };
  
  return viewMachine;
});