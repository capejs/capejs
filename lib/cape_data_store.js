(function(global) {
  "use strict;"

  var CapeDataStore = function CapeDataStore() {};

  $.extend(CapeDataStore.prototype, {
    on: function(eventType, callback) {
      if (!this.handlers) this.handlers = {};
      if (!this.handlers[eventType]) this.handlers[eventType] = [];
      this.handlers[eventType].push(callback);
    },
    trigger: function(eventType) {
      var i;
      if (!this.handlers || !this.handlers[eventType]) return;
      for (i = 0; i < this.handlers[eventType].length; i++)
        this.handlers[eventType][i].call(this, eventType);
    }
  });

  if ("process" in global) module.exports = CapeDataStore;
  global.CapeDataStore = CapeDataStore;

})((this || 0).self || global);
