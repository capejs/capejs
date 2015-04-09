(function(global) {
  "use strict";

  var DataStore = function DataStore() {
    this.components = [];
  };

  DataStore.create = function() {
    if (!this.instance) this.instance = new(this);
    return this.instance;
  }

  $.extend(DataStore.prototype, {
    attach: function(component) {
      var target = component;
      for (var i = 0, len = this.components.length; i < len; i++) {
        if (this.components[i] === component) return;
      }
      this.components.push(component);
      this.refresh();
    },
    detach: function(component) {
      for (var i = 0, len = this.components.length; i < len; i++) {
        if (this.components[i] === component) {
          this.components.splice(i, 1);
          break;
        }
      }
    },
    trigger: function(eventType) {
      for (var i = this.components.length; i--;)
        this.components[i].refresh();
    },
    refresh: function() {}
  });

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
