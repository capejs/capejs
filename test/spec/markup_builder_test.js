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
      expect(p[0].getAttribute('title')).to.be('x')
      expect(p[0].getAttribute('id')).to.be('z')
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
      expect(p[0].className).to.be('foo bar baz')
      expect(p[1].className).to.be('foo')

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
        expect(p[0].getAttribute('data-title')).to.be('x')
        expect(p[0].getAttribute('data-name')).to.be('z')
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
      expect(i.className).to.be('fa fa-beer');

      c.unmount();
    })
  })

  describe('form', function() {
    it('should create form with appropriate id attribute', function() {
      var target, form, c, e;

      var C = Cape.createComponentClass({
        render: function(m) {
          m.form(function(m) {
            m.labelOf('name', 'Name').sp().textField('name').br();
            m.labelOf('remarks', 'Remarks').sp().textareaField('remarks').br();
            m.labelOf('color', 'Color').sp();
            m.selectBox('color', function(m) {
              m.option('White', { value: 'white'} );
              m.option('Black', { value: 'black'} );
            }).br();
            m.radioButton('size', 'l').sp().labelOf('gender-l', 'L').sp();
            m.radioButton('size', 'm').sp().labelOf('gender-m', 'M').sp();
            m.checkBox('confirm').sp().labelOf('confirm', 'OK').sp();
            [1, 2].forEach(function(i) {
              m.fieldsFor('variants', { index: i }, function(m) {
                m.labelOf('variant_name', 'Name').sp().textField('variant_name').br();
                m.labelOf('remarks', 'Remarks').sp().textareaField('remarks').br();
                m.labelOf('color', 'Color').sp();
                m.selectBox('color', function(m) {
                  m.option('White', { value: 'white'} );
                  m.option('Black', { value: 'black'} );
                }).br();
              })
            })
          })
          m.form({ name: 'product' }, function(m) {
            m.labelOf('name', 'Name').sp().textField('name').br();
            m.labelOf('remarks', 'Remarks').sp().textareaField('remarks').br();
            m.labelOf('color', 'Color').sp();
            m.selectBox('color', function(m) {
              m.option('White', { value: 'white'} );
              m.option('Black', { value: 'black'} );
            }).br();
            m.radioButton('size', 'l').sp().labelOf('gender-l', 'L').sp();
            m.radioButton('size', 'm').sp().labelOf('gender-m', 'M').sp();
            m.checkBox('confirm').sp().labelOf('confirm', 'OK').sp();
            [1, 2].forEach(function(i) {
              m.fieldsFor('variants', { index: i }, function(m) {
                m.labelOf('variant_name', 'Name').sp().textField('variant_name').br();
                m.labelOf('remarks', 'Remarks').sp().textareaField('remarks').br();
                m.labelOf('color', 'Color').sp();
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
      expect(e.htmlFor).to.be('field-name');
      e = form.getElementsByTagName('input')[0];
      expect(e.id).to.be('field-name');
      e = form.getElementsByTagName('textarea')[0];
      expect(e.id).to.be('field-remarks');
      e = form.getElementsByTagName('select')[0];
      expect(e.id).to.be('field-color');
      e = form.getElementsByTagName('input')[1];
      expect(e.id).to.be('field-size-l');
      e = form.getElementsByTagName('input')[3];
      expect(e.id).to.be('field-confirm');
      e = form.getElementsByTagName('label')[6];
      expect(e.htmlFor).to.be('field-variants-1-variant-name');
      e = form.getElementsByTagName('input')[5];
      expect(e.id).to.be('field-variants-1-variant-name');
      e = form.getElementsByTagName('textarea')[1];
      expect(e.id).to.be('field-variants-1-remarks');
      e = form.getElementsByTagName('select')[1];
      expect(e.id).to.be('field-variants-1-color');

      form = target.getElementsByTagName('form')[1];
      e = form.getElementsByTagName('label')[0];
      expect(e.htmlFor).to.be('product-field-name');
      e = form.getElementsByTagName('input')[0];
      expect(e.id).to.be('product-field-name');
      e = form.getElementsByTagName('textarea')[0];
      expect(e.id).to.be('product-field-remarks');
      e = form.getElementsByTagName('select')[0];
      expect(e.id).to.be('product-field-color');
      e = form.getElementsByTagName('input')[1];
      expect(e.id).to.be('product-field-size-l');
      e = form.getElementsByTagName('input')[3];
      expect(e.id).to.be('product-field-confirm');
      e = form.getElementsByTagName('label')[6];
      expect(e.htmlFor).to.be('product-field-variants-1-variant-name');
      e = form.getElementsByTagName('textarea')[1];
      expect(e.id).to.be('product-field-variants-1-remarks');
      e = form.getElementsByTagName('select')[1];
      expect(e.id).to.be('product-field-variants-1-color');

      c.unmount();
    })
  })
})
