class HelloMessage extends Cape.Component {
  render() {
    return this.markup(m =>
      m.p(`Hello ${this.root.data.name}!`)
    )
  }
}

var component = new HelloMessage();
component.mount('hello-message');
