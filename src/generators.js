define([

],function (viewMachine, document) {

  function Template (constructor) {
    this.DOM = constructor.apply(this);
  }

  Template.prototype.ref = function(ref, el) {
    //Establish flat refs to viewMachine.El objects, that can be set during construction, for controller use in MVC patterns 
    this.refs = this.refs || {};
    this.refs[ref] = el;
  };
  Template.prototype.dataHandler = function (name, el, func) {
    //Bind a reference to a viewMachine.El with a callback function, for binding data
    this.data = this.data || {};
    this.data[name] = viewMachine.schonfinkelize(func, el);
  };

  viewMachine.Gen = function (constructor) {
    //Template generator class - bind data and keep references, build new versions automatically.
    this.build = function(){
      return new Template(constructor);
    };
    //Template Generator function
  };
  return viewMachine;
});