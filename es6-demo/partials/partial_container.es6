class ES6PartialContainer extends Cape.Component {
  init() {
    this.area1 = new ES6ClickableArea(this);
    this.area2 = new ES6ClickableArea(this);
    this.refresh();
  }

  render(m) {
    m.div({ class: 'partial-container' }, m => {
      m.div({ id: 'total' }, m => {
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
}

module.exports = ES6PartialContainer;
