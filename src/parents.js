define([
  './core'
],function (viewMachine, document) {

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

  return viewMachine;
});