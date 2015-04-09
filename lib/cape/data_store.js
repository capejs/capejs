(function(global) {
  "use strict";

  // DataStore
  //
  // public properties:
  // private properties:
  //   _: the object that holds internal properties of this class.
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
    trigger: function() {
      for (var i = this._.components.length; i--;)
        this._.components[i].refresh();
    },
    refresh: function() {}
  });

  // Internal class of DataStore
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

})((this || 0).self || global);
