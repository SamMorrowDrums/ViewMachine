define([
  './core',
  './elements',
  './types',
],function (viewMachine, document) {

    viewMachine.createTemplate = function (obj) {
    //This will need work, but is the basis for template generation
    var template = {},
        type = obj.element.toLowerCase();
    if (typeof obj === 'object' && obj instanceof viewMachine.init) {
      template.element = obj.element;
      if (obj.id !== undefined) {
        template.id = obj.id;
      }
      template.attrs = obj.getAllAttrs() || {};
      if (obj.innerText) {
        template.attrs.text = obj.$.innerHTML;
      } else {
        var children = obj.children();
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
    //Construct a ViewMachine template from a JS object
    var obj,
        type = template.element.toLowerCase();
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
      if (type === 'img' && typeof template.preload === 'string') {
        obj = viewMachine.Image(template.src, template.preload, template.attrs);
      } else {
        obj = new viewMachine.init(type, template.attrs);
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
    if (typeof template === 'object') {
      template = viewMachine.createTemplate(template);
    }
    console.log(template);
    return JSON.stringify(template);
  };

    return viewMachine;
});