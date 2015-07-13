"use strict";

describe('ResourceCollectionAgent', function() {
  describe('constructor', function() {
    it('should take resource name and its client as arguments', function() {
      var form, agent;

      form = {};
      agent = new Cape.ResourceCollectionAgent('user', form);

      expect(agent.resourceName).to.equal('user');
      expect(agent.client).to.equal(form);
    })

    it('should take an object (options) as the third argument', function() {
      var form, options, agent;

      form = {};
      options = { pathPrefix: '/api/' }
      agent = new Cape.ResourceCollectionAgent('user', form, options);

      expect(agent.options).to.equal(options);
    })
  })

  describe('#collectionPath', function() {
    it('should return standard values', function() {
      var form, agent;

      form = {};
      agent = new Cape.ResourceCollectionAgent('user', form);

      expect(agent.collectionPath()).to.equal('/users');
    })

    it('should add prefix to the paths', function() {
      var form, agent;

      form = {};
      agent = new Cape.ResourceCollectionAgent('user', form, { pathPrefix: '/api/' });

      expect(agent.collectionPath()).to.equal('/api/users');
    })
  })

  describe('#init', function() {
    it('should go through a fetch api chain', function() {
      var form, agent, spy1, spy2, spy3, users;

      form = {};
      agent = new Cape.ResourceCollectionAgent('user', form);

      spy1 = sinon.spy();
      spy2 = sinon.spy();
      spy3 = sinon.spy();
      users = [{ id: 1 }]
      sinon.stub(global, 'fetch', function(path, options) {
        return {
          then: function(callback1) {
            callback1.call(this, { json: spy1 })
            return {
              then: function(callback2) {
                callback2.call(this, { users: users })
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

      agent.options.params = { page: 1, per_page: 10 }
      agent.init(spy2, spy3);
      expect(global.fetch.calledWith('/users?page=1&per_page=10')).to.be.true;
      expect(spy1.called).to.be.true;
      expect(spy2.called).to.be.true;
      expect(spy3.called).to.be.true;
      expect(agent.objects[0]).to.equal(users[0]);

      global.fetch.restore();
    })
  })

  describe('#create', function() {
    it('should go through a fetch api chain', function() {
      var form, agent, spy1, spy2, spy3;

      form = { id: 123, paramsFor: function() { return {} } };
      agent = new Cape.ResourceCollectionAgent('user', form);

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
})
