"use strict";

var TodoList = Cape.createComponentClass({
  render: function(m) {
    m.ul(function(m) {
      this.items.forEach(function(item) {
        this.renderItem(m, item);
      }.bind(this))
    });
    this.renderForm(m);
  },

  renderItem: function(m, item) {
    m.li(function(m) {
      m.label({ class: { completed: item.done }}, function(m) {
        m.input({
          type: 'checkbox',
          checked: item.done,
          onclick: function(e) { this.toggle(item) }
        });
        m.space().text(item.title);
      })
    })
  },

  renderForm: function(m) {
    m.on('submit', function(e) { this.addItem(); return false; });
    m.formFor('item', function(m) {
      m.textField('title', { onkeyup: function(e) { this.refresh() } });
      m.button("Add", {
        type: 'button',
        disabled: this.val('item.title') === '',
        onclick: function(e) { this.addItem(); }
      });
    });
  },

  init: function() {
    this.items = [
      { title: 'Foo', done: false },
      { title: 'Bar', done: true }
    ];
    this.refresh();
  },

  toggle: function(item) {
    item.done = !item.done;
    this.refresh();
  },

  addItem: function() {
    this.items.push({ title: this.val('item.title'), done: false });
    this.val('item.title', '');
    this.refresh();
  }
});
