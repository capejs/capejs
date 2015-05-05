describe('DataStore', function() {
  describe('constructor', function() {
    it('should call "this.init()" if defined', function() {
      var Klass, method;

      method = sinon.spy();
      Klass = Cape.createDataStoreClass({
        init: method
      })

      new Klass();
      expect(method.called).to.be.true;
    })
  })

  describe('.create', function() {
    it('should always return the singleton object', function() {
      var Klass, object1, object2;

      Klass = Cape.createDataStoreClass({})

      object1 = Klass.create();
      object2 = Klass.create();
      expect(object1).to.equal(object2);
    })
  })

  describe('attach', function() {
    it('should register the given object as a target of propagation', function() {
      var Klass, component, ds;

      Klass = Cape.createDataStoreClass({});
      component = { refresh: sinon.spy() }

      ds = new Klass();
      ds.attach(component);
      ds.propagate();
      expect(component.refresh.called).to.be.true;
    })

    it('should not register the same object twice', function() {
      var Klass, component, ds;

      Klass = Cape.createDataStoreClass({});
      component = { refresh: sinon.spy() }

      ds = new Klass();
      ds.attach(component);
      ds.attach(component);
      expect(ds._.components.length).to.eq(1);
    })
  })

  describe('detach', function() {
    it('should unregister the given object as a target of propagation', function() {
      var Klass, component, ds;

      Klass = Cape.createDataStoreClass({});
      component = { refresh: sinon.spy() }

      ds = new Klass();
      ds.attach(component);
      ds.detach(component);
      ds.propagate();
      expect(component.refresh.called).not.to.be.true;
    })
  })
})
