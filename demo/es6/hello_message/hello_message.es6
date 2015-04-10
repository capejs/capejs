class HelloMessage extends Cape.Component {
  render() {
    return this.markup(m =>
      m.p(`Hello ${this.root.data.name}!`)
    )
  }
}

window.HelloMessage = HelloMessage;
