(function() {
  "use strict";

  var HelloMesage = function() {};

  $.extend(HelloMesage.prototype, CapeJS.Component.prototype, {
    render: function() {
      return this.markup(function(b) {
        b.p('Hello ' + this.root.getAttribute('data-name') + '!')
      })
    }
  });

  var component = new HelloMesage();
  component.mount('hello-message');
})();
