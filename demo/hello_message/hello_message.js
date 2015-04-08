(function() {
  "use strict";

  var HelloMesage = CapeJS.createComponentClass({
    render: function() {
      return this.markup(function(b) {
        b.p('Hello ' + this.root.getAttribute('data-name') + '!')
      })
    }
  });

  var component = new HelloMesage();
  component.mount('hello-message');
})();
