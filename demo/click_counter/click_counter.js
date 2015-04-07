(function() {
  "use strict";

  var ClickCounter = function() {};

  $.extend(ClickCounter.prototype, CapeJS.Component.prototype, {
    render: function() {
      return this.markup(function(b) {
        b.div(String(this.counter), {
          class: 'counter',
          onclick: function(e) { this.increment() }
        })
      })
    },

    init: function() {
      this.counter = 0;
    },

    increment: function() {
      this.counter++;
      this.refresh();
    }
  });

  var counter = new ClickCounter();
  counter.mount('click-counter');
})();
