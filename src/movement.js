define([
  './core'
],function (viewMachine, document) {
  
  viewMachine.prototype.parent = function () {
    var parent = this.$.parentNode;

    // Get parent and return viewMachine property

    if (parent && parent.VM !== undefined) {
      return parent.VM;
    } else if (parent) {

      return VM(parent);
    }

    return parent;
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

    this.$.remove();
    return this;
  };
  viewMachine.prototype.replace = function (element) {
    var parent = this.parent();
    console.log(parent);
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
      this.append(list[i]);
    }
    return this;
  };

  viewMachine.prototype.prepend = function (el) {
    var element = viewMachine(el);

    // Add Element before first child

    this.$.insertAdjacentHTML('afterbegin', element.$.outerHTML);
    element.remove();
    // Ensure that element is the actual element

    element.$ = this.$.firstChild;

    return this;
  };

  viewMachine.prototype.splice = function (pos, n, el) {
    var element = el? viewMachine(el).remove() : null,
    children = this.children(),
    spliced = children.splice(pos, n) || [];
    
    // Splice an HTML element like an array

    if (el) {

      if (spliced.length) {
        spliced[spliced.length - 1].$.insertAdjacentHTML('afterend', element.$.outerHTML);
        viewMachine(spliced[spliced.length - 1].$.nextSibling);
      } else if (n > 0) {

      } else {
        this.prepend(el);
      }
    }

    for (var i = 0; i < spliced.length; i++) {
      spliced[i].remove();
    }

    return spliced;
  };

  return viewMachine;
});