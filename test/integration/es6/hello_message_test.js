describe('Demo', function() {
  describe('ES6HelloMessage', function() {
    before(function() {
      var div = document.createElement('div');
      div.id = "hello-message";
      div.dataset.name = "World";
      document.body.appendChild(div);
    })

    after(function() {
      var element = document.getElementById('hello-message');
      document.body.removeChild(element);
    })

    it('should render "Hello, World!"', function() {
      var c, element, p;

      c = new ES6HelloMessage();
      c.mount('hello-message');

      element = document.getElementById('hello-message');
      p = element.children[0];
      expect(p.textContent).to.equal('Hello, World!');

      c.unmount();
    })
  })
})
