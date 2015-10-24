'use strict';

var isNode = typeof module !== 'undefined' && module.exports !== undefined;

describe('VirtualForms', function() {
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
        init: function() {
          this.setValues('', { title: 'A', confirmed: true, genre: 'H' });
          this.refresh();
        },

        render: function(m) {
          m.form(function(m) {
            m.a({ name: 'name' })
            m.textField('title');
            m.textField('name', { value: 'B' });
            m.textField('ghost', { disabled: true, value: 'X' });
            m.textareaField('comment', { value: 'X' });
            m.checkBox('confirmed');
            m.checkBox('published');
            m.radioButton('color', 'red');
            m.radioButton('color', 'blue');
            m.radioButton('genre', 'G');
            m.radioButton('genre', 'H');
            m.hiddenField('uid', { value: '' });
          });
        }
      })

      component = new Klass();
      component.mount('target');
      expect(component.val('confirmed')).to.equal('1');
      component.val('name', 'C');
      component.val('published', true);
      component.val('color', 'blue');
      component.val('uid', '1000');
      component.refresh();

      expect(component.val('title')).to.equal('A');
      expect(component.val('name')).to.equal('C');
      expect(component.val('ghost')).to.equal('');
      expect(component.val('comment')).to.equal('X');
      expect(component.val('confirmed')).to.equal('1');
      expect(component.val('published')).to.equal('1');
      expect(component.val('color')).to.equal('blue');
      expect(component.val('genre')).to.equal('H');
      expect(component.val('uid')).to.equal('1000');
      expect(component.val('xxx')).to.equal('');
    })

    it('should toggle check boxes whose name end with []', function() {
      var Klass, component, elem;

      Klass = Cape.createComponentClass({
        init: function() {
          this.setValues('', { 'types[]': [ 'a', 'b' ] });
          this.refresh();
        },

        render: function(m) {
          m.form(function(m) {
            m.checkBox('types[]', { value: 'a', id: 'type_a' } );
            m.checkBox('types[]', { value: 'b' } );
            m.checkBox('types[]', { value: 'c' } );
            m.checkBox('tags[]', { value: 'x', id: 'tag_x' } );
            m.checkBox('tags[]', { value: 'y' } );
            m.checkBox('tags[]', { value: 'z' } );
          });
        }
      })

      component = new Klass();
      component.mount('target');

      elem = document.getElementById('type_a');
      expect(elem.checked).to.be.true;

      expect(component.val('types[]').length).to.equal(2);
      expect(component.val('tags[]').length).to.equal(0);

      component.val('types[]', [ 'a', 'c' ]);
      elem = document.getElementById('tag_x');
      elem.checked = true;

      component.refresh();
      elem = document.getElementById('tag_x');
      expect(elem.checked).to.be.true;
      expect(component.val('types[]').length).to.equal(2);
      expect(component.val('types[]')[1]).to.equal('c');
      expect(component.val('tags[]').length).to.equal(1);
      expect(component.val('tags[]')[0]).to.equal('x');
    })

    it('should get the value of a select field', function() {
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

  describe('checkedOn', function() {
    it('should get the value of a check field', function() {
      var Klass, component;

      Klass = Cape.createComponentClass({
        render: function(m) {
          m.form(function(m) {
            m.textField('name');
            m.textareaField('comment', { value: 'X' });
            m.checkBox('confirmed');
            m.checkBox('published');
            m.radioButton('color', 'red');
            m.radioButton('color', 'blue');
          });
          m.formFor('f2', function(m) {
            m.checkBox('confirmed');
          })
        }
      })

      component = new Klass();
      component.mount('target');
      expect(component.checkedOn('confirmed')).to.be.false;

      component.val('published', true);
      component.val('color', 'blue');
      component.val('f2.confirmed', true);
      component.refresh();

      expect(component.checkedOn('name')).to.be.undefined;
      expect(component.checkedOn('comment')).to.be.undefined;
      expect(component.checkedOn('confirmed')).to.be.false;
      expect(component.checkedOn('f2.confirmed')).to.be.true;
      expect(component.checkedOn('published')).to.be.true;
      expect(component.checkedOn('color')).to.be.undefined;
      expect(component.checkedOn('xxx')).to.be.undefined;
    })
  })
})
