var ClickCounterStore = Cape.createDataStoreClass({
  init: function() {
    this.counter = 0;
  },
  increment: function() {
    this.counter++;
    this.propagate();
  }
});
