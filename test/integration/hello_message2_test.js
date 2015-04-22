describe('Demo', function() {
  describe('HelloMessage2', function() {
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

    it('should render "<p>Hello, <strong>World!</strong></p>"', function() {
      var c, element, p, strong;

      c = new HelloMessage2();
      c.mount('hello-message');

      element = document.getElementById('hello-message');
      p = element.children[0];
      strong = p.getElementsByTagName('strong')[0];
      expect(strong.textContent).to.equal('World!');

      c.unmount();
    })
  })
})
