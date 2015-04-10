describe('Component', function() {
  describe('#markup', function() {
    before(function() {
      var div = document.createElement('div');
      div.id = "component";
      div.dataName = "World";
      document.body.appendChild(div);
    })

    after(function() {
      var element = document.getElementById('component');
      document.body.removeChild(element);
    })

    it('should return a VirtualNode object', function() {
      var c, node;

      c = new HelloMessage();
      c.mount('component');
      node = c.markup(function(m) { m.p("Hello World!") });
      c.unmount();
      expect(node.children[0].tagName).to.be("P");
    })
  })

  // This test fails on PhantomJS 1.9.
  // We should wait until PhantomJS 2.0 is released for Linux platforms.
  // See https://github.com/ariya/phantomjs/issues/12948
  //
  // This test is successful on Chrome.
  if (window.navigator.userAgent.indexOf('PhantomJS') == -1) {
  describe('#refresh', function() {
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
      expect(div.textContent).to.be('0');
      div.click();

      div = document.getElementsByClassName('counter')[0];
      expect(div.textContent).to.be('1');

      c.unmount();
    })
  })
  }
})
