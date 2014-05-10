if (ViewMachine === undefined) {
  var ViewMachine = {};
}
ViewMachine = (function (VM) {
  'use strict';

  var dataHandler = function (name, el, func) {
    //Bind a reference to a VM.El with a callback function, for binding data
    this.data = this.data || {};
    this.data[name] = VM.schonfinkelize(func, el);
  };
   
  var ref = function(ref, el) {
    //Establish flat refs to VM.El objects, that can be set during construction, for controller use in MVC patterns
    this.refs = this.refs || {};
    this.refs[ref] = el;
  };

  VM.Gen = function (constructor) {
    //Template generator class - bind data and keep references, build new versions automatically.
    this.build = function(){
      var template = {
        dataHandler: dataHandler,
        ref: ref
      };
      template.DOM = constructor.apply(template);

      return template;
    };
    //Template Generator function
  };
  return VM;
}(ViewMachine));