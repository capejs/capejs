'use strict'

class FormManipulator extends Cape.Component {
  render(m) {
    this.renderForm1(m)
    this.renderForm2(m)
    this.renderButtons(m)
    var fd = this.formData('bar')
    if (Object.keys(fd).length)
      m.pre(JSON.stringify(fd, null, 2))
  }

  renderForm1(m) {
    m.formFor('foo', m => {
      m.labelFor('title', 'Title').sp().textField('title')
      m.labelFor('genre', 'Genre').sp()
      m.selectBox('genre', { value: 'a' }, m => {
        m.option('A', { value: 'a' })
        m.option('B', { value: 'b' })
        m.option('C', { value: 'c' })
      })
    })
  }

  renderForm2(m) {
    m.formFor('bar', m => {
      var items = [
        { id: 1, title: 'T', genre: 'x', remarks: '' },
        { id: 2, title: 'S', genre: 'y', remarks: '' }
      ]
      items.forEach((item, i) => {
        m.fieldsFor('items', { index: i }, m => {
          m.labelFor('title', 'Title').sp().textField('title')
          m.labelFor('genre', 'Genre').sp()
          m.selectBox('genre', m => {
            m.option('X', { value: 'x' })
            m.option('Y', { value: 'y' })
            m.option('Z', { value: 'z' })
          }).sp()
          m.label(m => {
            m.checkBox('done')
            m.text(' Done')
          }).sp()
          m.label(m => {
            m.radioButton('color', 'red')
            m.text(' Red')
          }).sp()
          m.label(m => {
            m.radioButton('color', 'blue')
            m.text(' Blue')
          })
          m.br()
          m.textareaField('remarks').br()
        })
      })
    })
  }

  renderButtons(m) {
    m.div(m => {
      var htmlClass = 'btn btn-default'
      m.button('A', { class: htmlClass, type: 'button',
        onclick(e) { this.chooseGenre('foo', 'a') } }).sp()
      m.button('B', { class: htmlClass, type: 'button',
        onclick(e) { this.chooseGenre('foo', 'b') } }).sp()
      m.button('C', { class: htmlClass, type: 'button',
        onclick(e) { this.chooseGenre('foo', 'c') } }).sp()
      m.button('1X', { class: htmlClass, type: 'button',
        onclick(e) { this.chooseGenre('bar.items/0', 'x') } }).sp()
      m.button('1Y', { class: htmlClass, type: 'button',
        onclick(e) { this.chooseGenre('bar.items/0', 'y') } }).sp()
      m.button('1Z', { class: htmlClass, type: 'button',
        onclick(e) { this.chooseGenre('bar.items/0', 'z') } }).sp()
      m.button('2X', { class: htmlClass, type: 'button',
        onclick(e) { this.chooseGenre('bar.items/1', 'x') } }).sp()
      m.button('2Y', { class: htmlClass, type: 'button',
        onclick(e) { this.chooseGenre('bar.items/1', 'y') } }).sp()
      m.button('2Z', { class: htmlClass, type: 'button',
        onclick(e) { this.chooseGenre('bar.items/1', 'z') } }).sp()
      m.button('1R', { class: htmlClass, type: 'button',
        onclick(e) { this.chooseColor('bar.items/0', 'red') } }).sp()
      m.button('1B', { class: htmlClass, type: 'button',
        onclick(e) { this.chooseColor('bar.items/0', 'blue') } }).sp()
      m.button('Reset', { class: htmlClass, type: 'button',
        onclick(e) { this.init() } }).sp()
      m.button('Submit', { class: htmlClass, type: 'button',
        onclick(e) { this.refresh() } })
    })
  }

  init() {
    this.val('foo.title', 'Default')
    this.val('foo.genre', 'a')
    this.val('bar.items/0/title', 'No title')
    this.val('bar.items/0/done', false)
    this.val('bar.items/0/genre', 'y')
    this.val('bar.items/0/color', 'red')
    this.val('bar.items/1/done', true)
    this.val('bar.items/1/remarks', 'No comment')
    this.val('bar.items/1/color', 'blue')
    this.refresh()
  }

  chooseGenre(name, value) {
    if (name.indexOf('/') === -1)
      this.val(name + '.genre', value)
    else
      this.val(name + '/genre', value)
    this.refresh()
  }

  chooseColor(name, value) {
    if (name.indexOf('/') === -1)
      this.val(name + '.color', value)
    else
      this.val(name + '/color', value)
    this.refresh()
  }
}

if (typeof module !== 'undefined' && module.exports) module.exports = FormManipulator
