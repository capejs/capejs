(function() {
  "use strict";

  var TodoList = function() {};

  $.extend(TodoList.prototype, CapeJS.Component.prototype, {
    render: function() {
      var self = this;
      return this.markup(function(b) {
        b.ul(function(b) {
          self.items.forEach(function(item) {
            self.renderItem(b, item);
          })
        });
        self.renderForm(b);
      })
    },

    renderItem: function(b, item) {
      var self = this;
      b.li(function(b) {
        b.label({ class: { completed: item.done }}, function(b) {
          b.input({ type: 'checkbox', checked: item.done,
            onclick: function(e) { self.toggle(item) } });
          b.space().text(item.title);
        })
      })
    },

    renderForm: function(b) {
      var self = this;
      b.form(function(b) {
        b.textField('title', { onkeyup: function(e) { self.refresh() } });
        b.button("Add", {
          disabled: self.getValue('title') === '',
          onclick: function(e) { self.addItem() }
        });
      });
    },

    init: function() {
      this.items = [
        { title: 'Foo', done: false },
        { title: 'Bar', done: true }
      ];
    },

    toggle: function(item) {
      item.done = !item.done;
      this.refresh();
    },

    addItem: function() {
      this.items.push({ title: this.getValue('title'), done: false });
      this.setValue('title', '');
      this.refresh();
    }
  });

  var todo = new TodoList();
  todo.mount('todo-list');
})();
