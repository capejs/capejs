(function(global) {
  var HelloWorld = Cape.createComponentClass({
    render: function() {
      return this.markup(function(m) {
        m.p('Hello ' + this.root.data.name + '!')
      })
    }
  });

  if ("process" in global) module.exports = HelloWorld;
  global.HelloWorld = HelloWorld;
})((this || 0).self || global);
