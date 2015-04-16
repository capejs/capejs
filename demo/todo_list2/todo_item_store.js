(function(global) {
  "use strict";

  var TodoItemStore = Cape.createDataStoreClass({
    init: function() {
      this.items = [
        { title: 'Foo', done: false },
        { title: 'Bar', done: true }
      ];
      this.propagate();
    },
    addItem: function(title) {
      this.items.push({ title: title, done: false });
      this.propagate();
    },
    toggle: function(item) {
      item.done = !item.done;
      this.propagate();
    }
  });

  if ("process" in global) module.exports = TodoItemStore;
  global.TodoItemStore = TodoItemStore;
})((this || 0).self || global);
