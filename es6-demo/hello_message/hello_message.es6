'use strict'

class ES6HelloMessage extends Cape.Component {
  render(m) {
    m.p(`Hello, ${this.root.data.name}!`)
  }
}

module.exports = ES6HelloMessage;
