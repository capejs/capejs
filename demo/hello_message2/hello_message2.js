(function(global) {
  "use strict";

  var HelloMessage2 = Cape.createComponentClass({
    render: function(m) {
      m.p(function(m) {
        m.text('Hello, ');
        m.strong(function(m) {
          m.text(this.root.data.name);
          m.text('!')
        })
      })
    }
  });

  if ("process" in global) module.exports = HelloMessage2;
  global.HelloMessage2 = HelloMessage2;
})((this || 0).self || global);
