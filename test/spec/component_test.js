'use strict';

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
})
