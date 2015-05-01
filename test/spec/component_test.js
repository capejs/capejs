var isNode = typeof module !== 'undefined' && module.exports !== undefined;

describe('Component', function() {
  beforeEach(function() {
    var div = document.createElement('div');
    div.id = "target";
    document.body.appendChild(div);
  })

  afterEach(function() {
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
      expect(component.val('title')).to.equal('A');
      expect(component.val('name')).to.equal('B');
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
      expect(component.val('foo.title')).to.equal('A');
      expect(component.val('foo.name')).to.equal('B');
    })

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
      expect(component.val('title')).to.equal('A');
      expect(component.val('name')).to.equal('B');
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
      expect(component.val('foo.title')).to.equal('A');
      expect(component.val('foo.name')).to.equal('B');
    })

    it('should set the value of a form field by a hash', function() {
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
      component.val({ title: 'A', name: 'B' });
      component.refresh();
      expect(component.val('title')).to.equal('A');
      expect(component.val('name')).to.equal('B');
    })

    it('should set the value of a field of named form by a hash', function() {
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
      component.val({ foo: { title: 'A', name: 'B'} });
      component.refresh();
      expect(component.val('foo.title')).to.equal('A');
      expect(component.val('foo.name')).to.equal('B');
    })
  })

  describe('renderPartial', function() {
    beforeEach(function() {
      window['NameSpace'] = undefined;
    })

    it('should render a partial', function() {
      var Partial, Klass, component, target, elem;

      Partial = function() {};
      Cape.extend(Partial.prototype, {
        render: function(m) {
          m.span('Hello!');
        }
      })

      window['NameSpace'] = {};
      window['NameSpace']['_Message'] = Partial;

      Klass = Cape.createComponentClass({
        render: function(m) {
          m.p(function(m) {
            this.renderPartial(m, 'name_space.message');
          })
        }
      })

      component = new Klass();
      component.mount('target');

      target = document.getElementById('target');
      element = target.getElementsByTagName('span')[0];
      expect(element.textContent).to.equal('Hello!');
    })

    it('should render a partial setting its "this" object', function() {
      var Partial, Klass, component, target, elem;

      Partial = function() {};
      Cape.extend(Partial.prototype, {
        render: function(m) {
          m.span(this.message);
        }
      })

      window['NameSpace'] = {};
      window['NameSpace']['_Message'] = Partial;

      Klass = Cape.createComponentClass({
        render: function(m) {
          m.p(function(m) {
            this.renderPartial(m, 'name_space.message', { message: 'Hello!' });
          })
        }
      })

      component = new Klass();
      component.mount('target');

      target = document.getElementById('target');
      element = target.getElementsByTagName('span')[0];
      expect(element.textContent).to.equal('Hello!');
    })

    it('should render a partial that has methods', function() {
      var Partial, Klass, component, target, elem;

      Partial = function() {};
      Cape.extend(Partial.prototype, {
        render: function(m) {
          this.renderMessage(m);
        },
        renderMessage: function(m) {
          m.span(this.message);
        }
      })

      window['NameSpace'] = {};
      window['NameSpace']['_Message'] = Partial;

      Klass = Cape.createComponentClass({
        render: function(m) {
          m.p(function(m) {
            this.renderPartial(m, 'name_space.message', { message: 'Hello!' });
          })
        }
      })

      component = new Klass();
      component.mount('target');

      target = document.getElementById('target');
      element = target.getElementsByTagName('span')[0];
      expect(element.textContent).to.equal('Hello!');
    })

    it('should throw an error', function() {
      var Klass, component, target, elem;

      Klass = Cape.createComponentClass({
        render: function(m) {
          m.p(function(m) {
            this.renderPartial(m, 'name_space.message', { message: 'Hello!' });
          })
        }
      })

      component = new Klass();
      expect(function() { component.mount('target') })
        .to.throw(/not found/);
    })
  })
})
