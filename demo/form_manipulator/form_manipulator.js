(function(global) {
  "use strict";

  var FormManipulator = Cape.createComponentClass({
    render: function() {
      return this.markup(function(m) {
        this.renderForm1(m);
        this.renderForm2(m);
        this.renderButtons(m);
      })
    },

    renderForm1: function(m) {
      m.form({ name: 'foo' }, function(m) {
        m.textField('title');
        m.select({ name: 'genre' }, function(m) {
          m.option('A', { value: 'a' });
          m.option('B', { value: 'b' });
          m.option('C', { value: 'c' });
        })
      });
    },

    renderForm2: function(m) {
      m.form({ name: 'bar' }, function(m) {
        m.textField('title');
        m.select({ name: 'genre' }, function(m) {
          m.option('X', { value: 'x' });
          m.option('Y', { value: 'y' });
          m.option('Z', { value: 'z' });
        })
      });
    },

    renderButtons: function(m) {
      m.div(function(m) {
        var htmlClass = 'btn btn-default';
        m.button('A', { class: htmlClass,
          onclick: function(e) { this.chooseGenre('foo', 'a') } }).space()
        m.button('B', { class: htmlClass,
          onclick: function(e) { this.chooseGenre('foo', 'b') } }).space()
        m.button('C', { class: htmlClass,
          onclick: function(e) { this.chooseGenre('foo', 'c') } }).space()
        m.button('X', { class: htmlClass,
          onclick: function(e) { this.chooseGenre('bar', 'x') } }).space()
        m.button('Y', { class: htmlClass,
          onclick: function(e) { this.chooseGenre('bar', 'y') } }).space()
        m.button('Z', { class: htmlClass,
          onclick: function(e) { this.chooseGenre('bar', 'z') } }).space()
        m.button('Reset', { class: htmlClass,
          onclick: function(e) { this.init() } })
      })
    },

    init: function() {
      this.val('foo.title', 'Default');
      this.val('foo.genre', 'a');
      this.val('bar.title', 'No title');
      this.val('bar.genre', 'y');
      this.refresh();
    },

    chooseGenre: function(formName, value) {
      this.val(formName + '.genre', value);
      this.refresh();
    }
  });

  if ("process" in global) module.exports = FormManipulator;
  global.FormManipulator = FormManipulator;
})((this || 0).self || global);
