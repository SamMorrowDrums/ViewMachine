define([
  './core',
  './elements',
  './types',
],function (viewMachine, document) {

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