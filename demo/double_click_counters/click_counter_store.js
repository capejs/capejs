'use strict'

class ClickCounterStore extends Cape.DataStore {
  init() {
    this.counter = 0
  }

  increment() {
    this.counter++
    this.propagate()
  }
}

if (typeof module !== 'undefined' && module.exports) module.exports = ClickCounterStore
