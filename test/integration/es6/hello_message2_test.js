'use strict';

describe('Demo', function() {
  describe('HelloMessage2', function() {
    before(function() {
      var div = document.createElement('div');
      div.id = "hello-message";
      document.body.appendChild(div);
    })

    after(function() {
      var element = document.getElementById('hello-message');
      document.body.removeChild(element);
    })

    it('should render "Hello, alice!", "Hello, bob!", etc.', function() {
      var c, p, rb;

      c = new HelloMessage2('alice');
      c.mount('hello-message');

      p = document.getElementsByClassName('message')[0];
      expect(p.textContent).to.equal('Hello, alice! My name is Cape.JS.');

      rb = document.getElementsByTagName('input')[1];
      rb.click();

      expect(p.textContent).to.equal('Hello, bob! My name is Cape.JS.');

      c.unmount();
    })
  })
})
