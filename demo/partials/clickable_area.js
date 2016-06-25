'use strict'

class ClickableArea extends Cape.Partial {
  constructor(parent) {
    super(parent)
    this.counter = 0
  }

  render(m) {
    m.div(String(this.counter), {
      class: 'clickable-area',
      onclick: e => { this.increment() }
    })
  }

  increment() {
    this.counter++
    this.refresh()
  }
}

if (typeof module !== 'undefined' && module.exports) module.exports = ClickableArea
