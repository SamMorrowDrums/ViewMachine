define([
  './core'
],function (viewMachine, document) {

  viewMachine.prototype.text = function (text) {
    this.properties.text = text;
    return this;
  };

  viewMachine.prototype.addClass = function (cl) {
    var classes;
    if (!this.properties['class']) {
      classes = [];
    } else {
      classes = this.properties['class'].split(' ');
    }
    if (classes.indexOf(cl) === -1) {
      classes.push(cl);
      this.properties['class'] = classes.join(' ');
      if (this.drawn) {
        document.getElementById(this.properties.id).setAttribute('class', this.properties['class']);
      }
    }
    return this;
  };

  viewMachine.prototype.removeClass = function (cl) {
    var classes = this.properties['class'].split(' ');
    var i = classes.indexOf(cl);
    if (i >= 0 ) {
      classes.splice(i, 1);
      this.properties['class'] = classes.join(' ');
      if (this.drawn) {
        document.getElementById(this.properties.id).setAttribute('class', this.properties['class']);
      }
    }
    return this;
  };
  viewMachine.prototype.css = function (prop, value) {
    //Enables you to specifically set CSS for an element
    if (typeof prop === 'string') {
      if (value === undefined) {
        if (this.drawn){
          return getComputedStyle(document.getElementById(this.properties.id))[prop];
        } else {
          return this.style[prop] || '';
        }
      }
      this.style[prop] = value;
      if (this.drawn){
        document.getElementById(this.properties.id).style[prop] = value;
      }
    } else {
      for (var val in prop){
        this.style[val] = prop[val];
        if (this.drawn) {
          document.getElementById(this.properties.id).style[val] = prop[val];
        }
      }
    }
    return this;
  };

  return viewMachine;
});