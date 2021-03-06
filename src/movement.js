define([
  './core'
],function (viewMachine, document) {
  
  viewMachine.prototype.parent = function () {
    var parent = this.$.parentNode;

    parent = parent && parent.nodeType === 1 ? parent : null;

    // Get parent and return viewMachine property

    if (parent && parent.VM !== undefined) {
      return parent.VM;
    } else if (parent) {

      return VM(parent);
    }

    throw('Parent is undefined or null');
  };

  viewMachine.prototype.children = function () {
    var children = this.$.children || [],
        output = [];

    // Find children and return list of their viewMachine properties

    for (var i = 0; i < children.length; i++) {
      if (children[i].VM !== undefined) {
        output.push(children[i].VM);
      } else {

        // Not yet a viewMachine Element, create one

        output.push(viewMachine(children[i]));
      }
    }

    return output;
  };

  viewMachine.prototype.remove = function () {

    // Remove element from DOM/parent

    if (this.parent()) {
      this.parent().$.removeChild(this.$);
    }

    return this;
  };

  viewMachine.prototype.empty = function () {
    this.$.innerHTML = '';
    this.innerText = null;
    return this;
  };

  viewMachine.prototype.replace = function (element) {
    var parent = this.parent();
    // If object has a parent HTML element, swap it's children

    if (parent) {
      viewMachine(parent).$.replaceChild(viewMachine(element).$, this.$);
    }

    return this;
  };

  /*
  !! DEPRECATED !! - possible add a DOM version of this
    
  viewMachine.prototype.hide = function () {
    //Function for temporary hiding of an element, non-persistent version of removal
    if (this.drawn) {
      var el = document.getElementById(this.properties.id);
      el.parentNode.removeChild(el);
      this.drawn = false;
    }
    return this;
  };
  */

  viewMachine.prototype.append = function (el) {

    // Appends child to parent

    this.$.appendChild(viewMachine(el).$);

    return this;
  };

  viewMachine.prototype.mappend = function (list) {
    
    // Multi append, pass a list of elements / viewMachine objects / element types

    for (var i = 0; i < list.length; i++) {
      if (list[i]) {
        this.append(list[i]);
      }
    }
    return this;
  };

  viewMachine.prototype.prepend = function (el) {
    var element = el.$ ? el : viewMachine(el);

    /*
      Doing this a longer way, so it preserves object references

    // Add Element before first child
    element.remove();
    this.$.insertAdjacentHTML('afterbegin', element.$.outerHTML);

    element.$ = this.children()[0].$;

    */

    var children = this.children();
    this.empty();
    this.append(element);
    this.mappend(children);
    return this;
  };

  viewMachine.prototype.splice = function (pos, n, el) {
    var element = el? viewMachine(el) : null,
    children = this.children(),
    spliced = element ? children.splice(pos, n, element) : children.splice(pos, n);
  spliced = spliced || [];
    
    // Splice an HTML element like an array

    /*
      Doing this in a way that will preserve object references

    if (element) {
      if (pos > 0) {
        children[pos-1].$.insertAdjacentHTML('afterend', element.$.outerHTML);
        el.$ = viewMachine(this.children()[pos].$).$;
      } else {
        this.prepend(el);
      }
    }


    for (var i = 0; i < spliced.length; i++) {
      spliced[i].remove();
    }
    */

    this.empty();
    this.mappend(children);

    return spliced;
  };

  return viewMachine;
});