define([

],function (viewMachine, document) {
  'use strict';
  /*
    This is a library of HTML element auto-constructors, that put single element types, or groups of elements like an unsorted list (ul, li), in the DOM (where applicable, capable of introspection, for more complex data. Designed to be used by template systems
  */
  //New constructor function, to begin creating DOM element object constructors and prototypes
  var events = [];

  viewMachine.prototype.parent = function () {
    return this.$.parentNode;
  };

  viewMachine.prototype.children = function () {
    return this.$.children;
  };

  viewMachine.prototype.text = function (text) {
    this.properties.text = text;
    if (this.drawn) {
      this.draw();
    }
    return this;
  };
  viewMachine.prototype.getId = function () {
    //Basic function for getting unique IDs or set ones
    if (this.id) {
      return this.id;
    }
    return (Math.floor(Math.random()* 10000000 + 1)).toString();
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
  viewMachine.prototype.remove = function () {
    //Removes elements from their parents and from DOM if drawn
    if (this.drawn) {
      var el = document.getElementById(this.properties.id);
      if (el) {
        el.parentNode.removeChild(el);
      }
      this.drawn = false;
    } else {
      if (!this.properties.id) {
        this.properties.id = this.getId();
      }
    }
    if (typeof this.parent !== 'string') {
      var children = this.parent.children;
      var len = children.length;
      for (var child = 0; child < len; child++) {
        if (children[child].properties.id === this.properties.id) {
          this.parent.children.splice(child, 1);
          return this;
        }
      }
    }
    return this;
  };
  viewMachine.prototype.replace = function (HTML) {
    //Replaces drawn elements with HTML, designed for updating DOM when 'this' is already drawn, and non-persistant replacement
    if (this.drawn) {
      document.getElementById(this.properties.id).outerHTML = HTML;
      return this;
    }
  };
  viewMachine.prototype.hide = function () {
    //Function for temporary hiding of an element, non-persistent version of removal
    if (this.drawn) {
      var el = document.getElementById(this.properties.id);
      el.parentNode.removeChild(el);
      this.drawn = false;
    }
    return this;
  };
  viewMachine.prototype.append = function (el) {
    //Sets up the parent child relationship of DOM element objects
    this.$.appendChild(el.$);
    return this;
  };
  viewMachine.prototype.mappend = function (list) {
    if (typeof list === 'object') {
      for (var item in list) {
        this.append(list[item]);
      }
    } else {
      for (var i = 0; i < list.length; i++) {
        this.append(list[i]);
      }
    }
    return this;
  };
  viewMachine.prototype.prepend = function (el) {
    //Add an element as the first child
    el.parent = this;
    this.children = [el].concat(this.children);
    if (this.drawn) {
      this.draw();
    }
    return this;
  };
  viewMachine.prototype.splice = function (pos, n, el) {
    //Treats an El, as if it's children are an array and can add in a new child element, uses the actal JS Splice method
    var removed;
    if (el) {
      el.parent = this;
      removed = this.children.splice(pos, n, el);
      try {
        if (this.drawn && el!== undefined) {
          if (pos > 0) {
            var temp = document.getElementById(this.children[pos-1].properties.id);
            if (temp) {
                temp.insertAdjacentHTML('afterend', el.html(true).outerHTML);
            } else {
              this.append(el);
            }
            el.drawn = true;
          } else {
            document.getElementById(this.properties.id).appendChild(el.html(true));
            el.drawn = true;
          }
        }
      } catch (e) {
        this.parent.draw();
      }
    } else {
      removed = this.children.splice(pos, n);
    }
    if (this.drawn) {
      var length = removed.length;
      for (var i = 0; i < length; i++) {
        removed[i].remove();
      }
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

  //New version of the makeList, now a constructor for a list type
  viewMachine.parent = function (type, childType, arg) {
    //Construct html parent object (create lists, select boxes, or append a list of children to a base type)
    var el, props, parent = type;
    if (type.properties) {
      props = type.properties;
      parent = type.type;
    }
    el = new viewMachine.init(parent, props);
    if (typeof arg === "number") {
      for (var n = 0; n < arg; n++) {
        el.append(new viewMachine.init(childType));
      }
    } else if (Array.isArray(arg)) {
      var value, child;
      var len = arg.length;
      for (var item = 0; item<len; item++) {
        if (typeof arg[item] === 'object') {
          if (arg[item].type === 'ViewMachine') {
            child = arg[item];
          } else {
           child = new viewMachine.init(childType, arg[item]);
          }
        } else {
          child = new viewMachine.init(childType, {text: arg[item]});
        }
        el.append(child);
      }
    }
    return el;
  };

  viewMachine.createTemplate = function (obj) {
    //This will need work, but is the basis for template generation
    var template = {};
    if (typeof obj === 'object' && obj.type === 'ViewMachine') {
      template.element = obj.element;
      if (! viewMachine.isEmpty(obj.style)) {
        template.style = obj.style;
      }
      if (obj.id !== undefined) {
        template.id = obj.id;
      }
      if (! viewMachine.isEmpty(obj.properties)) {
        for (var key in obj.properties) {
          if (obj.properties[key] !== undefined) {
            if (key !== 'id') {
              template.properties = template.properties || {};
              template.properties[key] = obj.properties[key];
            }
          }
       }
      }
      if (obj.children.length && (obj.preserve === undefined || obj.preserve === true)) {
        template.children = [];
        for (var child in obj.children) {
          if (typeof obj === 'object' && obj.type === 'ViewMachine') {
            template.children.push(viewMachine.createTemplate(obj.children[child]));
          }
        }
      } else if (obj.preserve === false){
        template.preserve = false;
      }
      if (viewMachine.properties[obj.element]) {
        for (var prop in viewMachine.properties[obj.element]) {
          if (typeof obj[viewMachine.properties[obj.element][prop]] === 'object') {
            if (Array.isArray(obj[viewMachine.properties[obj.element][prop]])) {
              template[viewMachine.properties[obj.element][prop]] = [];
            } else {
              template[viewMachine.properties[obj.element][prop]] = {};
            }
            template[viewMachine.properties[obj.element][prop]] = viewMachine.extend(template[viewMachine.properties[obj.element][prop]], obj[viewMachine.properties[obj.element][prop]]);
          } else {
            template[viewMachine.properties[obj.element][prop]] = obj[viewMachine.properties[obj.element][prop]];
          }
        }
      }
      if (obj.events.length) {
        template.events = [];
        for (var i in obj.events) {
          if (typeof obj.events[i].callback === 'string') {
            template.events.push({event: obj.events[i].event, callback: obj.events[i].callback});
          }
        }
      }
      return template;
    }
    return false;
  };

  viewMachine.construct = function (template) {
    //Construct a ViewMachine template from a JS object
    var obj;
    if (template.preserve === false) {
      obj = new viewMachine[template.element.substring(0, 1).toUpperCase() + template.element.substring(1, template.element.length)](template[viewMachine.properties[template.element][0]], template[viewMachine.properties[template.element][1]], template[viewMachine.properties[template.element][2]], template[viewMachine.types[template.element][3]]);
    } else {
      if (template.element === 'img' && typeof template.preload === 'string') {
        obj = new viewMachine.Image(template.src, template.preload, template.properties);
      } else {
        obj = new viewMachine.init(template.element, template.properties);
      }
      if (viewMachine.properties[obj.element]) {
        for (var prop in viewMachine.properties[obj.element]) {
          if (typeof obj[viewMachine.properties[obj.element][prop]] === 'object') {
            obj[viewMachine.properties[obj.element][prop]] = {};
            viewMachine.extend(obj[viewMachine.properties[obj.element][prop]], template[viewMachine.properties[obj.element][prop]]);
          } else {
            obj[viewMachine.properties[obj.element][prop]] = template[viewMachine.properties[obj.element][prop]];
          }
        }
      }
      if (viewMachine.types[obj.element]) {
        viewMachine.extend(obj, viewMachine.types[obj.element]);
      }
    }
    for (var child in template.children) {
      obj.append(viewMachine.construct(template.children[child]));
    }
    if (template.style) {
      obj.style = template.style;
    }
    if (template.id !== undefined) {
      obj.id = template.id;
    }
    if (template.events !== undefined) {
      obj.events = template.events;
    }
    return obj;
  };

  viewMachine.jsonTemplate = function (template) {
    //Create, or parse JSON version of template
    if (typeof template === 'string') {
      var obj = JSON.parse(template);
      //Need to run a template constructor on this.
      return viewMachine.construct(obj);
    }
    if (typeof template === 'object' && template.type === 'ViewMachine') {
      template = viewMachine.createTemplate(template);
    }
    return JSON.stringify(template);
  };
  return viewMachine;
});