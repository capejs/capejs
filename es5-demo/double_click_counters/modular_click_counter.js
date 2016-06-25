"use strict";

var ModularClickCounter = Cape.createComponentClass({
  render: function(m) {
    m.div(String(this.ds.counter), {
      class: 'counter',
      onclick: function(e) { this.ds.increment() }
    })
  }
});
