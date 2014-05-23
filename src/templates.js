define([
  './core',
  './elements',
  './funcs',
  './types'
],function (viewMachine, document) {

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

  return viewMachine;
});