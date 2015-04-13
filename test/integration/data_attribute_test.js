describe('Demo', function() {
  describe('DataAttribute', function() {
    before(function() {
      var div = document.createElement('div');
      div.id = "data-attribute";
      document.body.appendChild(div);
    })

    after(function() {
      var element = document.getElementById('data-attribute');
      document.body.removeChild(element);
    })

    it('data attributes test', function() {
      var c, root, h1, data;

      c = new DataAttribute();
      c.mount('data-attribute');

      root = document.getElementById('data-attribute');
      h1 = root.getElementsByTagName('h1');
      data = h1[0].getAttribute('data-hello');
      expect(data).to.be('hello');

      c.unmount();
    })
  })
})
