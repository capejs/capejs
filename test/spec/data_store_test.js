'use strict'

describe('DataStore', () => {
  describe('constructor', () => {
    it('should call "this.init()" if defined', () => {
      let method = sinon.spy()
      class Klass extends Cape.DataStore {
        init() { method.call() }
      }

      new Klass()
      expect(method.called).to.be.true
    })
  })

  describe('.create', () => {
    it('should always return the singleton object', () => {
      class Klass extends Cape.DataStore {}

      let object1 = Klass.create()
      let object2 = Klass.create()
      expect(object1).to.equal(object2)
    })

    it('should create an unique object', () => {
      class Klass1 extends Cape.DataStore {}
      class Klass2 extends Cape.DataStore {}

      let object1 = Klass1.create()
      let object2 = Klass2.create()
      expect(object1).not.to.equal(object2)
    })

    it('should accept options for the constructor', () => {
      class Klass extends Cape.DataStore {}

      let object = Klass.create({ x: 1, y: 2 })
      expect(object.options.x).to.equal(1)
      expect(object.options.y).to.equal(2)
    })
  })

  describe('attach', () => {
    it('should register the given object as a target of propagation', () => {
      class Klass extends Cape.DataStore {}
      let component1 = { refresh: sinon.spy() }
      let component2 = { refresh: sinon.spy() }

      let ds = new Klass()
      ds.attach(component1)
      ds.attach(component2)
      ds.propagate()
      expect(component1.refresh.called).to.be.true
      expect(component2.refresh.called).to.be.true
    })

    it('should not register the same object twice', () => {
      class Klass extends Cape.DataStore {}
      let component = { refresh: sinon.spy() }

      let ds = new Klass()
      ds.attach(component)
      ds.attach(component)
      expect(ds._.components.length).to.eq(1)
    })
  })

  describe('detach', () => {
    it('should unregister the given object as a target of propagation', () => {
      class Klass extends Cape.DataStore {}
      let component1 = { refresh: sinon.spy() }
      let component2 = { refresh: sinon.spy() }
      let component3 = { refresh: sinon.spy() }

      let ds = new Klass()
      ds.attach(component1)
      ds.attach(component2)
      ds.attach(component3)
      ds.detach(component2)
      ds.propagate()
      expect(component1.refresh.called).to.be.true
      expect(component2.refresh.called).not.to.be.true
      expect(component3.refresh.called).to.be.true
    })
  })
})
