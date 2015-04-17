var isNode = typeof module !== 'undefined' && module.exports !== undefined;

describe('Component', function() {
  before(function() {
    var div = document.createElement('div');
    div.id = "target";
    document.body.appendChild(div);
  })

  after(function() {
    var element = document.getElementById('target');
    document.body.removeChild(element);
  })

  describe('val', function() {
    it('should get the value of a form field', function() {
      var Klass, component;

      Klass = Cape.createComponentClass({
        render: function(m) {
          m.form(function(m) {
            m.textField('title', { value: 'A' });
            m.textField('name', { value: 'B' });
          });
        }
      })

      component = new Klass();
      component.mount('target');
      expect(component.val('title')).to.be('A');
      expect(component.val('name')).to.be('B');
    })

    it('should get the value of a field of named form', function() {
      var Klass, component;

      Klass = Cape.createComponentClass({
        render: function(m) {
          m.form({ name: 'foo' }, function(m) {
            m.textField('title', { value: 'A' });
            m.textField('name', { value: 'B' });
          });
        }
      })

      component = new Klass();
      component.mount('target');
      expect(component.val('foo.title')).to.be('A');
      expect(component.val('foo.name')).to.be('B');
    })

    // On jsdom, `form["foo"]` does not return a form control with the name `foo`.
    if (isNode) return;

    it('should set the value of a form field', function() {
      var Klass, component;

      Klass = Cape.createComponentClass({
        render: function(m) {
          m.form(function(m) {
            m.textField('title');
            m.textField('name');
          });
        }
      })

      component = new Klass();
      component.mount('target');
      component.val('title', 'A');
      component.val('name', 'B');
      component.refresh();
      expect(component.val('title')).to.be('A');
      expect(component.val('name')).to.be('B');
    })

    it('should set the value of a field of named form', function() {
      var Klass, component;

      Klass = Cape.createComponentClass({
        render: function(m) {
          m.form({ name: 'foo' }, function(m) {
            m.textField('title');
            m.textField('name');
          });
        }
      })

      component = new Klass();
      component.mount('target');
      component.val('foo.title', 'A');
      component.val('foo.name', 'B');
      component.refresh();
      expect(component.val('foo.title')).to.be('A');
      expect(component.val('foo.name')).to.be('B');
    })
  })
})
