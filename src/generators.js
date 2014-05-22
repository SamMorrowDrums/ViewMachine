define([

],function (viewMachine) {

  (function (viewMachine) {

    // Takes viewMachine JSON and returns a 'map' of the contents

    function Gen() {
      var template = viewMachine.jsonTemplate(this.template),
          map = viewMachine.crunchMap(template);

      if (this.fn) {
        this.fn.apply(map, arguments);
      }

      return map;
    }
    Gen.prototype.dataHandler = function (name, el, func) {
      //Bind a reference to a viewMachine.El with a callback function, for binding data
      this.data = this.data || {};
      this.data[name] = viewMachine.schonfinkelize(func, el);
   };

   viewMachine.gen = function (json, fn) {
    return Gen.bind({template: json, fn: fn});

  };

  })(viewMachine);

  return viewMachine;
});