(function (VM) {

  module("Core");

  function tests (body) {

    // Test the core functions of ViewMachine
    
    
    test("prepend", function() {
      var child = VM('div');

      body.prepend(child);

      deepEqual(child, body.children()[0], 'Child is identical to prepended child');
    });
  
  }

  window.onload = function (){
    tests(VM(document.body));
  };


})(viewMachine);