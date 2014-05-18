define([
  './core'
],function (viewMachine) {

  viewMachine.prototype.attrs = function (attr, val) {
    
    // Gets and sets attributes

    if (typeof attr === 'object') {

      // If object input, set all key, value pairs

      for (var key in attr) {
        this.$.setAttribute(key, attr[key]);
      }
    } else if (typeof attr === 'string' && val !== undefined) {

      // Set single key, value

      this.$.setAttribute(attr, val);

    } else if (attr !== undefined) {

      // Get value

      return this.$.getAttribute(attr);
    }

    return this;
  };

  viewMachine.prototype.getAllAttrs = function () {
    var attrs = this.$.attributes,
        result = {};

    // Find and return all set attributes of an element

    for (var i = 0; i < attrs.length; i++) {
      result[attrs[i].name] = attrs[i].value;
    }

    return result;

  };

  viewMachine.prototype.data = function (name, data) {
    var str = 'data-';
    // Gets and sets data-attributes

    if (typeof name === 'object') {

      // If object input, set all key, value pairs

      for (var key in name) {
        this.$.setAttribute(str + key.toString(), name[key]);
      }
    } else if (typeof name === 'string' && data !== undefined) {

      // Set single key, value

      this.$.setAttribute(str + name.toString(), data);

    } else if (name !== undefined) {

      // Get value

      return this.$.getAttribute(str + name.toString());
    }

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