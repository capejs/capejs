describe('Demo', function() {
  describe('ClickCounter', function() {
    before(function() {
      var div = document.createElement('div');
      div.id = "click-counter";
      document.body.appendChild(div);
    })

    after(function() {
      var element = document.getElementById('click-counter');
      document.body.removeChild(element);
    })

    it('should refresh counter', function() {
      var c, div;

      c = new ClickCounter();
      c.mount('click-counter');

      div = document.getElementsByClassName('counter')[0];
      expect(div.textContent).to.equal('0');
      div.click();

      div = document.getElementsByClassName('counter')[0];
      expect(div.textContent).to.equal('1');

      c.unmount();
    })
  })
})
