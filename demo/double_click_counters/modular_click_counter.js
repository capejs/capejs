'use strict'

class ModularClickCounter extends Cape.Component {
  render(m) {
    m.div(String(this.ds.counter), {
      class: 'counter',
      onclick: e => this.ds.increment()
    })
  }
}

if (typeof module !== 'undefined' && module.exports) module.exports = ModularClickCounter
