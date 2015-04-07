(function(global) {
  "use strict";

  var DataStore = function DataStore() {};

  DataStore.create = function() {
    if (!this.instance) this.instance = new(this);
    return this.instance;
  }

  $.extend(DataStore.prototype, {
    on: function(eventType, callback) {
      var i, len;
      if (!this.handlers) this.handlers = {};
      if (!this.handlers[eventType]) this.handlers[eventType] = [];
      for (i = 0, len = this.handlers[eventType].length; i < len; i++)
        if (this.handlers[eventType][i] == callback) return;
      this.handlers[eventType].push(callback);
    },
    off: function(eventType, callback) {
      var i, len;
      if (!this.handlers || !this.handlers[eventType]) return;
      for (i = 0, len = this.handlers[eventType].length; i < len; i++) {
        if (this.handlers[eventType][i] === callback) {
          this.handlers[eventType].splice(i, 1);
          break;
        }
      }
    },
    trigger: function(eventType) {
      var i, len;
      if (!this.handlers || !this.handlers[eventType]) return;
      for (i = 0, len = this.handlers[eventType].length; i < len; i++)
        this.handlers[eventType][i].call(this, eventType);
    },
    refresh: function() {}
  });

  if (!global.CapeJS) {
    var CapeJS = {};
    if ("process" in global) module.exports = CapeJS;
    global.CapeJS = CapeJS;
  }
  global.CapeJS.DataStore = DataStore;

})((this || 0).self || global);
