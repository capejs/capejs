class ES6HelloMessage extends Cape.Component {
  render(m) {
    m.p(`Hello, ${this.root.data.name}!`)
  }
}

window.ES6HelloMessage = ES6HelloMessage;
