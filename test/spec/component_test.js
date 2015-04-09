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

      c = new HelloWorld;
      c.mount('component');
      node = c.markup(function(m) { m.p("Hello World!") });
      c.unmount();
      expect(node.children[0].tagName).to.be("P");
    })
  })
})
