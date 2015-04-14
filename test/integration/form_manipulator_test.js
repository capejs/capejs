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
      var c, root, cb, button, textarea;

      c = new FormManipulator();
      c.mount('form-manipulator');

      root = document.getElementById('form-manipulator');

      option = root.getElementsByTagName('option')[0]; // [A]
      expect(option.selected).to.be(true);

      cb = document.getElementsByName('items/1/done')[1];
      expect(cb.checked).to.be(true);

      button = root.getElementsByTagName('button')[2]; // [C]
      button.click(0)
      option = root.getElementsByTagName('option')[2]; // [C]
      expect(option.selected).to.be(true);

      button = root.getElementsByTagName('button')[5]; // [1Z]
      button.click(0)
      option = root.getElementsByTagName('option')[5]; // [Z]
      expect(option.selected).to.be(true);

      textarea = root.getElementsByTagName('textarea')[1];
      textarea.value = 'Test';

      cb = document.getElementsByName('items/0/done')[1];
      cb.checked = true;

      button = root.getElementsByTagName('button')[11]; // [Reset]
      button.click(0)

      option = root.getElementsByTagName('option')[0]; // [A]
      expect(option.selected).to.be(true);

      cb = document.getElementsByName('items/0/done')[1];
      expect(cb.checked).to.be(false);

      textarea = root.getElementsByTagName('textarea')[1];
      expect(textarea.value).to.be('No comment');

      c.unmount();
    })
  })
})
