
  
  viewMachine = function (element, attrs, style) {
    return new viewMachine.init(element, attrs, style);
  };

  viewMachine.init = function (element, attrs, style) {
    var $;
    if (element instanceof HTMLElement === true) {
      $ = element;
      if ($.VM !== undefined) return $.VM;
    } else {
      $ = element.toLowerCase() !== 'body' ? document.createElement(element) : document.body;
    }
    this.$ = $;
    $.VM = this;
    this.element = $.tagName;
    if (attrs === undefined) {
      attrs = {};
    }
    if (attrs.id !== undefined) {
      $.id = attrs.id;
    }
    this.attrs = attrs;
    this.events = [];
    this.style = {};
    return this;
  };

  if (window.onload === null) {window.onload = function() {viewMachine.body = viewMachine(document.body); };
  } else if (document.onload === null) {document.onload = function() {viewMachine.body = viewMachine(document.body); }; }
  viewMachine.init.prototype = viewMachine.prototype;
  window.viewMachine = window.VM = viewMachine;


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

  
  viewMachine.prototype.parent = function () {
    return this.$.parentNode;
  };

  viewMachine.prototype.children = function () {
    return this.$.children;
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


  viewMachine.crunch = function(source) {
    var src = viewMachine(source);
    var children = src.children();
    var len = children.length;
    for (var i = 0; i < len; i++) {
      viewMachine.crunch(children[i]);
    }
    return src;
  };

  viewMachine.extend = function(out) {
    out = out || {};
    for (var i = 1; i < arguments.length; i++) {
      var obj = arguments[i];
      if (!obj)
        continue;
      if (Array.isArray(obj)){
        out = [];
        for (var n = 0; n < obj.length; n++) {
          if (typeof obj[n] === 'object') {
            out.push({});
            viewMachine.extend(out[i], obj[i]);
          } else {
            out.push(obj[i]);
          }
        }
      }
      for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
          if (typeof obj[key] === 'object')
            viewMachine.extend(out[key], obj[key]);
          else
            out[key] = obj[key];
        }
      }
    }
    return out;
  };

  viewMachine.event = {};

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
  //This is not neccessarily more efficient and should likely be dropped
  var h = Object.prototype.hasOwnProperty;
  
  viewMachine.isEmpty = function (obj) {
    if (obj === null) return true;
    if (obj.length > 0)    return false;
    if (obj.length === 0)  return true;
    // toString and valueOf enumeration bugs in IE < 9
    for (var key in obj) {
      if (h.call(obj, key)) return false;
    }
    return true;
  };

  viewMachine.schonfinkelize = function (fn) {
    var slice = Array.prototype.slice,
      stored_args = slice.call(arguments, 1);
    return function () {
      var new_args = slice.call(arguments),
        args = stored_args.concat(new_args);
      return fn.apply(null, args);
    };
  };
 
  viewMachine.trim = function (str, max, append) {
    if (str.length >= max) {
      str = str.substring(0, max);
    }
    return append ? str + append : str;
  };


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

  //When creating a constructor function, add your methods to the types object, so you can add the methods to an object, even without calling the constructor
  viewMachine.types = viewMachine.types || {};
  //Also register the poperties that need to be stored in order to use the above methods
  viewMachine.properties = viewMachine.properties || {};


  viewMachine.List = function (arg) {
    //Construct html list object takes either a number, JS list, or an object with parent properties for the UL, and a child property containing a list
    var parent = 'ul', children = arg;
    if (arg.parent) {
      parent = {type: 'ul', properties: arg.parent};
      children = arg.children;
    }
    return viewMachine.parent(parent, 'li', children);
  };

  viewMachine.Select = function (arg) {
    //Construct html Select object takes either a number, JS list, or an object with 'parent' containing properties for the select, and a child property containing a list
    var parent = 'select', children = arg;
    if (arg.parent) {
      parent = {type: 'select', properties: arg.parent};
      children = arg.children;
    }
    return viewMachine.parent(parent, 'option', children);
  };

  viewMachine.Table = function (data, keys, headings){
    //Constructs an HTML table El, binding to data, via an array key names, and an object/array with repeated keys
    var table = viewMachine('table');
    var header = viewMachine('thead');
    var body = viewMachine('tbody');
    var rows = keys.length;
    var temp, rowdata, text;
    var theHeadings = headings || keys;
    table.currentHeadings = theHeadings;
    header.append(new viewMachine.parent('tr', 'th', theHeadings));
    for (var row in data) {
      if (h.call(data, row)){
        temp = viewMachine('tr');
        for (var i = 0; i < rows; i++) {
          text = data[row][keys[i]];
          if (Array.isArray(text)){
            text = text.join(', ');
          }
          temp.append(viewMachine('td', {text: text } ) );
        }
        body.append(temp);
      }
    }
    table.children.push(header);
    table.append(body);
    table.preserve = false;
    table.keys = keys;
    viewMachine.extend(table, viewMachine.types.table);
    table.currentData = {};
    table.currentData = viewMachine.extend(table.currentData, data);
    return table;
  };
  viewMachine.properties.table = ['currentData', 'keys', 'currentHeadings'];
  viewMachine.types.table = {
    data: function (data){
      //Adds a data method, allowing you to update the data for the table automatically
      var rows = this.keys.length;
      var tempData;
      if (Array.isArray(data)) {
        tempData = [];
      } else {
        tempData = {};
      }
      var i = 0, temp, v = 0, text;
      for (var missingrow in this.currentData) {
        if (data[missingrow] === undefined){
          v++;
        } else {
          if (v > 0){
            this.children[1].splice(i, v);
          }
          i++;
          v = 0;
        }
      }
      if (v > 0){
        this.children[1].splice(i, v);
      }
      i = 0;
      for (var row in data) {
        if (h.call(data, row)) {
          tempData[row] = data[row];
          if (! h.call(this.currentData, row)) {
            temp = viewMachine('tr');
            for (var n = 0; n < rows; n++) {
              if (h.call(data[row], this.keys[n])) {
                text = data[row][this.keys[n]];
                if (Array.isArray(text)){
                  text = text.join(', ');
                }
                temp.append(viewMachine('td', {text: text } ) );
              } else {
                temp.append(viewMachine('td') );
              }
            }
            this.children[1].splice(i, 0, temp);
          } else if ((JSON.stringify(this.currentData[row]) !== JSON.stringify(data[row]))) {
             //JSON Stringify is not the way to do this. Need to look at ways that I can tell what has changed
            for (var x = 0; x < rows; x++) {
              if (h.call(data[row], this.keys[x])) {
                if (data[row][this.keys[x]] !== this.currentData[row][this.keys[x]]){
                  this.cell(i, x).text(data[row][this.keys[x]]);
                }
              }
            }
          }
          i++;
        }
      }
      this.currentData = tempData;
      return this;
    },
    headings: function (keys, headings) {
      //Change the rows / order of rows for a table, using the current data 
      this.currentHeadings = headings || keys;
      var tempData = {};
      tempData = viewMachine.extend(tempData, this.currentData);
      this.children[0].splice(0, 1, new viewMachine.parent('tr', 'th', this.currentHeadings));
      this.data([]);
      this.keys = keys;
      this.data(tempData);
      return this;
    },
    cell: function (r, c){
      //Simple way to get access to any cell
      return this.children[1].children[r].children[c];
    }
  };

  viewMachine.Video = function (types, src, attrs) {
    var video = viewMachine('video', attrs);
    for (var type in types) {
      video.append( viewMachine( 'source', {src: src + '.' + types[type], type: 'video/' + types[type]} ) );
    }
    return video;
  };


  viewMachine.Image = function (src, preloadSrc, attrs) {
    var img = viewMachine('img', {src: preloadSrc, 'data-img': src});
    img.preload = preloadSrc;
    img.src = src;
    for (var attr in attrs) {
      img.properties[attr] = attrs[attr];
    }
    var source = new Image();
    source.onload = function () {
      img.properties.src = img.properties['data-img'];
      if (img.drawn) {
        img.draw();
      }
    };
    source.src = src;
    return img;
  };

  viewMachine.properties.img = ['src', 'preload'];


  function Template (constructor) {
    this.DOM = constructor.apply(this);
  }

  Template.prototype.ref = function(ref, el) {
    //Establish flat refs to viewMachine.El objects, that can be set during construction, for controller use in MVC patterns 
    this.refs = this.refs || {};
    this.refs[ref] = el;
  };
  Template.prototype.dataHandler = function (name, el, func) {
    //Bind a reference to a viewMachine.El with a callback function, for binding data
    this.data = this.data || {};
    this.data[name] = viewMachine.schonfinkelize(func, el);
  };

  viewMachine.Gen = function (constructor) {
    //Template generator class - bind data and keep references, build new versions automatically.
    this.build = function(){
      return new Template(constructor);
    };
    //Template Generator function
  };

  /*
  viewMachine is a library/framework for dealing with templates, DOM manipulation responsive web design in pure JS.

  There is a philosophy of generation, rather than classic templating, while being able to serialize everything.

  The bottom line is, be free with your JS. Follow MVC, follow a new pattern, never compromise on flexability, whateve you choose.
  */
