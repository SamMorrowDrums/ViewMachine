define([

],function (viewMachine) {

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

  return viewMachine;
});