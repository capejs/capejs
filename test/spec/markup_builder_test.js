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
        render: function(m) { m.attr('title', 'x').p('One').p('Two') }
      });

      c = new C();
      c.mount('target');

      target = document.getElementById('target');
      p = target.getElementsByTagName('p');
      expect(p[0].getAttribute('title')).to.be('x')
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
})
