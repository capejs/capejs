(function(global) {
  "use strict";

  var HelloMessage = Cape.createComponentClass({
    render: function(m) {
      m.p('Hello, ' + this.root.data.name + '!')
    }
  });

  if ("process" in global) module.exports = HelloMessage;
  global.HelloMessage = HelloMessage;
})((this || 0).self || global);
