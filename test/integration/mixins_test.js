'use strict';

describe('Demo', function() {
  describe('Mixins', function() {
    before(function() {
      var div = document.createElement('div');
      div.id = "main";
      document.body.appendChild(div);
    })

    after(function() {
      var element = document.getElementById('main');
      document.body.removeChild(element);
    })

    it('should render a form', function() {
      var c, form, elem;

      c = new SimpleForm();
      c.mount('main');

      form = document.getElementsByTagName('form')[0];
      elem = form.getElementsByTagName('input')[0];
      expect(elem.className).to.equal('form-control');

      c.unmount();
    })
  })
})
