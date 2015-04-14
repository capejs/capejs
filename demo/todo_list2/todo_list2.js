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

  var TodoList2 = Cape.createComponentClass({
    render: function(m) {
      m.ul(function(m) {
        this.ds.items.forEach(function(item) {
          this.renderItem(m, item);
        }.bind(this))
      });
      this.renderForm(m);
    },

    renderItem: function(m, item) {
      m.li(function(m) {
        m.label({ class: { completed: item.done }}, function(m) {
          m.input({ type: 'checkbox', checked: item.done,
            onclick: function(e) { this.ds.toggle(item) } });
          m.space().text(item.title);
        })
      })
    },

    renderForm: function(m) {
      m.form(function(m) {
        m.textField('title', { onkeyup: function(e) { this.refresh() } });
        m.button("Add", {
          disabled: this.val('title') === '',
          onclick: function(e) {
            var title = this.val('title');
            this.val('title', '');
            this.ds.addItem(title);
          }
        });
      });
    },

    init: function() {
      this.ds = new TodoItemStore();
      this.ds.attach(this);
      this.ds.init();
    },

    beforeUnmount: function() {
      this.ds.detach(this);
    }
  });

  if ("process" in global) module.exports = TodoList2;
  global.TodoList2 = TodoList2;
})((this || 0).self || global);
