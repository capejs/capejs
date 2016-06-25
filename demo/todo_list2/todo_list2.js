'use strict'

class TodoList2 extends Cape.Component {
  render(m) {
    m.ul(m => {
      this.ds.items.forEach(item => {
        this.renderItem(m, item)
      })
    })
    this.renderForm(m)
  }

  renderItem(m, item) {
    m.li(m => {
      m.label({ class: { completed: item.done }}, m => {
        m.onclick(e => this.ds.toggle(item))
          .checked(item.done).input({ type: 'checkbox' })
        m.text(item.title)
      })
    })
  }

  renderForm(m) {
    m.onsubmit(e => { this.addItem(); return false; })
    m.formFor('item', m => {
      m.onkeyup(e => this.refresh()).textField('title')
      m.onclick(e => this.addItem())
        .disabled(this.val('item.title') === '')
        .btn(m => { m.fa('plus').sp().text('Add') })
    })
  }

  init() {
    this.ds = TodoItemStore.create()
    this.ds.attach(this)
    this.ds.init()
  }

  addItem() {
    this.ds.addItem(this.val('item.title', ''))
  }

  beforeUnmount() {
    this.ds.detach(this)
  }
}

if (typeof module !== 'undefined' && module.exports) module.exports = TodoList2
