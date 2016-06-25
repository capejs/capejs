'use strict'

class PartialContainer extends Cape.Component {
  init() {
    this.area1 = new ClickableArea(this)
    this.area2 = new ClickableArea(this)
    this.refresh()
  }

  render(m) {
    m.div({ class: 'partial-container' }, m => {
      m.div({ id: 'total' }, m => {
        m.text(String(this.area1.counter))
        m.text(' + ')
        m.text(String(this.area2.counter))
        m.text(' = ')
        m.text(String(this.area1.counter + this.area2.counter))
      })
      this.area1.render(m)
      this.area2.render(m)
    })
  }
}
