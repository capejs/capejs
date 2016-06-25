'use strict'

class TodoItemStore extends Cape.DataStore {
  init() {
    this.items = [
      { title: 'Foo', done: false },
      { title: 'Bar', done: true }
    ]
    this.propagate()
  }

  addItem(title) {
    this.items.push({ title: title, done: false })
    this.propagate()
  }

  toggle(item) {
    item.done = !item.done
    this.propagate()
  }
}

if (typeof module !== 'undefined' && module.exports) module.exports = TodoItemStore
