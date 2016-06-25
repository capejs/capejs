'use strict'

class TodoList extends Cape.Component {
  render(m) {
    m.ul(m => {
      this.items.forEach(item =>
        this.renderItem(m, item)
      )
    })
    this.renderForm(m)
  }

  renderItem(m, item) {
    m.li(m => {
      m.label({ class: { completed: item.done }}, m => {
        m.onclick(e => this.toggle(item))
          .checked(item.done).input({ type: 'checkbox' })
        m.text(item.title)
      })
    })
  }

  renderForm(m) {
    m.on('submit', e => { this.addItem(); return false })
    m.formFor('item', m => {
      m.onkeyup(e => this.refresh()).textField('title')
      m.onclick(e => this.addItem())
        .disabled(this.val('item.title') === '').btn("Add")
    })
  }

  init() {
    this.items = [
      { title: 'Foo', done: false },
      { title: 'Bar', done: true }
    ]
    this.refresh()
  }

  toggle(item) {
    item.done = !item.done
    this.refresh()
  }

  addItem() {
    this.items.push({ title: this.val('item.title'), done: false })
    this.val('item.title', '')
    this.refresh()
  }
}
