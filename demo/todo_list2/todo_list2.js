"use strict";

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
        m.onclick(function(e) { this.ds.toggle(item) })
          .checked(item.done).input({ type: 'checkbox' })
        m.text(item.title);
      })
    })
  },

  renderForm: function(m) {
    m.onsubmit(function(e) { this.addItem(); return false; });
    m.formFor('item', function(m) {
      m.onkeyup(function(e) { this.refresh() }).textField('title');
      m.onclick(function(e) { this.addItem() })
        .disabled(this.val('item.title') === '').btn("Add");
    });
  },

  init: function() {
    this.ds = TodoItemStore.create();
    this.ds.attach(this);
    this.ds.init();
  },

  addItem: function() {
    this.ds.addItem(this.val('item.title', ''))
  },

  beforeUnmount: function() {
    this.ds.detach(this);
  }
});
