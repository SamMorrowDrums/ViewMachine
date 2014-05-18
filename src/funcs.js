define([
  './core'
],
function (ViewMachine) {

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

  return viewMachine;
});