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
      component1 = { refresh: sinon.spy() };
      component2 = { refresh: sinon.spy() };

      ds = new Klass();
      ds.attach(component1);
      ds.attach(component2);
      ds.propagate();
      expect(component1.refresh.called).to.be.true;
      expect(component2.refresh.called).to.be.true;
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
      component1 = { refresh: sinon.spy() }
      component2 = { refresh: sinon.spy() }
      component3 = { refresh: sinon.spy() }

      ds = new Klass();
      ds.attach(component1);
      ds.attach(component2);
      ds.attach(component3);
      ds.detach(component2);
      ds.propagate();
      expect(component1.refresh.called).to.be.true;
      expect(component2.refresh.called).not.to.be.true;
      expect(component3.refresh.called).to.be.true;
    })
  })
})
