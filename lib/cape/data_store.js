"use strict";

var Cape = require('./utilities');

// Cape.DataStore
//
// public properties:
//   options: the object that holds option values given to the constructor
// private properties:
//   _: the object that holds internal methods and properties of this class.
var DataStore = function DataStore(options) {
  this.options = options || {};
  this._ = new _Internal(this);
  if (typeof this.init === 'function') this.init();
};

DataStore.create = function(options) {
  if (!this.instance) this.instance = new this(options);
  return this.instance;
}

Cape.extend(DataStore.prototype, {
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
});

// Internal properties of Cape.DataStore
var _Internal = function _Internal(main) {
  this.main = main;
  this.components = [];
}

module.exports = DataStore;
