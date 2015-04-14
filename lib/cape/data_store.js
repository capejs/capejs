(function(global) {
  "use strict";

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

  $.extend(DataStore.prototype, {
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
    },
    refresh: function() {}
  });

  // Internal properties of Cape.DataStore
  var _Internal = function _Internal(main) {
    this.main = main;
    this.components = [];
  }

  if (!global.Cape) {
    var Cape = {};
    if ("process" in global) module.exports = Cape;
    global.Cape = Cape;
  }
  if (!global.CapeJS) {
    if ("process" in global) module.exports = CapeJS;
    global.CapeJS = global.Cape;
  }
  global.Cape.DataStore = DataStore;

  global.Cape.createDataStoreClass = function(methods) {
    var klass = function() { DataStore.apply(this, arguments) };
    $.extend(klass.prototype, global.Cape.DataStore.prototype, methods);
    return klass;
  }
})((this || 0).self || global);
