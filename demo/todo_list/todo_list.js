(function() {
  "use strict";

  var TodoList = CapeJS.createComponentClass({
    render: function() {
      return this.markup(function(b) {
        b.ul(function(b) {
          this.items.forEach(function(item) {
            this.renderItem(b, item);
          }.bind(this))
        });
        this.renderForm(b);
      })
    },

    renderItem: function(b, item) {
      b.li(function(b) {
        b.label({ class: { completed: item.done }}, function(b) {
          b.input({ type: 'checkbox', checked: item.done,
            onclick: function(e) { this.toggle(item) } });
          b.space().text(item.title);
        })
      })
    },

    renderForm: function(b) {
      b.form(function(b) {
        b.textField('title', { onkeyup: function(e) { this.refresh() } });
        b.button("Add", {
          disabled: this.getValue('title') === '',
          onclick: function(e) { this.addItem() }
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

  var component = new TodoList();
  component.mount('todo-list');
})();
