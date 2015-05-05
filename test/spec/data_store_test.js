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
})
