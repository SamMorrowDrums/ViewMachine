if (ViewMachine === undefined) {
  var ViewMachine = {compatability: false};
}
if (jQuery === undefined) {
  console.log("Please add JS dependecy jQuery before loading this file.");
}

if (!ViewMachine.compatability) {
  var VM = ViewMachine;
}

ViewMachine = (function (VM, $) {
  'use strict';
  /*
    This is a library of HTML element auto-constructors, that put single element types, or groups of elements like an unsorted list (ul, li), in the DOM (where applicable, capable of introspection, for more complex data. Designed to be used by template systems
    Depends on jQuery
  */
  //New constructor function, to begin creating DOM element object constructors and prototypes
  var events = [];
  VM.El = function (element, properties) {
    this.element = element;
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
    return this;
  };
  VM.El.prototype = {
    text: function (text) {
      this.properties.text = text;
      if (this.drawn) {
        this.draw();
      }
      return this;
    },
    getId: function () {
      //Basic function for getting unique IDs or set ones
      if (this.id) {
        return this.id;
      }
      return (Math.floor(Math.random()* 10000000 + 1)).toString();
    },
    html: function (draw) {
      //Returns HTML string of self and all child elements
      if (!this.drawn) {
        this.properties.id = this.getId();
      }
      if (draw) {
        this.drawn = true;
      }
      var el = $("<" + this.element + ">", this.properties);
      el.css(this.style);
      var len = this.children.length;
      for (var n = 0; n < len; n++) {
        $(el).append(this.children[n].html(draw));
      }
      for (var i in this.events) {
        this.events[i].id = this.properties.id;
        events.push([this.events[i], this]);

      }
      return el;
    },
    $: function () {
      if (this.drawn){
        return $('#' + this.properties.id);
      }
      return this.html();
    },
    draw: function () {
      //Draws element, including all children, on the DOM
      events = [];
      if (this.drawn) {
        //If already on the DOM, just redraw
        this.replace(this.html(true));
      } else {
        var el = this.html(true);
        if (typeof this.parent === 'string') {
          //If parent is set as a jQuery identifier (default: body), then append to that element
          $(this.parent).append(el);
          this.drawn = true;
        } else if (this.parent.drawn === true) {
          //If parent is a ViewMachine object, append self to the parent
          $('#' + this.parent.properties.id).append(el);
          this.drawn = true;
        } else {
          throw('DrawError: Parent element not on page');
        }
      }
      var n = events.length;
      var str;
      function caller (id, event, callback, element){
        $('#' + id).on(event, function (e) {
          $(VM).trigger(callback, [e, element]);
        });
      }
      for (var i = 0; i < n; i++) {
        if (typeof events[i][0].callback === 'function') {
          $('#' + events[i][0].id).on(events[i][0].event, events[i][1], events[i][0].callback);
        }
        else {
          caller(events[i][0].id, events[i][0].event, events[i][0].callback, events[i][1]);
        }
      }
      return this;
    },
    remove: function () {
      //Removes elements from their parents and from DOM if drawn
      if (this.drawn) {
        $('#' + this.properties.id).remove();
        this.drawn = false;
      }
      this.properties.id = this.getId();
      if (typeof this.parent !== 'string') {
        this.getId();
        var children = this.parent.children;
        var len = children.length;
        for (var child = 0; child < len; child++) {
          if (children[child].properties.id === this.properties.id) {
            this.parent.children.splice(child, 1);
          }
        }
      }
      return this;
    },
    replace: function (HTML) {
      //Replaces drawn elements with HTML, designed for updating DOM when 'this' is already drawn, and non-persistant replacement
      if (this.drawn) {
        $('#' + this.properties.id).replaceWith(HTML);
        return this;
      }
    },
    hide: function () {
      //Function for temporary hiding of an element, non-persistent version of removal
      if (this.drawn) {
        $('#' + this.properties.id).remove();
        this.drawn = false;
      }
      return this;
    },
    append: function (el) {
      //Sets up the parent child relationship of DOM element objects
      el.parent = this;
      this.children.push(el);
      if (this.drawn) {
        el.draw();
      }
      return this;
    },
    prepend: function (el) {
      //Add an element as the first child
      el.parent = this;
      this.children = [el].concat(this.children);
      if (this.drawn) {
        this.draw();
      }
      return this;
    },
    splice: function (pos, n, el) {
      //Treats an El, as if it's children are an array and can add in a new child element, uses the actal JS Splice method
      var removed;
      if (el) {
        el.parent = this;
        removed = this.children.splice(pos, n, el);
        if (this.drawn) {
          if (pos > 0) {
            $('#' + this.children[pos -1].properties.id).after(el.html());
            el.drawn = true;
          } else {
            $('#' + this.properties.id).append(el.html());
            el.drawn = true;
          }
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
    },
    css: function (prop, value) {
      //Enables you to specifically set CSS for an element
      if (typeof prop === 'string') {
        if (value === undefined) {
          return this.style[value];
        }
        this.style[prop] = value;
        if (this.drawn){
          $('#' + this.properties.id).css(prop, value);
        }
      } else {
        if (this.drawn){
          $('#' + this.properties.id).css(prop);
        }
        for (var val in prop){
          this.style[val] = prop[val];
        }
      }
      return this;
    },
    event: function (event, callback){
      //Method for adding events, that persist after a redraw
      this.events.push({event: event, callback: callback});
      var that = this;
      if (typeof callback === 'function') {
        if (this.drawn) {
          $('#' + this.properties.id).on(event, this, callback);
        }
      } else if (typeof callback === 'string') {
        if (this.drawn) {
          $('#' + this.properties.id).on(event, function (e){
            $(VM).trigger(callback, [e, that]);
          });
        }
      }
    },
    parent: 'body',
    type: 'ViewMachine'
  };

  //New version of the makeList, now a constructor for a list type
  VM.ParentEl = function (type, childType, arg) {
    //Construct html parent object (create lists, select boxes, or append a list of children to a base type)
    var el, props, parent = type;
    if (type.properties) {
      props = type.properties;
      parent = type.type;
    }
    el = new VM.El(parent, props);
    if (typeof arg === "number") {
      for (var n = 0; n < arg; n++) {
        el.append(new VM.El(childType));
      }
    } else if (Array.isArray(arg)) {
      var value, child;
      var len = arg.length;
      for (var item = 0; item<len; item++) {
        if (typeof arg[item] === 'object') {
          if (arg[item].type === 'ViewMachine') {
            child = arg[item];
          } else {
           child = new VM.El(childType, arg[item]);
          }
        } else {
          child = new VM.El(childType, {text: arg[item]});
        }
        el.append(child);
      }
    }
    return el;
  };

  //Functions
  VM.getKeys = function (keyList, obj) {
    //Pass in any object, and a list of keys, and you'll get back an object containing a list the keys, and their values (lists and objects can be "found", and you'll get a list of them as a string)
    //only used for individaul Objects, so you might iterate through a list of users, as an example, and send this funcion keys to find, then process the response for each user...
    var returnObj = {}, items, key, subKey, returned;
    for (key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (Object.prototype.toString.call(obj[key]) !== '[object Array]' && keyList.indexOf(key) !== -1) {
          if (typeof obj[key] === "object") {
            items = [];
            for (subKey in obj[key]) {
              if (obj[key].hasOwnProperty(subKey)) {
                items.push(subKey);
              }
            }
            returnObj[key] = items.join(", ");
            returned = VM.getKeys(keyList, obj[key]);
            for (subKey in returned) {
              if (returned.hasOwnProperty(subKey)) {
                returnObj[subKey] = returned[subKey];
              }
            }
          } else {
            returnObj[key] = obj[key];
          }
        } else if (obj.hasOwnProperty(key) && Object.prototype.toString.call(obj[key]) === '[object Array]') {
          returnObj[key] = obj[key].join(", ");
        } else if (typeof obj[key] === "object") {
          returned = VM.getKeys(keyList, obj[key]);
          for (subKey in returned) {
            if (returned.hasOwnProperty(subKey)) {
              returnObj[subKey] = returned[subKey];
            }
          }
        }
      }
    }
    return returnObj;
  };

  VM.createTemplate = function (obj) {
    //This will need work, but is the basis for template generation
    var template = {};
    if (typeof obj === 'object' && obj.type === 'ViewMachine') {
      template.element = obj.element;
      if (! $.isEmptyObject(obj.style)) {
        template.style = obj.style;
      }
      if (obj.id !== undefined) {
        template.id = obj.id;
      }
      if (! $.isEmptyObject(obj.properties)) {
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
            template.children.push(VM.createTemplate(obj.children[child]));
          }
        }
      } else if (obj.preserve === false){
        template.preserve = false;
      }
      if (VM.properties[obj.element]) {
        for (var prop in VM.properties[obj.element]) {
          if (typeof obj[VM.properties[obj.element][prop]] === 'object') {
            if (Array.isArray(obj[VM.properties[obj.element][prop]])) {
              template[VM.properties[obj.element][prop]] = [];
            } else {
              template[VM.properties[obj.element][prop]] = {};
            }
            $.extend(template[VM.properties[obj.element][prop]], obj[VM.properties[obj.element][prop]]);
          } else {
            template[VM.properties[obj.element][prop]] = obj[VM.properties[obj.element][prop]];
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

  VM.construct = function (template) {
    //Construct a ViewMachine template from a JS object
    var obj;
    if (template.preserve === false) {
      obj = new VM[template.element.substring(0, 1).toUpperCase() + template.element.substring(1, template.element.length)](template[VM.properties[template.element][0]], template[VM.properties[template.element][1]], template[VM.properties[template.element][2]], template[VM.types[template.element][3]]);
    } else {
      if (template.element === 'img' && typeof template.preload === 'string') {
        obj = new VM.Image(template.src, template.preload);
      } else {
        obj = new VM.El(template.element, template.properties);
      }
      if (VM.properties[obj.element]) {
        for (var prop in VM.properties[obj.element]) {
          if (typeof obj[VM.properties[obj.element][prop]] === 'object') {
            obj[VM.properties[obj.element][prop]] = {};
            $.extend(obj[VM.properties[obj.element][prop]], template[VM.properties[obj.element][prop]]);
          } else {
            obj[VM.properties[obj.element][prop]] = template[VM.properties[obj.element][prop]];
          }
        }
      }
      if (VM.types[obj.element]) {
        $.extend(obj, VM.types[obj.element]);
      }
    }
    for (var child in template.children) {
      obj.append(VM.construct(template.children[child]));
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

  VM.jsonTemplate = function (template) {
    //Create, or parse JSON version of template
    if (typeof template === 'string') {
      var obj = JSON.parse(template);
      //Need to run a template constructor on this.
      return VM.construct(obj);
    }
    if (typeof template === 'object' && template.type === 'ViewMachine') {
      template = VM.createTemplate(template);
    }
    return JSON.stringify(template);
  };
  return VM;
}(ViewMachine, jQuery));