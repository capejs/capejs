describe('Demo', function() {
  describe('FormManipulator', function() {
    before(function() {
      var div = document.createElement('div');
      div.id = "form-manipulator";
      document.body.appendChild(div);
    })

    after(function() {
      var element = document.getElementById('form-manipulator');
      document.body.removeChild(element);
    })

    it('should refresh counter', function() {
      var c, root, button;

      c = new FormManipulator();
      c.mount('form-manipulator');

      root = document.getElementById('form-manipulator');

      option = root.getElementsByTagName('option')[0]; // [A]
      expect(option.selected).to.be(true);

      button = root.getElementsByTagName('button')[2]; // [C]
      button.click(0)
      option = root.getElementsByTagName('option')[2]; // [C]
      expect(option.selected).to.be(true);

      button = root.getElementsByTagName('button')[6]; // [Reset]
      button.click(0)
      option = root.getElementsByTagName('option')[0]; // [A]
      expect(option.selected).to.be(true);

      c.unmount();
    })
  })
})
