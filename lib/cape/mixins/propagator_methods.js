'use strict';

var PropagatorMethods = {
  attach: function(component) {
    var target = component;
    for (var i = 0, len = this._.components.length; i < len; i++) {
      if (this._.components[i] === component) return;
    }
    this._.components.push(component);
  },

  detach: function(component) {
    for (var i = 0, len = this._.components.length; i < len; i++) {
      if (this._.components[i] === component) {
        this._.components.splice(i, 1);
        break;
      }
    }
  },

  propagate: function() {
    for (var i = this._.components.length; i--;)
      this._.components[i].refresh();
  }
}

module.exports = PropagatorMethods;
