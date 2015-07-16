"use strict";

var FormManipulator = Cape.createComponentClass({
  render: function(m) {
    this.renderForm1(m);
    this.renderForm2(m);
    this.renderButtons(m);
    var fd = this.formData('bar');
    if (Object.keys(fd).length)
      m.pre(JSON.stringify(fd, null, 2));
  },

  renderForm1: function(m) {
    m.formFor('foo', function(m) {
      m.labelFor('title', 'Title').sp().textField('title');
      m.labelFor('genre', 'Genre').sp();
      m.selectBox('genre', { value: 'a' }, function(m) {
        m.option('A', { value: 'a' });
        m.option('B', { value: 'b' });
        m.option('C', { value: 'c' });
      });
    });
  },

  renderForm2: function(m) {
    m.formFor('bar', function(m) {
      var items = [
        { id: 1, title: 'T', genre: 'x', remarks: '' },
        { id: 2, title: 'S', genre: 'y', remarks: '' }
      ]
      items.forEach(function(item, i) {
        m.fieldsFor('items', { index: i }, function(m) {
          m.labelFor('title', 'Title').sp().textField('title');
          m.labelFor('genre', 'Genre').sp();
          m.selectBox('genre', function(m) {
            m.option('X', { value: 'x' });
            m.option('Y', { value: 'y' });
            m.option('Z', { value: 'z' });
          }).space();
          m.label(function(m) {
            m.checkBox('done')
            m.text(' Done')
          }).sp();
          m.label(function(m) {
            m.radioButton('color', 'red')
            m.text(' Red')
          }).sp();
          m.label(function(m) {
            m.radioButton('color', 'blue')
            m.text(' Blue')
          });
          m.br();
          m.textareaField('remarks').br();
        });
      });
    });
  },

  renderButtons: function(m) {
    m.div(function(m) {
      var htmlClass = 'btn btn-default';
      m.button('A', { class: htmlClass, type: 'button',
        onclick: function(e) { this.chooseGenre('foo', 'a') } }).space()
      m.button('B', { class: htmlClass, type: 'button',
        onclick: function(e) { this.chooseGenre('foo', 'b') } }).space()
      m.button('C', { class: htmlClass, type: 'button',
        onclick: function(e) { this.chooseGenre('foo', 'c') } }).space()
      m.button('1X', { class: htmlClass, type: 'button',
        onclick: function(e) { this.chooseGenre('bar.items/0', 'x') } }).space()
      m.button('1Y', { class: htmlClass, type: 'button',
        onclick: function(e) { this.chooseGenre('bar.items/0', 'y') } }).space()
      m.button('1Z', { class: htmlClass, type: 'button',
        onclick: function(e) { this.chooseGenre('bar.items/0', 'z') } }).space()
      m.button('2X', { class: htmlClass, type: 'button',
        onclick: function(e) { this.chooseGenre('bar.items/1', 'x') } }).space()
      m.button('2Y', { class: htmlClass, type: 'button',
        onclick: function(e) { this.chooseGenre('bar.items/1', 'y') } }).space()
      m.button('2Z', { class: htmlClass, type: 'button',
        onclick: function(e) { this.chooseGenre('bar.items/1', 'z') } }).space()
      m.button('1R', { class: htmlClass, type: 'button',
        onclick: function(e) { this.chooseColor('bar.items/0', 'red') } }).space()
      m.button('1B', { class: htmlClass, type: 'button',
        onclick: function(e) { this.chooseColor('bar.items/0', 'blue') } }).space()
      m.button('Reset', { class: htmlClass, type: 'button',
        onclick: function(e) { this.init() } }).space()
      m.button('Submit', { class: htmlClass, type: 'button',
        onclick: function(e) { this.refresh() } })
    })
  },

  init: function() {
    this.val('foo.title', 'Default');
    this.val('foo.genre', 'a');
    this.val('bar.items/0/title', 'No title');
    this.val('bar.items/0/done', false);
    this.val('bar.items/0/genre', 'y');
    this.val('bar.items/0/color', 'red');
    this.val('bar.items/1/done', true);
    this.val('bar.items/1/remarks', 'No comment');
    this.val('bar.items/1/color', 'blue');
    this.refresh();
  },

  chooseGenre: function(name, value) {
    if (name.indexOf('/') === -1)
      this.val(name + '.genre', value);
    else
      this.val(name + '/genre', value);
    this.refresh();
  },

  chooseColor: function(name, value) {
    if (name.indexOf('/') === -1)
      this.val(name + '.color', value);
    else
      this.val(name + '/color', value);
    this.refresh();
  }
});
