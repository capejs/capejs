"use strict";

describe('ResourceAgent', function() {
  describe('constructor', function() {
    it('should take resource name and its client as arguments', function() {
      var form, agent;

      form = { id: 123 };
      agent = new Cape.ResourceAgent('user', form);

      expect(agent.resourceName).to.equal('user');
      expect(agent.client).to.equal(form);
    })

    it('should take an object (options) as the third argument', function() {
      var form, options, agent;

      form = { id: 123 };
      options = { pathPrefix: '/api/' }
      agent = new Cape.ResourceAgent('user', form, options);

      expect(agent.options).to.equal(options);
    })

    it('should call agent adapter', function() {
      var form, options, agent;

      Cape.AgentAdapters.FooBarAdapter = sinon.spy();

      form = { id: 123 };
      options = { adapter: 'foo_bar' }
      new Cape.ResourceAgent('user', form, options);

      expect(Cape.AgentAdapters.FooBarAdapter.called).to.be.true;

      Cape.AgentAdapters.FooBarAdapter = undefined;
    })
  })

  describe('#collectionPath', function() {
    it('should return standard values', function() {
      var form, agent;

      form = {};
      agent = new Cape.ResourceAgent('user', form);

      expect(agent.collectionPath()).to.equal('/users');
    })

    it('should add prefix to the paths', function() {
      var form, agent;

      form = {};
      agent = new Cape.ResourceAgent('user', form, { pathPrefix: '/api/' });

      expect(agent.collectionPath()).to.equal('/api/users');
    })
  })

  describe('#memberPath', function() {
    it('should return standard values', function() {
      var form, agent;

      form = { id: 123 };
      agent = new Cape.ResourceAgent('user', form);

      expect(agent.memberPath()).to.equal('/users/123');
    })

    it('should add prefix to the paths', function() {
      var form, agent;

      form = { id: 123 };
      agent = new Cape.ResourceAgent('user', form, { pathPrefix: '/api/' });

      expect(agent.memberPath()).to.equal('/api/users/123');
    })
  })

  describe('#init', function() {
    it('should go through a fetch api chain', function() {
      var form, agent, spy1, spy2, spy3;

      form = { id: 123 };
      agent = new Cape.ResourceAgent('user', form);

      spy1 = sinon.spy();
      spy2 = sinon.spy();
      spy3 = sinon.spy();
      sinon.stub(global, 'fetch', function(path, options) {
        return {
          then: function(callback1) {
            callback1.call(this, { json: spy1 })
            return {
              then: function(callback2) {
                callback2.call(this, { user: {} })
                return {
                  catch: function(callback3) {
                    callback3.call(this, new Error(''))
                  }
                }
              }
            }
          }
        }
      });

      agent.init(spy2, spy3);
      expect(spy1.called).to.be.true;
      expect(spy2.called).to.be.true;
      expect(spy3.called).to.be.true;

      global.fetch.restore();
    })
  })

  describe('#create', function() {
    it('should go through a fetch api chain', function() {
      var form, agent, spy1, spy2, spy3;

      form = { paramsFor: function() { return {} } };
      agent = new Cape.ResourceAgent('user', form);

      spy1 = sinon.spy();
      spy2 = sinon.spy();
      spy3 = sinon.spy();
      sinon.stub(global, 'fetch', function(path, options) {
        return {
          then: function(callback1) {
            callback1.call(this, { json: spy1 })
            return {
              then: function(callback2) {
                callback2.call(this, {})
                return {
                  catch: function(callback3) {
                    callback3.call(this, new Error(''))
                  }
                }
              }
            }
          }
        }
      });

      agent.create(spy2, spy3);
      expect(spy1.called).to.be.true;
      expect(spy2.called).to.be.true;
      expect(spy3.called).to.be.true;

      global.fetch.restore();
    })
  })

  describe('#update', function() {
    it('should go through a fetch api chain', function() {
      var form, agent, spy1, spy2, spy3;

      form = { id: 123, paramsFor: function() { return {} } };
      agent = new Cape.ResourceAgent('user', form);

      spy1 = sinon.spy();
      spy2 = sinon.spy();
      spy3 = sinon.spy();
      sinon.stub(global, 'fetch', function(path, options) {
        return {
          then: function(callback1) {
            callback1.call(this, { json: spy1 })
            return {
              then: function(callback2) {
                callback2.call(this, {})
                return {
                  catch: function(callback3) {
                    callback3.call(this, new Error(''))
                  }
                }
              }
            }
          }
        }
      });

      agent.update(spy2, spy3);
      expect(spy1.called).to.be.true;
      expect(spy2.called).to.be.true;
      expect(spy3.called).to.be.true;

      global.fetch.restore();
    })
  })

  describe('#destroy', function() {
    it('should go through a fetch api chain', function() {
      var form, agent, spy1, spy2, spy3;

      form = { id: 123 };
      agent = new Cape.ResourceAgent('user', form);

      spy1 = sinon.spy();
      spy2 = sinon.spy();
      spy3 = sinon.spy();
      sinon.stub(global, 'fetch', function(path, options) {
        return {
          then: function(callback1) {
            callback1.call(this, { json: spy1 })
            return {
              then: function(callback2) {
                callback2.call(this, {})
                return {
                  catch: function(callback3) {
                    callback3.call(this, new Error(''))
                  }
                }
              }
            }
          }
        }
      });

      agent.destroy(spy2, spy3);
      expect(spy1.called).to.be.true;
      expect(spy2.called).to.be.true;
      expect(spy3.called).to.be.true;

      global.fetch.restore();
    })
  })
})
