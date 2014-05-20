define([
  './core'
],function (viewMachine, document) {

  viewMachine.events = {};

  viewMachine.addEventListener = function (el, eventName, handler) {
    if (el.addEventListener) {
      el.addEventListener(eventName, handler);
    } else {
      el.attachEvent('on' + eventName, handler);
    }
  };

  viewMachine.on = function (event, callback, data) {
    if (typeof event === 'string' && typeof callback === 'function') {
      if (viewMachine.event[event] ===  undefined) {
        viewMachine.event[event] = [];
      }
      viewMachine.event[event].push([callback, data]);
    } else {
      throw('Type Error: viewMachine.on expects, (string, function)');
    }
  };

  viewMachine.trigger = function (event, data) {
    if (viewMachine.event[event] !== undefined) {
      var info = {
        event: event,
        timestamp: new Date().getTime()
      };
      for (var i = 0; i < viewMachine.event[event].length; i++) {
        if (viewMachine.event[event][i].length === 2) {
          info.data = viewMachine.event[event][i][1];
        }
        viewMachine.event[event][i][0](info, data);
      }
    }
  };

  viewMachine.removeAllListeners = function (event) {
    if (viewMachine.event[event] !== undefined) {
      delete viewMachine.event[event];
    }
  };

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