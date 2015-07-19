'use strict';

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
      var c, root, selectBox, option, cb, button, textarea, formData;

      c = new FormManipulator();
      c.mount('form-manipulator');

      root = document.getElementById('form-manipulator');

      selectBox = root.getElementsByTagName('select')[0];
      expect(selectBox.value).to.equal('a');
      option = root.getElementsByTagName('option')[0]; // [A]
      expect(option.selected).to.equal(true);

      cb = document.getElementsByName('items/1/done')[1];
      expect(cb.checked).to.equal(true);

      button = root.getElementsByTagName('button')[2]; // [C]
      button.click(0)
      option = root.getElementsByTagName('option')[2]; // [C]
      expect(option.selected).to.equal(true);

      button = root.getElementsByTagName('button')[5]; // [1Z]
      button.click(0)
      option = root.getElementsByTagName('option')[5]; // [Z]
      expect(option.selected).to.equal(true);

      textarea = root.getElementsByTagName('textarea')[1];
      textarea.value = 'Test';

      cb = document.getElementsByName('items/0/done')[1];
      cb.checked = true;

      formData = c.formData('bar');
      expect(formData.items['0'].genre).to.equal('z');
      expect(formData.items['0'].done).to.equal('1');
      expect(formData.items['1'].remarks).to.equal('Test');

      button = root.getElementsByTagName('button')[11]; // [Reset]
      button.click(0)

      option = root.getElementsByTagName('option')[0]; // [A]
      expect(option.selected).to.equal(true);

      cb = document.getElementsByName('items/0/done')[1];
      expect(cb.checked).to.equal(false);

      textarea = root.getElementsByTagName('textarea')[1];
      expect(textarea.value).to.equal('No comment');

      c.unmount();
    })
  })
})
