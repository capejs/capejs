'use strict'

var ComponentX = class extends Cape.Component {
  render(m) {
    m.p('This is component X.')
  }
}

var ComponentY = class extends Cape.Component {
  render(m) {
    m.p('This is component Y.')
  }
}

var ComponentZ = class extends Cape.Component {
  render(m) {
    m.p('This is component Z.')
  }
}

var ErrorMessage = class extends Cape.Component {
  render(m) {
    m.p('Something is wrong!')
  }
}
