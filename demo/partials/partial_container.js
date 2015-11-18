"use strict";

var PartialContainer = Cape.createComponentClass({
  init: function() {
    this.area1 = new ClickableArea(this);
    this.area2 = new ClickableArea(this);
    this.refresh();
  },

  render: function(m) {
    m.div({ class: 'partial-container' }, function(m) {
      m.div(function(m) {
        m.text(String(this.area1.counter));
        m.text(' + ');
        m.text(String(this.area2.counter));
        m.text(' = ');
        m.text(String(this.area1.counter + this.area2.counter));
      });
      this.area1.render(m);
      this.area2.render(m);
    });
  }
});
