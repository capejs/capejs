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
        init: function() {
          this.setValues('', { title: 'A' });
          this.refresh();
        },

        render: function(m) {
          m.form(function(m) {
            m.a({ name: 'name' })
            m.textField('title');
            m.textField('name', { value: 'B' });
            m.textareaField('comment', { value: 'X' });
            m.checkBox('published');
            m.radioButton('color', 'red');
            m.radioButton('color', 'blue');
            m.hiddenField('uid', { value: '' });
          });
        }
      })

      component = new Klass();
      component.mount('target');
      component.val('name', 'C');
      component.val('published', true);
      component.val('color', 'blue');
      component.val('uid', '1000');
      component.refresh();

      expect(component.val('title')).to.equal('A');
      expect(component.val('name')).to.equal('C');
      expect(component.val('comment')).to.equal('X');
      expect(component.val('published')).to.equal('1');
      expect(component.val('color')).to.equal('blue');
      expect(component.val('uid')).to.equal('1000');
      expect(component.val('xxx')).to.equal('');
    })

    it('should get the value of a select field xxx', function() {
      var Klass, component;

      Klass = Cape.createComponentClass({
        render: function(m) {
          m.form(function(m) {
            m.selectBox('genre', function(m) {
              m.option('X', { value: 'x' });
              m.option('Y', { value: 'y' });
            })
            m.selectBox('type', { value: 'b' }, function(m) {
              m.option('A', { value: 'a' });
              m.option('B', { value: 'b' });
              m.option('C', { value: 'c' });
            })
          });
        }
      })

      component = new Klass();
      component.mount('target');

      // The next assertion fails on jsdom, which returns the value of first option
      // when a select element has no selected option.
      if (!isNode) expect(component.val('genre')).to.equal('');
      expect(component.val('type')).to.equal('b');

      component.val('genre', 'y');
      component.val('type', 'c');
      component.refresh();
      expect(component.val('genre')).to.equal('y');
      expect(component.val('type')).to.equal('c');
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

    it('should set a field value of a nested form', function() {
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
      component.val('book.author/family_name', 'Doe');
      component.val('book.author/tags/0/value', 'S');
      component.val('book.comments/1/body', 'Y');
      component.refresh();
      expect(component.val('book.author/family_name')).to.equal('Doe');
      expect(component.val('book.author/tags/0/value')).to.equal('S');
      expect(component.val('book.comments/1/body')).to.equal('Y');
    })

    it('should not change other forms', function() {
      var Klass, component, div, form;

      Klass = Cape.createComponentClass({
        init: function() { this.mode = 'foo'; },
        render: function(m) {
          if (this.mode === 'foo')
            m.formFor('foo', function(m) {
              m.textField('title');
              m.checkBox('published');
            });
          else
            m.formFor('bar', function(m) {
              m.textField('title');
              m.checkBox('published');
            });
        }
      })

      component = new Klass();
      component.mount('target');
      component.val('foo.title', 'X');
      component.val('foo.published', true);
      component.refresh();

      div = document.getElementById('target');
      form = div.getElementsByTagName('form')[0];
      expect(form.name).to.equal('foo');
      expect(form.getElementsByTagName('input')[0].value).to.equal('X');
      expect(form.getElementsByTagName('input')[2].checked).to.be.true;

      component.mode = 'bar';
      component.refresh();
      form = div.getElementsByTagName('form')[0];
      expect(form.name).to.equal('bar');
      expect(div.getElementsByTagName('input')[0].value).to.equal('');
      expect(form.getElementsByTagName('input')[2].checked).to.be.false;
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

    it('should return array of values when the name of checkbox has "[]" in the end', function() {
      var Klass, component, params;

      Klass = Cape.createComponentClass({
        render: function(m) {
          m.form(function(m) {
            m.checkBox('types[]', { value: 'a', checked: true });
            m.checkBox('types[]', { value: 'b', checked: true });
          });
        }
      })

      component = new Klass();
      component.mount('target');
      params = component.formData();
      expect(Array.isArray(params.types)).to.equal(true);
      expect(params.types.length).to.equal(2);
      expect(params.types[0]).to.equal('a');
      expect(params.types[1]).to.equal('b');
    })

    it('should return string when the name of checkbox does not have "[]" in the end', function() {
      var Klass, component, params;

      Klass = Cape.createComponentClass({
        render: function(m) {
          m.form(function(m) {
            m.checkBox('types', { value: 'a', checked: true });
            m.checkBox('types', { value: 'b', checked: true });
          });
        }
      })

      component = new Klass();
      component.mount('target');
      params = component.formData();
      expect(Array.isArray(params.types)).to.equal(false);
      expect(params.types).to.equal('b');
    })
  })

  describe('paramsFor', function() {
    it('should return an object that is suitable for API requests', function() {
      var Klass, component, params;

      Klass = Cape.createComponentClass({
        render: function(m) {
          m.formFor('article', function(m) {
            m.textField('title', { value: 'A' });
            m.textField('name', { value: 'B' });
            m.fieldsFor('comments', { index: 1 }, function(m) {
              m.textField('body', { value: 'C' })
            })
            m.fieldsFor('info', function(m) {
              m.textField('page_rank', { value: 'D' })
            })
          });
        }
      })

      component = new Klass();
      component.mount('target');
      params = component.paramsFor('article');

      expect(params.article.title).to.equal('A');
      expect(params.article.name).to.equal('B');
      expect(params.article.comments['1'].body).to.equal('C');
      expect(params.article.info.page_rank).to.equal('D');
    })

    it('should take "as" option to change parameter name', function() {
      var Klass, component, params;

      Klass = Cape.createComponentClass({
        render: function(m) {
          m.formFor('blog', function(m) {
            m.textField('title', { value: 'A' });
            m.textField('name', { value: 'B' });
          });
        }
      })

      component = new Klass();
      component.mount('target');
      params = component.paramsFor('blog', { as: 'article' });

      expect(params.article.title).to.equal('A');
      expect(params.article.name).to.equal('B');
    })
  })

  describe('jsonFor', function() {
    it('should return a JSON string that contains form data', function() {
      var Klass, component, json, params;

      Klass = Cape.createComponentClass({
        render: function(m) {
          m.formFor('article', function(m) {
            m.textField('title', { value: 'A' });
            m.textField('name', { value: 'B' });
            m.fieldsFor('comments', { index: 0 }, function(m) {
              m.textareaField('body', { value: 'X' });
            });
            m.fieldsFor('comments', { index: 1 }, function(m) {
              m.textareaField('body', { value: 'Y' });
            });
          });
        }
      })

      component = new Klass();
      component.mount('target');
      json = component.jsonFor('article');
      params = JSON.parse(json);

      expect(params.article.title).to.equal('A');
      expect(params.article.name).to.equal('B');
      expect(Array.isArray(params.article.comments)).to.be.true;
      expect(params.article.comments[0].body).to.equal('X');
    })
  })
})
