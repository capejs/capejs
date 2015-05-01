var isNode = typeof module !== 'undefined' && module.exports !== undefined;

describe('MarkupBuilder', function() {
  before(function() {
    var div = document.createElement('div');
    div.id = "target";
    document.body.appendChild(div);
  })

  after(function() {
    var element = document.getElementById('target');
    document.body.removeChild(element);
  })

  describe('attr', function() {
    it('should set attribute of next element', function() {
      var target, c, p;

      var C = Cape.createComponentClass({
        render: function(m) {
          m.attr('title', 'x').attr('id', 'y')
            .p('One', { id: 'z' })
            .p('Two') }
      });

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

      var C = Cape.createComponentClass({
        render: function(m) {
          m.attr({ title: 'x', id: 'y' }).attr({ title: 'xx' })
            .p('One', { id: 'z' })
            .p('Two') }
      });

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

      var C = Cape.createComponentClass({
        render: function(m) {
          m.class('foo').class('bar')
            .p('One', { class: 'baz foo' })
            .p('Two', { class: { foo: true, bar: false } })
        }
      });

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

      var C = Cape.createComponentClass({
        render: function(m) {
          m.class({ foo: true, bar: true }).class({ active: false })
            .p('One', { class: 'baz foo' })
            .p('Two', { class: { foo: true, bar: false } })
        }
      });

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

        var C = Cape.createComponentClass({
          render: function(m) {
            m.data('title', 'x').data('name', 'y')
              .p('One', { data: { name: 'z' } })
              .p('Two') }
        });

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

        var C = Cape.createComponentClass({
          render: function(m) {
            m.data({ title: 'x', name: 'y' })
              .data({ title: 'xx' })
              .p('One', { data: { name: 'z' } })
              .p('Two') }
        });

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

  describe('fa', function() {
    it('should add a font-awesome icon', function() {
      var target, c, i;

      var C = Cape.createComponentClass({
        render: function(m) { m.fa('beer') }
      });

      c = new C();
      c.mount('target');

      target = document.getElementById('target');
      i = target.getElementsByTagName('i')[0];
      expect(i.className).to.equal('fa fa-beer');

      c.unmount();
    })
  })

  describe('formFor', function() {
    it('should create form with appropriate id attribute', function() {
      var target, form, c, e;

      var C = Cape.createComponentClass({
        render: function(m) {
          m.formFor('', function(m) {
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
      });

      c = new C();
      c.mount('target');

      target = document.getElementById('target');

      form = target.getElementsByTagName('form')[0];
      e = form.getElementsByTagName('label')[0];
      expect(e.htmlFor).to.equal('field-name');
      e = form.getElementsByTagName('input')[0];
      expect(e.id).to.equal('field-name');
      e = form.getElementsByTagName('textarea')[0];
      expect(e.id).to.equal('field-remarks');
      e = form.getElementsByTagName('select')[0];
      expect(e.id).to.equal('field-color');
      e = form.getElementsByTagName('input')[1];
      expect(e.id).to.equal('field-size-l');
      e = form.getElementsByTagName('input')[3];
      expect(e.type).to.equal('hidden');
      expect(e.id).to.equal('');
      e = form.getElementsByTagName('input')[4];
      expect(e.type).to.equal('checkbox');
      expect(e.id).to.equal('field-confirm');
      e = form.getElementsByTagName('label')[6];
      expect(e.htmlFor).to.equal('field-variants-1-variant-name');
      e = form.getElementsByTagName('input')[5];
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
  })

  describe('checkBox', function() {
    it('should not set the id attribute of hidden field', function() {
      var target, form, c, e;

      var C = Cape.createComponentClass({
        render: function(m) {
          m.formFor('', function(m) {
            m.checkBox('name');
          })
        }
      })
      c = new C();
      c.mount('target');

      target = document.getElementById('target');

      form = target.getElementsByTagName('form')[0];
      e = form.getElementsByTagName('input')[0];
      expect(e.id).to.equal('');
    })
  })
})
