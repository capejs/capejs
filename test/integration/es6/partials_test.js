'use strict';

describe('Demo', function() {
  describe('ES6PartialContainer', function() {
    before(function() {
      var div = document.createElement('div');
      div.id = "partial-container";
      document.body.appendChild(div);
    })

    after(function() {
      var element = document.getElementById('partial-container');
      document.body.removeChild(element);
    })

    it('should refresh counter', function() {
      var p, div;

      p = new ES6PartialContainer();
      p.mount('partial-container');

      div = document.getElementsByClassName('clickable-area')[0];
      expect(div.textContent).to.equal('0');
      div.click();

      div = document.getElementsByClassName('clickable-area')[0];
      expect(div.textContent).to.equal('1');

      div = document.getElementsByClassName('clickable-area')[1];
      expect(div.textContent).to.equal('0');
      div.click();
      div.click();

      div = document.getElementsByClassName('clickable-area')[1];
      expect(div.textContent).to.equal('2');

      div = document.getElementById('total');
      expect(div.textContent).to.equal('1 + 2 = 3');

      p.unmount();
    })
  })
})
