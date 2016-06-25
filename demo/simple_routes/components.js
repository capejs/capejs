'use strict'

class TopPage extends Cape.Component {
  render(m) {
    m.p('This is the top page.')
  }
}

class AboutPage extends Cape.Component {
  render(m) {
    m.p('This is the about page.')
  }
}

class HelpPage extends Cape.Component {
  render(m) {
    m.p('This is the help page.')
  }
}

let container
if (typeof module !== 'undefined' && module.exports)
  container = module.exports
else
  container = window

container.TopPage = TopPage
container.AboutPage = AboutPage
container.HelpPage = HelpPage
