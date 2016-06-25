'use strict'

class HelloMessage2 extends Cape.Component {
  constructor(name) {
    super()
    this.names = [ 'alice', 'bob', 'charlie' ]
    this.name = name
  }

  render(m) {
    m.h1('Greeting')
    m.p('Who are you?')
    m.div(m => {
      this.names.forEach(name => {
        m.label(m => {
          m.checked(name === this.name)
            .onclick(e => { this.name = e.target.value; this.refresh() })
            .radioButton('name', name)
          m.sp()
          m.text(name)
        })
      })
    })
    m.class('message').p(m => {
      m.text('Hello, ')
      m.em(this.name + '!')
      m.sp()
      m.text('My name is Cape.JS.')
    })
  }
}

if (typeof module !== 'undefined' && module.exports) module.exports = HelloMessage2
