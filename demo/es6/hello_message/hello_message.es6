class HelloMessage extends Cape.Component {
  render(m) {
    m.p(`Hello ${this.root.data.name}!`)
  }
}

window.HelloMessage = HelloMessage;
