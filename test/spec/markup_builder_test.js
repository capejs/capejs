'use strict';

var isNode = typeof module !== 'undefined' && module.exports !== undefined;

describe('MarkupBuilder', function() {
  beforeEach(function() {
    var div = document.createElement('div');
    div.id = "target";
    document.body.appendChild(div);
  })

  afterEach(function() {
    var element = document.getElementById('target');
    document.body.removeChild(element);
  })

  describe('attr', function() {
    it('should set attribute of next element', function() {
      var target, c, p;

      class C extends Cape.Component {
        render(m) {
          m.attr('title', 'x').attr('id', 'y')
            .p('One', { id: 'z' })
            .p('Two') }
      };

      c = new C();
      c.mount('target');

      target = document.getElementById('target');
      p = target.getElementsByTagName('p');
      expect(p[0].getAttribute('title')).to.equal('x')
      expect(p[0].getAttribute('id')).to.equal('z')
      expect(p[1].getAttribute('title')).to.null

      c.unmount();
    })

    it('should take a hash object', function() {
      var target, c, p;

      class C extends Cape.Component {
        render(m) {
          m.attr({ title: 'x', id: 'y' }).attr({ title: 'xx' })
            .p('One', { id: 'z' })
            .p('Two') }
      };

      c = new C();
      c.mount('target');

      target = document.getElementById('target');
      p = target.getElementsByTagName('p');
      expect(p[0].getAttribute('title')).to.equal('xx')
      expect(p[0].getAttribute('id')).to.equal('z')
      expect(p[1].getAttribute('title')).to.null

      c.unmount();
    })
  })

  describe('class', function() {
    it('should set attribute of next element', function() {
      var target, c, p;

      class C extends Cape.Component {
        render(m) {
          m.class('foo').class('bar')
            .p('One', { class: 'baz foo' })
            .p('Two', { class: { foo: true, bar: false } })
        }
      };

      c = new C();
      c.mount('target');

      target = document.getElementById('target');
      p = target.getElementsByTagName('p');
      expect(p[0].className).to.equal('foo bar baz')
      expect(p[1].className).to.equal('foo')

      c.unmount();
    })

    it('should take a hash', function() {
      var target, c, p;

      class C extends Cape.Component {
        render(m) {
          m.class({ foo: true, bar: true }).class({ active: false })
            .p('One', { class: 'baz foo' })
            .p('Two', { class: { foo: true, bar: false } })
        }
      };

      c = new C();
      c.mount('target');

      target = document.getElementById('target');
      p = target.getElementsByTagName('p');
      expect(p[0].className).to.equal('foo bar baz')
      expect(p[1].className).to.equal('foo')

      c.unmount();
    })
  })

  describe('data', function() {
    // jsdom does not support data-* attributes.
    // See https://github.com/tmpvar/jsdom/issues/961
    if (!isNode) {
      it('should set data-* attribute of next element', function() {
        var target, c, p;

        class C extends Cape.Component {
          render(m) {
            m.data('title', 'x').data('name', 'y')
              .p('One', { data: { name: 'z' } })
              .p('Two') }
        };

        c = new C();
        c.mount('target');

        target = document.getElementById('target');
        p = target.getElementsByTagName('p');
        expect(p[0].getAttribute('data-title')).to.equal('x')
        expect(p[0].getAttribute('data-name')).to.equal('z')
        expect(p[1].getAttribute('data-title')).to.null

        c.unmount();
      })

      it('should take a hash', function() {
        var target, c, p;

        class C extends Cape.Component {
          render(m) {
            m.data({ title: 'x', name: 'y' })
              .data({ title: 'xx' })
              .p('One', { data: { name: 'z' } })
              .p('Two') }
        };

        c = new C();
        c.mount('target');

        target = document.getElementById('target');
        p = target.getElementsByTagName('p');
        expect(p[0].getAttribute('data-title')).to.equal('xx')
        expect(p[0].getAttribute('data-name')).to.equal('z')
        expect(p[1].getAttribute('data-title')).to.null

        c.unmount();
      })
    }
  })

  describe('css', function() {
    it('should set attribute of next element', function() {
      var target, c, p;

      class C extends Cape.Component {
        render(m) {
          m.css('color', 'red').css('font-size', '90%')
            .p('One', { style: { fontWeight: 'bold' } })
            .p('Two', { style: { color: 'blue', fontWeight: 'bold'  } })
        }
      };

      c = new C();
      c.mount('target');

      target = document.getElementById('target');
      p = target.getElementsByTagName('p');
      expect(p[0].style.color).to.equal('red')
      expect(p[1].style.color).to.equal('blue')

      c.unmount();
    })

    it('should take a hash', function() {
      var target, c, p;

      class C extends Cape.Component {
        render(m) {
          m.css({ color: 'red' }).css({ fontSize: '90%' })
            .p('One', { style: { fontWeight: 'bold' } })
            .p('Two', { style: { color: 'blue', fontWeight: 'bold'  } })
        }
      };

      c = new C();
      c.mount('target');

      target = document.getElementById('target');
      p = target.getElementsByTagName('p');
      expect(p[0].style.color).to.equal('red')
      expect(p[1].style.color).to.equal('blue')

      c.unmount();
    })
  })

  describe('on', function() {
    it('should set event handler of next element', function() {
      var target, c, span;

      class C extends Cape.Component {
        init() {
          this.counter = 0;
          this.refresh();
        }

        render(m) {
          m.on('click', function(e) { this.counter++ });
          m.on('dblclick', function(e) { this.counter++ });
          m.span('Click me');
        }
      }

      c = new C();
      c.mount('target');

      target = document.getElementById('target');
      span = target.getElementsByTagName('span')[0];
      expect(typeof span.onclick).to.equal('function');
      expect(typeof span.ondblclick).to.equal('function');

      span.click();
      expect(c.counter).to.equal(1);

      c.unmount();
    })

    it('should allow the event handler to be overriden', function() {
      var target, c, span;

      class C extends Cape.Component {
        init() {
          this.counter = 0;
          this.refresh();
        }

        render(m) {
          m.on('click', function(e) { this.counter++ });
          m.span('Click me', { onclick(e) { this.counter = -1 }});
        }
      }

      c = new C();
      c.mount('target');

      target = document.getElementById('target');
      span = target.getElementsByTagName('span')[0];

      span.click();
      expect(c.counter).to.equal(-1);

      c.unmount();
    })

    it('should throw an error when the first argument is not a string', function() {
      var target, c, span;

      class C extends Cape.Component {
        init() {
          this.counter = 0;
          this.refresh();
        }

        render(m) {
          m.on(0, function(e) { this.counter++ });
          m.span('Click me', { onclick(e) { this.counter = -1 }});
        }
      }

      c = new C();
      expect(function() { c.mount('target') }).to.throw(/must be a string/);
    })
  })

  describe('fa', function() {
    it('should add a font-awesome icon', function() {
      var target, c, i;

      class C extends Cape.Component {
        render(m) {
          m.fa('beer');
          m.fa('beer', { class: 'large' })
        }
      }

      c = new C();
      c.mount('target');

      target = document.getElementById('target');
      i = target.getElementsByTagName('i')[0];
      expect(i.className).to.equal('fa fa-beer');
      i = target.getElementsByTagName('i')[1];
      expect(i.className).to.equal('large fa fa-beer');

      c.unmount();
    })
  })

  describe('formFor', function() {
    it('should create form with appropriate id attribute', function() {
      var target, form, c, e;

      class C extends Cape.Component {
        render(m) {
          m.formFor('', function(m) {
            m.hiddenField('dummy');
            m.labelFor('name', 'Name').sp().textField('name').br();
            m.labelFor('password', 'Password').sp().passwordField('name').br();
            m.labelFor('remarks', 'Remarks').sp().textareaField('remarks').br();
            m.labelFor('color', 'Color').sp();
            m.selectBox('color', function(m) {
              m.option('White', { value: 'white'} );
              m.option('Black', { value: 'black'} );
            }).br();
            m.radioButton('size', 'l').sp().labelFor('gender-l', 'L').sp();
            m.radioButton('size', 'm').sp().labelFor('gender-m', 'M').sp();
            m.checkBox('confirm').sp().labelFor('confirm', 'OK').sp();
            [1, 2].forEach(function(i) {
              m.fieldsFor('variants', { index: i }, function(m) {
                m.labelFor('variant_name', 'Name').sp().textField('variant_name').br();
                m.labelFor('remarks', 'Remarks').sp().textareaField('remarks').br();
                m.labelFor('color', 'Color').sp();
                m.selectBox('color', function(m) {
                  m.option('White', { value: 'white'} );
                  m.option('Black', { value: 'black'} );
                }).br();
              })
            })
          })
          m.formFor('product', function(m) {
            m.labelFor('name', 'Name').sp().textField('name').br();
            m.labelFor('remarks', 'Remarks').sp().textareaField('remarks').br();
            m.labelFor('color', 'Color').sp();
            m.selectBox('color', function(m) {
              m.option('White', { value: 'white'} );
              m.option('Black', { value: 'black'} );
            }).br();
            m.radioButton('size', 'l').sp().labelFor('gender-l', 'L').sp();
            m.radioButton('size', 'm').sp().labelFor('gender-m', 'M').sp();
            m.checkBox('confirm').sp().labelFor('confirm', 'OK').sp();
            [1, 2].forEach(function(i) {
              m.fieldsFor('variants', { index: i }, function(m) {
                m.labelFor('variant_name', 'Name').sp().textField('variant_name').br();
                m.labelFor('remarks', 'Remarks').sp().textareaField('remarks').br();
                m.labelFor('color', 'Color').sp();
                m.selectBox('color', function(m) {
                  m.option('White', { value: 'white'} );
                  m.option('Black', { value: 'black'} );
                }).br();
              })
            })
          })
        }
      }

      c = new C();
      c.mount('target');

      target = document.getElementById('target');

      form = target.getElementsByTagName('form')[0];
      e = form.getElementsByTagName('label')[0];
      expect(e.htmlFor).to.equal('field-name');
      e = form.getElementsByTagName('input')[1];
      expect(e.id).to.equal('field-name');
      e = form.getElementsByTagName('textarea')[0];
      expect(e.id).to.equal('field-remarks');
      e = form.getElementsByTagName('select')[0];
      expect(e.id).to.equal('field-color');
      e = form.getElementsByTagName('input')[3];
      expect(e.id).to.equal('field-size-l');
      e = form.getElementsByTagName('input')[5];
      expect(e.type).to.equal('hidden');
      expect(e.id).to.equal('');
      e = form.getElementsByTagName('input')[6];
      expect(e.type).to.equal('checkbox');
      expect(e.id).to.equal('field-confirm');
      e = form.getElementsByTagName('label')[7];
      expect(e.htmlFor).to.equal('field-variants-1-variant-name');
      e = form.getElementsByTagName('input')[7];
      expect(e.id).to.equal('field-variants-1-variant-name');
      e = form.getElementsByTagName('textarea')[1];
      expect(e.id).to.equal('field-variants-1-remarks');
      e = form.getElementsByTagName('select')[1];
      expect(e.id).to.equal('field-variants-1-color');

      form = target.getElementsByTagName('form')[1];
      e = form.getElementsByTagName('label')[0];
      expect(e.htmlFor).to.equal('product-field-name');
      e = form.getElementsByTagName('input')[0];
      expect(e.id).to.equal('product-field-name');
      e = form.getElementsByTagName('textarea')[0];
      expect(e.id).to.equal('product-field-remarks');
      e = form.getElementsByTagName('select')[0];
      expect(e.id).to.equal('product-field-color');
      e = form.getElementsByTagName('input')[1];
      expect(e.id).to.equal('product-field-size-l');
      e = form.getElementsByTagName('input')[4];
      expect(e.id).to.equal('product-field-confirm');
      e = form.getElementsByTagName('label')[6];
      expect(e.htmlFor).to.equal('product-field-variants-1-variant-name');
      e = form.getElementsByTagName('textarea')[1];
      expect(e.id).to.equal('product-field-variants-1-remarks');
      e = form.getElementsByTagName('select')[1];
      expect(e.id).to.equal('product-field-variants-1-color');

      c.unmount();
    })

    it('should set onsubmit callback if not defined', function() {
      var target, form, c, e;

      class C extends Cape.Component {
        render(m) {
          m.formFor('', function(m) {
            m.textField('name')
          })
        }
      }

      c = new C();
      c.mount('target');

      target = document.getElementById('target');

      form = target.getElementsByTagName('form')[0];
      expect(typeof form.onsubmit).to.equal('function');
    })

    it('should not override onsubmit callback if defined', function() {
      var method, c, form;

      method = sinon.spy();
      class C extends Cape.Component {
        render(m) {
          m.on('submit', function(e) { method(); return false });
          m.formFor('', function(m) {
            m.textField('name');
          })
        }
      }

      c = new C();
      c.mount('target');

      var form = document.getElementById('target').getElementsByTagName('form')[0];
      form.onsubmit();

      expect(method.called).to.equal(true);
    })
  })

  describe('checkBox', function() {
    it('should not set the id attribute of hidden field', function() {
      var target, form, c, e;

      class C extends Cape.Component {
        render(m) {
          m.formFor('', function(m) {
            m.checkBox('name');
          })
        }
      }

      c = new C();
      c.mount('target');

      target = document.getElementById('target');

      form = target.getElementsByTagName('form')[0];
      e = form.getElementsByTagName('input')[0];
      expect(e.id).to.equal('');
    })

    if (!isNode) {
      it('should adopt the previously set event callbacks', function() {
        var target, form, c, callback, elem, ev;

        callback = sinon.spy()
        class C extends Cape.Component {
          render(m) {
            m.formFor('', function(m) {
              m.onchange(callback)
              m.checkBox('name');
            })
          }
        }

        c = new C();
        c.mount('target');

        target = document.getElementById('target');
        target.getElementsByTagName('input')[1].checked = true;
        elem = target.getElementsByTagName('input')[1];
        ev = new Event('change');
        elem.dispatchEvent(ev);

        expect(callback.called).to.be.true
      })
    }
  })

  describe('btn', function() {
    it('should create a <button type="button"> tag', function() {
      var target, form, c, e;

      class C extends Cape.Component {
        render(m) {
          m.formFor('', function(m) {
            m.btn('Click');
          })
        }
      }

      c = new C();
      c.mount('target');

      target = document.getElementById('target');

      form = target.getElementsByTagName('form')[0];
      e = form.getElementsByTagName('button')[0];
      expect(e.type).to.equal('button');
    })

    it('should create a <button type="submit"> tag', function() {
      var target, form, c, e;

      class C extends Cape.Component {
        render(m) {
          m.formFor('', function(m) {
            m.btn('Click', { type: 'submit' });
          })
        }
      }

      c = new C();
      c.mount('target');

      target = document.getElementById('target');

      form = target.getElementsByTagName('form')[0];
      e = form.getElementsByTagName('button')[0];
      expect(e.type).to.equal('submit');
    })
  })

  describe('text', function() {
    it('should add a text node', function() {
      var target, form, c, e;

      class C extends Cape.Component {
        render(m) {
          m.text('Hello!')
        }
      }

      c = new C();
      c.mount('target');

      target = document.getElementById('target');

      expect(target.textContent).to.equal('Hello!');
    })
  })
})
