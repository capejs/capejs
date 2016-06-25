'use strict'

class DataAttribute extends Cape.Component {
  render(m) {
    m.h1('Hello!', { data: { hello: 'hello' } })
  }
}

if (typeof module !== 'undefined' && module.exports) module.exports = DataAttribute
