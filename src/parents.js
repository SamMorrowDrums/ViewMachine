define([
  './core'
],function (viewMachine, document) {

  viewMachine.parent = function (type, childType, values) {
    var parent = typeof type === 'object' && type.type ? VM(type.type, type.properties) : VM(type);
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

  //When creating a constructor function, add your methods to the types object, so you can add the methods to an object, even without calling the constructor
  viewMachine.types = viewMachine.types || {};
  //Also register the poperties that need to be stored in order to use the above methods
  viewMachine.properties = viewMachine.properties || {};

  return viewMachine;
});