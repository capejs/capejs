'use strict';

describe('Demo', function() {
  describe('HelloMessage', function() {
    before(function() {
      var div = document.createElement('div');
      div.id = "hello-message";
      document.body.appendChild(div);
    })

    after(function() {
      var element = document.getElementById('hello-message');
      document.body.removeChild(element);
    })

    it('should render "Hello, World!"', function() {
      var c, element, p;

      c = new HelloMessage('World');
      c.mount('hello-message');

      element = document.getElementById('hello-message');
      p = element.children[1];
      expect(p.textContent).to.equal('Hello, World! My name is Cape.JS.');

      c.unmount();
    })
  })
})
