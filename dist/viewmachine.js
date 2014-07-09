
  
  // Main function/object for the library

  viewMachine = function (element, attrs, style) {
    return new viewMachine.init(element, attrs, style);
  };

  // Constructor function

  viewMachine.init = function (element, attrs, style) {
    var $;

    // Check if passed element was a DOM element

    if (element.nodeType === 1) {
      $ = element;
      if ($.VM !== undefined) {

        // If already a viewMachine element, extend it and return it
        
        $.VM.attrs(attrs);
        $.VM.css(style);
        return $.VM;
      }
    } else if (typeof element === 'string'){

      // If element is string, create DOM element

      $ = element.toLowerCase() !== 'body' ? document.createElement(element) : document.body;
    } else if (element instanceof viewMachine.init === true) {

      // If already a viewMachine Element

      element.attrs(attrs);
      element.css(style);
      return element;
    } else {

      // Invalid input

      throw('Value Error: element must be either an HTMLElement, or a string of an HTMLElement');
    }

    // Create circular relationship with DOM

    this.$ = $;
    $.VM = this;

    // Use the new DOM element to get browser's tagName

    this.element = $.tagName;

    // Set attributes and any inline styiling

    this.attrs(attrs);
    this.css(style);
    return this;
  };

  // Initialize the body element as a viewMachine Element once an onload event has fired

  if (window.onload === null) {window.onload = function() {viewMachine.body = viewMachine(document.body); };
  } else if (document.onload === null) {document.onload = function() {viewMachine.body = viewMachine(document.body); }; }

  // Share prototype with constructor and add viewmachine and VM to the global namespace

  viewMachine.init.prototype = viewMachine.prototype;
  window.viewMachine = window.VM = viewMachine;


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

      return getComputedStyle(this.$)[prop];
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

  
  viewMachine.prototype.parent = function () {
    var parent = this.$.parentNode;

    // Get parent and return viewMachine property

    if (parent && parent.VM !== undefined) {
      return parent.VM;
    } else if (parent) {

      return VM(parent);
    }

    return parent;
  };

  viewMachine.prototype.children = function () {
    var children = this.$.children || [],
        output = [];

    // Find children and return list of their viewMachine properties

    for (var i = 0; i < children.length; i++) {
      if (children[i].VM !== undefined) {
        output.push(children[i].VM);
      } else {

        // Not yet a viewMachine Element, create one

        output.push(viewMachine(children[i]));
      }
    }

    return output;
  };

  viewMachine.prototype.remove = function () {

    // Remove element from DOM/parent

    if (this.parent()) {
      this.parent().$.removeChild(this.$);
    }

    return this;
  };

  viewMachine.prototype.empty = function () {
    this.$.innerHTML = '';
    this.innerText = null;
    return this;
  };

  viewMachine.prototype.replace = function (element) {
    var parent = this.parent();
    console.log(parent);
    // If object has a parent HTML element, swap it's children

    if (parent) {
      viewMachine(parent).$.replaceChild(viewMachine(element).$, this.$);
    }

    return this;
  };

  /*
  !! DEPRECATED !! - possible add a DOM version of this
    
  viewMachine.prototype.hide = function () {
    //Function for temporary hiding of an element, non-persistent version of removal
    if (this.drawn) {
      var el = document.getElementById(this.properties.id);
      el.parentNode.removeChild(el);
      this.drawn = false;
    }
    return this;
  };
  */

  viewMachine.prototype.append = function (el) {

    // Appends child to parent

    this.$.appendChild(viewMachine(el).$);

    return this;
  };

  viewMachine.prototype.mappend = function (list) {
    
    // Multi append, pass a list of elements / viewMachine objects / element types

    for (var i = 0; i < list.length; i++) {
      this.append(list[i]);
    }
    return this;
  };

  viewMachine.prototype.prepend = function (el) {
    var element = viewMachine(el);
    var attrs = element.getAllAttrs();

    // Add Element before first child

    this.$.insertAdjacentHTML('afterbegin', element.$.outerHTML);
    element.remove();
    // Ensure that element is the actual element

    element.$ = this.$.firstChild;
    element.attrs(attrs);

    return this;
  };

  viewMachine.prototype.splice = function (pos, n, el) {
    var element = el? viewMachine(el).remove() : null,
    children = this.children(),
    spliced = children.splice(pos, n) || [];
    
    // Splice an HTML element like an array

    if (element) {
      if (pos > 0) {
        var attrs = element.getAllAttrs();
        children[pos-1].$.insertAdjacentHTML('afterend', element.$.outerHTML);
        el.$ = viewMachine(this.children()[pos].$).$;
        el.attrs(attrs);
      } else {
        this.prepend(el);
      }
    }


    for (var i = 0; i < spliced.length; i++) {
      spliced[i].remove();
    }

    return spliced;
  };


  viewMachine.prototype.text = function (text) {

    // Completely escaped text function

    this.$.innerHTML = viewMachine.escape(text);
    this.innerText = true;
    return this;
  };

  viewMachine.escape = function (text) {
    var div = document.createElement('div');

    // Use native browser HTML escaping;

    div.appendChild(document.createTextNode(text));
    return div.innerHTML;
  };

  viewMachine.prototype.HTMLtext = function (text) {
    var output = [],
        substr,
        reTags = /<([^>]+)>/gm,
        reOnEvent = /<\w+(?=\s)[^>]*?\s(on\w+)[\s\S]+?>/gm,
        matches = text.match(reTags);

    // Take a string, including HTML, HTML escape body text and exclude script tags 

    if (matches) {
      for (var i = 0; i < matches.length; i++) {

        // Take lump of text before any HTML tags

        substr = text.substring(0, text.indexOf(matches[i]));

        // Use Native browser HTML excaping
        output.push(viewMachine.escape(substr));

        // Filter JS for security (script an onEvent tags)

        if (matches[i].toLowerCase().indexOf('script') < 0 && matches[i].match(reOnEvent) === null) {
          output.push(matches[i]);
        }

        // Crop remaining text to parse

        text = text.substring(text.indexOf(matches[i])+matches[i].length);
      }
    }

    // If any remaining text, HTML escape all characters
    output.push(viewMachine.escape(text));

    this.$.innerHTML = output.join('');
    this.innerText = true;
    return this;
  };

  viewMachine.trim = function (str, max, suffix) {

    // Trim text to a certain max length, or less with optional suffix

    if (str.length >= max) {
      str = str.substring(0, max);
    }
    return suffix ? str + suffix : str;
  };


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


  viewMachine.parent = function (type, childType, values) {
    var parent = typeof type === 'object' && type.type ? VM(type.type, type.attrs) : VM(type);
        children = [];
    
    // Construct html parent objects (ul, ol, div)

    if (Array.isArray(values)) {
      for (var i = 0; i < values.length; i++) {
        if (typeof values[i] === 'object') {

          // If attributes object, pass that

          children.push(VM(childType, values[i]));
        } else {

          // If just a value, use as text

          children.push(VM(childType, {text: values[i]}));
        }
      }
    } else if (typeof values === 'number') {

      // If just a number given, make that many elements

      for (var n = 0; n < values; n++) {
        children.push(VM(childType));
      }
    }

    // Return the parent with all children added

    return parent.mappend(children);
  };


  // Add methods to the types object

  viewMachine.types = viewMachine.types || {};

  // Register properties that need to be stored during serialization

  viewMachine.properties = viewMachine.properties || {};

  viewMachine.List = function (values) {
    var parent = 'ul',
        children = values,
        list;

    // Build an HTML UL, with just the values

    if (values.attrs) {
      parent = {type: 'ul', attrs: values.attrs};
      children = values.values;
    }

    // Create list, and extend it's methods

    list = viewMachine.parent(parent, 'li', children);

    viewMachine.extend(list, viewMachine.types.list);
    return list;
  };

  viewMachine.types.list = {
    values: function (values) {
      var temp = viewMachine.parent('ul', 'li', values);

      // Change contents of an exisitng list

      this.empty();
      this.mappend(temp.children());
    }
  };

  viewMachine.Select = function (values) {
    var parent = 'select',
        children = values;

    // Create a select element

    if (values.parent) {
      parent = {type: 'select', attrs: values.parent};
      children = values.children;
    }

    var select = viewMachine.parent(parent, 'option', children);

    viewMachine.extend(select, viewMachine.types.select);
    return select;
  };

  viewMachine.types.select = {
    options: function (values) {
      var temp = viewMachine.parent('select', 'option', values);

      // Change options of an exisitng select

      this.empty();
      this.mappend(temp.children());
    }
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
    header.append(viewMachine.parent('tr', 'th', theHeadings));
    table.append(header);
    for (var row in data) {
      if (data.hasOwnProperty(row)){
        temp = viewMachine('tr');
        for (var i = 0; i < rows; i++) {
          text = data[row][keys[i]];
          if (text === undefined) {
            text = '';
          }
          if (Array.isArray(text)){
            text = text.join(', ');
          }
          temp.append(viewMachine('td', {text: text } ) );
        }
        body.append(temp);
      }
    }
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
        if (data.hasOwnProperty(row)) {
          tempData[row] = data[row];
          if (! this.currentData.hasOwnProperty(row)) {
            temp = viewMachine('tr');
            for (var n = 0; n < rows; n++) {
              if (data[row].hasOwnProperty(this.keys[n])) {
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
              if (data[row].hasOwnProperty(this.keys[x])) {
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
      this.children()[0].splice(0, 1, new viewMachine.parent('tr', 'th', this.currentHeadings));
      this.data([]);
      this.keys = keys;
      this.data(tempData);
      return this;
    },
    cell: function (r, c){

      //Simple way to get access to any cell

      return this.children()[1].children()[r].children()[c];
    }
  };

  viewMachine.Video = function (types, src, attrs) {
    var video = viewMachine('video', attrs);

    // Create HTML5 video element, with multiple types

    for (var type in types) {
      video.append( viewMachine( 'source', {src: src + '.' + types[type], type: 'video/' + types[type]} ) );
    }
    return video;
  };


  viewMachine.Image = function (src, preloadSrc, attrs) {
    var img = viewMachine('img', viewMachine.extend(attrs, {src: preloadSrc, 'data-img': src}));
    img.preload = preloadSrc;
    img.src = src;

    // Create preloading images

    var source = new Image();
    source.onload = function () {
      img.attrs('src', img.data('img'));
    };
    source.src = src;
    return img;
  };

  viewMachine.properties.img = ['src', 'preload'];


  viewMachine.createTemplate = function (obj) {
    var template = {},
        type = obj.element.toLowerCase();
    if (typeof obj === 'object' && obj instanceof viewMachine.init) {

      // Check if a viewMachine object, then take basic props / attrs

      template.element = obj.element;
      if (obj.id !== undefined) {
        template.id = obj.id;
      }
      template.attrs = obj.getAllAttrs() || {};
      if (obj.innerText) {
        template.attrs.text = obj.$.innerHTML;
      } else {
        var children = obj.children();

        // Get children and their properties recursively
        // If an object doesn't has a false preserve property, then just store it's construction data

        if (children.length && (obj.preserve === undefined || obj.preserve === true)) {
          template.children = [];
          for (var child in children) {
            if (typeof obj === 'object' && obj instanceof viewMachine.init) {
              template.children.push(viewMachine.createTemplate(children[child]));
            }
          }
        } else if (obj.preserve === false){
          template.preserve = false;
        }

        // If the object is a registered 'viewMachine Type', get the specified properties

        if (viewMachine.properties[type]) {
          for (var prop in viewMachine.properties[type]) {
            if (typeof obj[viewMachine.properties[type][prop]] === 'object') {
              if (Array.isArray(obj[viewMachine.properties[type][prop]])) {
                template[viewMachine.properties[type][prop]] = [];
              } else {
                template[viewMachine.properties[type][prop]] = {};
              }
              template[viewMachine.properties[type][prop]] = viewMachine.extend(template[viewMachine.properties[type][prop]], obj[viewMachine.properties[type][prop]]);
            } else {
              template[viewMachine.properties[type][prop]] = obj[viewMachine.properties[type][prop]];
            }
          }
        }
      }

      // If there are events that can be serialized, store them

      if (obj.events && obj.events.length) {
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
    var obj,
        type = template.element.toLowerCase();

    // Turn a template object into a viewMachine object
    // If object is not preserved, apply it's data

    if (template.preserve === false) {
      var details = {
        func: type.substring(0, 1).toUpperCase() + type.substring(1),
        info: []
      };
      for (var i = 0; i < viewMachine.properties[type].length; i++) {
        details.info.push(template[viewMachine.properties[type][i]]);
      }
      obj = viewMachine[details.func].apply(viewMachine, details.info);
      obj.attrs(template.attrs);
    } else {

      // Handle image preloading

      if (type === 'img' && typeof template.preload === 'string') {
        obj = viewMachine.Image(template.src, template.preload, template.attrs);
      } else {
        obj = new viewMachine.init(type, template.attrs);
      }

      // If a registered type, apply all registered methods

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

    // Recursively call for each child

    for (var child in template.children) {
      obj.append(viewMachine.construct(template.children[child]));
    }

    // Re-apply events !!! THIS NEEDS COMPLETION AS PART OF EVENTS WORK !!!

    if (template.events !== undefined) {
      //obj.on ;
    }
    return obj;
  };

  viewMachine.jsonTemplate = function (template) {

    // Create, or parse JSON version of template

    if (typeof template === 'string') {

      // Parse as JSON back to viewMachine

      var obj = JSON.parse(template);
      return viewMachine.construct(obj);
    }
    if (typeof template === 'object') {

      // parse as viewMachine object, and convert to JSON

      template = viewMachine.createTemplate(template);
    }
    return JSON.stringify(template);
  };

  viewMachine.crunch = function(source) {
    var src =  viewMachine(source),
        children = src.children(),
        len = children.length;

    // 'Crunches' HTML page from a source element, into viewMachine code

    for (var i = 0; i < len; i++) {
      viewMachine.crunch(children[i]);
    }
    return src;
  };

  viewMachine.crunchMap = function(source) {
    var map,
        children,
        cl,
        id,
        name;

    // 'Crunches' down from a source, and returns a 'map' of key elements

    if (arguments.length === 2) {
      map = arguments[1];
    } else {
      map = {
        origin: viewMachine.crunch(source),
        id: {},
        classes : {},
        name: {}
      };
    }

    // Ensure that a source is a DOM Element

    children = source.VM ? source.children : source.$.children;

    // For each child add items with an id, class or name property to map

    for (var i = 0; i < children.length; i++) {
      id = children[i].id;
      if (id) {
        map.id[id] = children[i].VM;
      }

      cl = children[i].getAttribute('class');
      if (cl) {
        cl = cl.split(' ');
        for (var n = 0; n < cl.length; n++) {
          map.classes[cl[n]] = map.classes[cl[n]] || [];
          map.classes[cl[n]].push(children[i].VM);
        }
      }
      name = children[i].getAttribute('name');
      if (name) {
        map.name[name] = children[i].VM;
      }

      // recursively call for each child

      viewMachine.crunchMap(children[i], map);
    }


    return map;
  };


  (function (viewMachine) {

    // Returns a function that returns a 'map' of JSON render [after applying your function]

    function Gen() {
      var template = viewMachine.jsonTemplate(this.template),
          map = viewMachine.crunchMap(template);

      if (this.fn) {
        this.fn.apply(map, arguments);
      }

      return map;
    }

   viewMachine.gen = function (json, fn) {
    return Gen.bind({template: json, fn: fn});

  };

  })(viewMachine);

  /*
  viewMachine is a library/framework for dealing with templates, DOM manipulation responsive web design in pure JS.

  There is a philosophy of generation, rather than classic templating, while being able to serialize everything.

  The bottom line is, be free with your JS. Follow MVC, follow a new pattern, never compromise on flexability, whateve you choose.
  */
