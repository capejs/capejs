var Cape = require('./utilities');

// Cape.DataStore
//
// public properties:
// private properties:
//   _: the object that holds internal methods and properties of this class.
var DataStore = function DataStore() {
  this._ = new _Internal(this);
};

DataStore.create = function() {
  if (!this.instance) this.instance = new(this);
  return this.instance;
}

Cape.extend(DataStore.prototype, {
  attach: function(component) {
    var target = component;
    for (var i = 0, len = this._.components.length; i < len; i++) {
      if (this._.components[i] === component) return;
    }
    this._.components.push(component);
    this.refresh();
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
