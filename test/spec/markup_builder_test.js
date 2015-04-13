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
})
