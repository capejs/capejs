'use strict';

describe('Demo', function() {
  describe('DoubleClickCounters', function() {
    before(function() {
      var div, element;

      div = document.createElement('div');
      div.id = "main";
      document.body.appendChild(div);
      element = document.getElementById('main');
      element.innerHTML = '<div id="counter1"></div><div id="counter2"></div>'
    })

    after(function() {
      var element = document.getElementById('main');
      document.body.removeChild(element);
    })

    it('should refresh both counters', function() {
      var ds, counter1, counter2, div;

      ds = new ClickCounterStore();
      counter1 = new ModularClickCounter();
      counter2 = new ModularClickCounter();
      counter1.ds = ds;
      counter2.ds = ds;
      ds.attach(counter1);
      ds.attach(counter2);
      counter1.mount('counter1');
      counter2.mount('counter2');

      div = document.getElementsByClassName('counter')[0];
      expect(div.textContent).to.equal('0');
      div.click();

      div = document.getElementsByClassName('counter')[0];
      expect(div.textContent).to.equal('1');

      div = document.getElementsByClassName('counter')[1];
      expect(div.textContent).to.equal('1');
      div.click();

      div = document.getElementsByClassName('counter')[0];
      expect(div.textContent).to.equal('2');

      counter1.unmount();
      counter2.unmount();
    })
  })
})
