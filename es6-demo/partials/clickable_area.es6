'use strict'

class ES6ClickableArea extends Cape.Partial {
  constructor(parent) {
    super(parent);
    this.counter = 0;
  }

  render(m) {
    m.div(String(this.counter), {
      class: 'clickable-area',
      onclick: e => { this.increment() }
    })
  }

  increment() {
    this.counter++;
    this.refresh();
  }
}

module.exports = ES6ClickableArea;
