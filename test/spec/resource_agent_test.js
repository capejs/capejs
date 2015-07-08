describe('ResourceAgent', function() {
  describe('#resourceName, #collectionPath, #memberPath', function() {
    it('should return standard values', function() {
      var UserAgent, form, agent;

      UserAgent = function UserAgent(form) {
        Cape.ResourceAgent.apply(this, arguments);
      }
      Cape.extend(UserAgent.prototype, Cape.ResourceAgent.prototype);

      form = { id: 123 };
      agent = new UserAgent(form);

      expect(agent.resourceName()).to.equal('user');
      expect(agent.collectionPath()).to.equal('/users');
      expect(agent.memberPath()).to.equal('/users/123');
    })

    it('should add prefix to the paths', function() {
      var UserAgent, form, agent;

      UserAgent = function UserAgent(form) {
        Cape.ResourceAgent.apply(this, arguments);
      }
      Cape.extend(UserAgent.prototype, Cape.ResourceAgent.prototype);
      Cape.extend(UserAgent.prototype, {
        pathPrefix: function() {
          return '/api/'
        }
      })

      form = { id: 123 };
      agent = new UserAgent(form);

      expect(agent.resourceName()).to.equal('user');
      expect(agent.collectionPath()).to.equal('/api/users');
      expect(agent.memberPath()).to.equal('/api/users/123');
    })
  })

  describe('#init', function() {
    it('should go through a fetch api chain', function() {
      var UserAgent, form, agent, spy1, spy2, spy3;

      UserAgent = function UserAgent(form) {
        Cape.ResourceAgent.apply(this, arguments);
      }
      Cape.extend(UserAgent.prototype, Cape.ResourceAgent.prototype);

      form = { id: 123 };
      agent = new UserAgent(form);

      spy1 = sinon.spy()
      spy2 = sinon.spy()
      spy3 = sinon.spy()
      sinon.stub(global, 'fetch', function(path, options) {
        return {
          then: function(callback1) {
            callback1.call(this, { json: spy1 })
            return {
              then: function(callback2) {
                callback2.call(this, { user: {} })
                return {
                  catch: spy2
                }
              }
            }
          }
        }
      });

      agent.init(spy3);
      expect(spy1.called).to.be.true;
      expect(spy2.called).to.be.true;
      expect(spy3.called).to.be.true;

      global.fetch.restore();
    })

    it('should never call a fetch api', function() {
      var UserAgent, form, agent;

      UserAgent = function UserAgent(form) {
        Cape.ResourceAgent.apply(this, arguments);
      }
      Cape.extend(UserAgent.prototype, Cape.ResourceAgent.prototype);

      form = { id: undefined };
      agent = new UserAgent(form);

      sinon.stub(global, 'fetch');

      agent.init(function() {});
      expect(global.fetch.called).to.be.false;

      global.fetch.restore();
    })
  })

  describe('#create', function() {
    it('should go through a fetch api chain', function() {
      var UserAgent, form, agent, spy1, spy2, spy3;

      UserAgent = function UserAgent(form) {
        Cape.ResourceAgent.apply(this, arguments);
      }
      Cape.extend(UserAgent.prototype, Cape.ResourceAgent.prototype);

      form = { id: 123, paramsFor: function() { return {} } };
      agent = new UserAgent(form);

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
                  catch: spy2
                }
              }
            }
          }
        }
      });

      agent.create(spy3);
      expect(spy1.called).to.be.true;
      expect(spy2.called).to.be.true;
      expect(spy3.called).to.be.true;

      global.fetch.restore();
    })
  })

  describe('#update', function() {
    it('should go through a fetch api chain', function() {
      var UserAgent, form, agent, spy1, spy2, spy3;

      UserAgent = function UserAgent(form) {
        Cape.ResourceAgent.apply(this, arguments);
      }
      Cape.extend(UserAgent.prototype, Cape.ResourceAgent.prototype);

      form = { id: 123, paramsFor: function() { return {} } };
      agent = new UserAgent(form);

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
                  catch: spy2
                }
              }
            }
          }
        }
      });

      agent.update(spy3);
      expect(spy1.called).to.be.true;
      expect(spy2.called).to.be.true;
      expect(spy3.called).to.be.true;

      global.fetch.restore();
    })
  })

  describe('#destroy', function() {
    it('should go through a fetch api chain', function() {
      var UserAgent, form, agent, spy1, spy2, spy3;

      UserAgent = function UserAgent(form) {
        Cape.ResourceAgent.apply(this, arguments);
      }
      Cape.extend(UserAgent.prototype, Cape.ResourceAgent.prototype);

      form = { id: 123 };
      agent = new UserAgent(form);

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
                  catch: spy2
                }
              }
            }
          }
        }
      });

      agent.destroy(spy3);
      expect(spy1.called).to.be.true;
      expect(spy2.called).to.be.true;
      expect(spy3.called).to.be.true;

      global.fetch.restore();
    })
  })
})
