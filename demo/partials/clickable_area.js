class ES6ClickableArea extends Cape.Partial {
  constructor() {
    super();
    this.counter = 0;
  },

  render: function(m) {
    var _this = this;
    m.div(String(this.counter), {
      class: 'clickable-area',
      onclick: function(e) { _this.increment() }
    })
  },

  increment: function() {
    this.counter++;
    this.refresh();
  }
});
