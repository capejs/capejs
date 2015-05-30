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

  describe('mount', function() {
    it('should throw when no argument is given', function() {
      var Klass, component;

      Klass = Cape.createComponentClass({
        render: function(m) {
          m.p('hello!');
        }
      })

      component = new Klass();

      expect(function() { component.mount() }).to.throw(/missing/);
    })

    it('should throw when the argument is not a string', function() {
      var Klass, component;

      Klass = Cape.createComponentClass({
        render: function(m) {
          m.p('hello!');
        }
      })

      component = new Klass();

      expect(function() { component.mount(0) }).to.throw(/must be a string/);
    })

    it('should throw when the component is already mounted', function() {
      var Klass, component;

      Klass = Cape.createComponentClass({
        render: function(m) {
          m.p('hello!');
        }
      })

      component = new Klass();
      component.mount('target');

      expect(function() { component.mount('target') }).to.throw(/already/);
    })
  })

  describe('unmount', function() {
    it('should throw when the component is not mounted yet', function() {
      var Klass, component;

      Klass = Cape.createComponentClass({
        render: function(m) {
          m.p('hello!');
        }
      })

      component = new Klass();

      expect(function() { component.unmount() }).to.throw(/yet/);
    })

    it('should call beforeUnmount callback', function() {
      var Klass, component;

      Klass = Cape.createComponentClass({
        render: function(m) {
          m.p('hello!');
        },

        beforeUnmount: sinon.spy()
      })

      component = new Klass();
      component.mount('target');
      component.unmount();

      expect(component.beforeUnmount.called).to.be.true
    })

    it('should call afterUnmount callback', function() {
      var Klass, component;

      Klass = Cape.createComponentClass({
        render: function(m) {
          m.p('hello!');
        },

        afterUnmount: sinon.spy()
      })

      component = new Klass();
      component.mount('target');
      component.unmount();

      expect(component.afterUnmount.called).to.be.true
    })
  })

  describe('root.data', function() {
    it('should return an object which contains data-* attribute values', function() {
      var div, Klass, component;

      div = document.getElementById('target');
      div.setAttribute("data-name", "Foo");
      div.setAttribute("data-user-id", "100");

      Klass = Cape.createComponentClass({
        render: function(m) {
          m.p(this.root.data.name);
          m.p(this.root.data.userId);
        }
      })

      component = new Klass();
      component.mount('target');

      div = document.getElementById('target');
      expect(div.getElementsByTagName('p')[0].textContent).to.equal('Foo');
      expect(div.getElementsByTagName('p')[1].textContent).to.equal('100');
    })
  })

  describe('val', function() {
    it('should get the value of a form field', function() {
      var Klass, component;

      Klass = Cape.createComponentClass({
        render: function(m) {
          m.form(function(m) {
            m.a({ name: 'name' })
            m.textField('title', { value: 'A' });
            m.textField('name', { value: 'B' });
            m.checkBox('published');
            m.radioButton('color', 'red');
            m.radioButton('color', 'blue');
          });
        }
      })

      component = new Klass();
      component.mount('target');
      component.val('name', 'C');
      component.val('published', true);
      component.val('color', 'blue');
      component.refresh();

      expect(component.val('title')).to.equal('A');
      expect(component.val('name')).to.equal('C');
      expect(component.val('published')).to.equal('1');
      expect(component.val('color')).to.equal('blue');
      expect(component.val('xxx')).to.equal('');
    })

    it('should get the value of a field of named form', function() {
      var Klass, component;

      Klass = Cape.createComponentClass({
        render: function(m) {
          m.formFor('foo', function(m) {
            m.textField('title', { value: 'A' });
            m.textField('name', { value: 'B' });
          });
        }
      })

      component = new Klass();
      component.mount('target');
      component.val('foo.name', 'C');
      expect(component.val('foo.title')).to.equal('A');
      expect(component.val('foo.name')).to.equal('C');
      expect(component.val('foo.xxx')).to.equal('');
      expect(component.val('bar.name')).to.equal('');
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

  describe('setValues', function() {
    it('should set the values of form fields', function() {
      var Klass, component;

      Klass = Cape.createComponentClass({
        render: function(m) {
          m.formFor('book', function(m) {
            m.textField('title');
            m.textField('author');
          });
        }
      })

      component = new Klass();
      component.mount('target');
      component.setValues('book', { title: 'A', author: 'B' });
      component.refresh();
      expect(component.val('book.title')).to.equal('A');
      expect(component.val('book.author')).to.equal('B');
    })

    it('should set the field values of a nested form', function() {
      var Klass, component;

      Klass = Cape.createComponentClass({
        render: function(m) {
          m.formFor('book', function(m) {
            m.textField('title');
            m.fieldsFor('author', function(m) {
              m.textField('family_name');
              m.textField('given_name');
              m.fieldsFor('tags', { index: 0 }, function(m) {
                m.textField('value');
              });
              m.fieldsFor('tags', { index: 1 }, function(m) {
                m.textField('value');
              });
            });
            m.fieldsFor('comments', { index: 0 }, function(m) {
              m.textareaField('body');
            });
            m.fieldsFor('comments', { index: 1 }, function(m) {
              m.textareaField('body');
            });
          });
        }
      })

      component = new Klass();
      component.mount('target');
      component.setValues('book', {
        title: 'A',
        author: {
          family_name: 'Doe', given_name: 'John',
          tags: [ { value: 'S' }, { value: 'T' } ]
        },
        comments: [
          { body: 'X' }, { body: 'Y' }
        ]
      });
      component.refresh();
      expect(component.val('book.title')).to.equal('A');
      expect(component.val('book.author/family_name')).to.equal('Doe');
      expect(component.val('book.author/tags/0/value')).to.equal('S');
      expect(component.val('book.comments/1/body')).to.equal('Y');
    })
  })

  describe('formData', function() {
    it('should return an object that contains parameters', function() {
      var Klass, component, params;

      Klass = Cape.createComponentClass({
        render: function(m) {
          m.form(function(m) {
            m.textField('title', { value: 'A' });
            m.textField('name', { value: 'B' });
            m.checkBox('published', { checked: true });
            m.checkBox('deleted');
            m.fieldsFor('email', { index: 1 }, function(m) {
              m.textField('address', { value: 'foo@example.com' });
              m.checkBox('main');
            })
          });
        }
      })

      component = new Klass();
      component.mount('target');
      params = component.formData();

      expect(params.title).to.equal('A');
      expect(params.name).to.equal('B');
      expect(params.published).to.equal('1');
      expect(params.deleted).to.equal('0');
      expect(params.email['1'].address).to.equal('foo@example.com');
      expect(params.email['1'].main).to.equal('0');
    })

    it('should return an object that contains parameters for a named form', function() {
      var Klass, component, params;

      Klass = Cape.createComponentClass({
        render: function(m) {
          m.formFor('article', function(m) {
            m.textField('title', { value: 'A' });
            m.textField('name', { value: 'B' });
          });
        }
      })

      component = new Klass();
      component.mount('target');
      params = component.formData('article');

      expect(params.title).to.equal('A');
      expect(params.name).to.equal('B');
    })
  })
})
