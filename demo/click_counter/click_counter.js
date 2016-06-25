'use strict'

class ClickCounter extends Cape.Component {
  render(m) {
    m.div(String(this.counter), {
      class: 'counter',
      onclick: function(e) { this.increment() }
    })
  }

  init() {
    this.counter = 0
    this.refresh()
  }

  increment() {
    this.counter++
    this.refresh()
  }
}

if (typeof module !== 'undefined' && module.exports) module.exports = ClickCounter
