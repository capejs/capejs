'use strict'

class HelloMessage extends Cape.Component {
  constructor(name) {
    super()
    this.name = name
  }

  render(m) {
    m.h1('Greeting')
    m.class('message').p(m => {
      m.text('Hello, ')
      m.em(this.name + '!')
      m.sp()
      m.text('My name is Cape.JS.')
    })
  }
}

document.addEventListener("DOMContentLoaded", e => {
  let comp = new HelloMessage('world')
  comp.mount('content')
})
