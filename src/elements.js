define([
  './core',
],function (viewMachine) {

  viewMachine.prototype.attrs = function (attr, val) {
    
    // Gets and sets attributes

    if (typeof attr === 'object') {

      // If object input, set all key, value pairs

      for (var key in attr) {
        if (key === 'text' || key === 'HTMLtext') {
          this[key](attr[key]);
        } else if (this[key] === 'style'){
          this.css(key, attr[key]);
        } else {
          this.$.setAttribute(key, attr[key]);
        }
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

  viewMachine.prototype.css = function (prop, value) {

    //Set and get inline style for an element

    if (typeof prop === 'object') {

      // If object input, set all key, value pairs

      for (var name in prop) {
        this.$.style[name] = prop[name];
      }
    } else if (typeof prop === 'string' && value !== undefined) {

      // Set single key, value

      this.$.style[prop] = value;

    } else if (prop !== undefined) {

      // Get value
      var style = getComputedStyle(this.$)[prop];

      // If style unavailable, try getting raw style

      if (!style) {
        style = this.$.style[prop];
      }
      return style;
    }

    return this;
  };

  viewMachine.prototype.addClass = function (cl) {
    var classes = this.$.getAttribute('class') || '',
    split;
    // If existing classes, add gracefully to end

    if (classes.indexOf(cl) < 0) {
      split = classes.split(' ');
      split.push(cl);
      this.$.setAttribute('class', split.join(' '));
    }
    return this;
  };

  viewMachine.prototype.removeClass = function (cl) {
    var classes = this.$.getAttribute('class'),
        split,
        i;

    // Find and remove class any instance of class

    if (classes) {
      split = classes.split(' ');
      i = split.indexOf(cl);
      if (i >= 0 ) {

        // If match found, remove

        split.splice(i, 1);
        this.$.setAttribute('class', split.join(' '));
      }
    }
    return this;
  };

  return viewMachine;
});