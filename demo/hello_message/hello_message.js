"use strict";

var HelloMessage = Cape.createComponentClass({
  render: function(m) {
    m.p('Hello, ' + this.root.data.name + '!')
  }
});
