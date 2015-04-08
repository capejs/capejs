(function() {
  "use strict";

  var HelloMesage = Cape.createComponentClass({
    render: function() {
      return this.markup(function(m) {
        m.p('Hello ' + this.root.data.name + '!')
      })
    }
  });

  var component = new HelloMesage();
  component.mount('hello-message');
})();
