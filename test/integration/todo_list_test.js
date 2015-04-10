describe('Demo', function() {
  describe('TodoList', function() {
    before(function() {
      var div = document.createElement('div');
      div.id = "component";
      document.body.appendChild(div);
    })

    after(function() {
      var element = document.getElementById('component');
      document.body.removeChild(element);
    })

    it('should refresh counter', function() {
      var c, input, button, ul, cb, label;

      c = new TodoList();
      c.mount('component');

      input = document.getElementsByName('title')[0];
      input.value = "Test";
      c.refresh();

      button = input.nextSibling;
      button.click();

      ul = document.getElementsByTagName('ul')[0];
      expect(ul.children.length).to.be(3);

      cb = ul.children[2].getElementsByTagName('input')[0];
      cb.click();

      ul = document.getElementsByTagName('ul')[0];
      label = ul.children[2].getElementsByTagName('label')[0];
      expect(label.className).to.be('completed');

      c.unmount();
    })
  })
})
