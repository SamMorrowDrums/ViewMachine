define([
  './core'
],function (viewMachine, document) {
  
  viewMachine.prototype.parent = function () {
    return this.$.parentNode;
  };

  viewMachine.prototype.children = function () {
    return this.$.children;
  };

  viewMachine.prototype.remove = function () {

    // Remove element from DOM
    
    this.$.remove();
    return this;
  };
  viewMachine.prototype.replace = function (HTML) {
    //Replaces drawn elements with HTML, designed for updating DOM when 'this' is already drawn, and non-persistant replacement
    if (this.drawn) {
      document.getElementById(this.properties.id).outerHTML = HTML;
      return this;
    }
  };
  viewMachine.prototype.hide = function () {
    //Function for temporary hiding of an element, non-persistent version of removal
    if (this.drawn) {
      var el = document.getElementById(this.properties.id);
      el.parentNode.removeChild(el);
      this.drawn = false;
    }
    return this;
  };
  viewMachine.prototype.append = function (el) {
    //Sets up the parent child relationship of DOM element objects
    this.$.appendChild(el.$);
    return this;
  };
  viewMachine.prototype.mappend = function (list) {
    if (typeof list === 'object') {
      for (var item in list) {
        this.append(list[item]);
      }
    } else {
      for (var i = 0; i < list.length; i++) {
        this.append(list[i]);
      }
    }
    return this;
  };
  viewMachine.prototype.prepend = function (el) {
    //Add an element as the first child
    el.parent = this;
    this.children = [el].concat(this.children);
    if (this.drawn) {
      this.draw();
    }
    return this;
  };
  viewMachine.prototype.splice = function (pos, n, el) {
    //Treats an El, as if it's children are an array and can add in a new child element, uses the actal JS Splice method
    var removed;
    if (el) {
      el.parent = this;
      removed = this.children.splice(pos, n, el);
      try {
        if (this.drawn && el!== undefined) {
          if (pos > 0) {
            var temp = document.getElementById(this.children[pos-1].properties.id);
            if (temp) {
                temp.insertAdjacentHTML('afterend', el.html(true).outerHTML);
            } else {
              this.append(el);
            }
            el.drawn = true;
          } else {
            document.getElementById(this.properties.id).appendChild(el.html(true));
            el.drawn = true;
          }
        }
      } catch (e) {
        this.parent.draw();
      }
    } else {
      removed = this.children.splice(pos, n);
    }
    if (this.drawn) {
      var length = removed.length;
      for (var i = 0; i < length; i++) {
        removed[i].remove();
      }
    }
    return this;
  };

  return viewMachine;
});