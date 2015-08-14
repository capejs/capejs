'use strict';

var UserCollectionAgent = Cape.createCollectionAgentClass({
  constructor: function(options) {
    this.init(options);
    this.resourceName = 'users';
    this.adapter = 'foo_bar';
  }
});

describe('CollectionAgent', function() {
  describe('constructor', function() {
    it('should take an object (options) as the second argument', function() {
      var options, agent;

      options = { resourceName: 'users', basePath: '/api/' };
      agent = new Cape.CollectionAgent(options);

      expect(agent.resourceName).to.equal('users');
      expect(agent.basePath).to.equal('/api/');
    })
  })

  describe('.getInstance', function() {
    it('should create an instance of CollectionAgent', function() {
      var agent;

      agent = Cape.CollectionAgent.getInstance({ resourceName: 'users' });

      expect(agent.resourceName).to.equal('users');
    })

    it('should return an existing instance of CollectionAgent', function() {
      var agent1, agent2;

      agent1 = Cape.CollectionAgent.getInstance({ resourceName: 'users' });
      agent2 = Cape.CollectionAgent.getInstance({ resourceName: 'users' });

      expect(agent1).to.equal(agent2);
    })

    it('should hold different instances by resource name', function() {
      var agent1, agent2;

      agent1 = Cape.CollectionAgent.getInstance({ resourceName: 'users' });
      agent2 = Cape.CollectionAgent.getInstance({ resourceName: 'groups' });

      expect(agent1).not.to.equal(agent2);
    })

    it('should hold different instances by basePath option', function() {
      var agent1, agent2;

      agent1 = Cape.CollectionAgent.getInstance(
        { resourceName: 'users', basePath: '/foo/' });
      agent2 = Cape.CollectionAgent.getInstance(
        { resourceName: 'users', basePath: '/bar/' });

      expect(agent1).not.to.equal(agent2);
    })

    it('should return an existing instance of UserCollectionAgent', function() {
      var agent1, agent2;

      agent1 = UserCollectionAgent.getInstance();
      agent2 = UserCollectionAgent.getInstance();

      expect(agent1).to.equal(agent2);
    })

    it('should return difference instances of UserCollectionAgent', function() {
      var agent1, agent2;

      agent1 = UserCollectionAgent.getInstance(
        { basePath: '/foo/', nestedIn: 'groups/123' });
      agent2 = UserCollectionAgent.getInstance(
        { basePath: '/foo/', nestedIn: 'groups/456' });

      expect(agent1).not.to.equal(agent2);
      expect(agent1.basePath).to.equal('/foo/');
      expect(agent2.basePath).to.equal('/foo/');
      expect(agent1.nestedIn).to.equal('groups/123');
      expect(agent2.nestedIn).to.equal('groups/456');
    })
  })

  describe('attach', function() {
    it('should register the given object as a target of propagation', function() {
      var agent, component1, component2;

      agent = new Cape.CollectionAgent({ resourceName: 'users' });

      component1 = { refresh: sinon.spy() };
      component2 = { refresh: sinon.spy() };

      agent.attach(component1);
      agent.attach(component2);
      agent.propagate();
      expect(component1.refresh.called).to.be.true;
      expect(component2.refresh.called).to.be.true;
    })

    it('should not register the same object twice', function() {
      var Klass, agent, component;

      agent = new Cape.CollectionAgent({ resourceName: 'users' });

      component = { refresh: sinon.spy() }

      agent.attach(component);
      expect(agent._.components.length).to.eq(1);
    })
  })

  describe('detach', function() {
    it('should unregister the given object as a target of propagation', function() {
      var component1, component2, component3, agent;

      component1 = { refresh: sinon.spy() }
      component2 = { refresh: sinon.spy() }
      component3 = { refresh: sinon.spy() }

      agent = new Cape.CollectionAgent({ resourceName: 'users' });
      agent.attach(component1);
      agent.attach(component2);
      agent.attach(component3);
      agent.detach(component2);
      agent.propagate();
      expect(component1.refresh.called).to.be.true;
      expect(component2.refresh.called).not.to.be.true;
      expect(component3.refresh.called).to.be.true;
    })
  })

  describe('#collectionPath', function() {
    it('should return standard values', function() {
      var agent;

      agent = new Cape.CollectionAgent({ resourceName: 'users' });

      expect(agent.collectionPath()).to.equal('/users');
    })

    it('should add prefix to the paths', function() {
      var agent;

      agent = new Cape.CollectionAgent(
        { resourceName: 'users', basePath: '/api/' });

      expect(agent.collectionPath()).to.equal('/api/users');
    })

    it('should insert the "nestedIn" string to the paths', function() {
      var agent;

      agent = new UserCollectionAgent(
        { basePath: '/api/', nestedIn: 'groups/123/' });

      expect(agent.collectionPath()).to.equal('/api/groups/123/users');
    })
  })

  describe('#memberPath', function() {
    it('should return standard values', function() {
      var agent;

      agent = new Cape.CollectionAgent({ resourceName: 'users' });

      expect(agent.memberPath(123)).to.equal('/users/123');
    })

    it('should add prefix to the paths', function() {
      var agent;

      agent = new Cape.CollectionAgent({ resourceName: 'users', basePath: '/api/' });

      expect(agent.memberPath(123)).to.equal('/api/users/123');
    })
  })

  describe('#ajax GET', function() {
    it('should go through a fetch api chain', function() {
      var agent, spy1, spy2, spy3;

      Cape.AgentAdapters.FooBarAdapter = sinon.spy();
      agent = new Cape.CollectionAgent({ resourceName: 'users' });
      agent.adapter = 'foo_bar';
      sinon.stub(agent, 'refresh');

      spy1 = sinon.spy();
      spy2 = sinon.spy();
      spy3 = sinon.spy();
      stubFetchAPI(spy1);

      agent.ajax('GET', '/users', { page: 1, per_page: 20 }, spy2, spy3);
      expect(spy1.called).to.be.true;
      expect(spy2.called).to.be.true;
      expect(spy3.called).to.be.true;
      expect(agent.refresh.called).to.be.false;
      expect(Cape.AgentAdapters.FooBarAdapter.called).to.be.true;

      Cape.AgentAdapters.FooBarAdapter = undefined;

      global.fetch.restore();
    })

    it('should accept text/plain data', function() {
      var agent, spy1, spy2, spy3;

      agent = new Cape.CollectionAgent({ resourceName: 'users', dataType: 'text' });
      sinon.stub(agent, 'refresh');

      spy1 = sinon.spy();
      spy2 = sinon.spy();
      spy3 = sinon.spy();
      stubFetchAPI(spy1, {}, 'text');

      agent.ajax('GET', '/users', { page: 1, per_page: 20 }, spy2, spy3);
      expect(spy1.called).to.be.true;
      expect(spy2.called).to.be.true;
      expect(spy3.called).to.be.true;
      expect(agent.refresh.called).to.be.false;

      global.fetch.restore();
    })
  })

  describe('#ajax POST', function() {
    it('should go through a fetch api chain', function() {
      var agent, spy1, spy2, spy3;

      agent = new Cape.CollectionAgent({ resourceName: 'users' });
      sinon.stub(agent, 'refresh');

      spy1 = sinon.spy();
      spy2 = sinon.spy();
      spy3 = sinon.spy();
      stubFetchAPI(spy1);

      agent.ajax('POST', '/users', { name: 'X', password: 'Y' }, spy2, spy3);
      expect(spy1.called).to.be.true;
      expect(spy2.called).to.be.true;
      expect(spy3.called).to.be.true;
      expect(agent.refresh.called).to.be.true;

      global.fetch.restore();
    })

    it('should not call agent.refresh()', function() {
      var agent, spy1, spy2, spy3;

      agent = new Cape.CollectionAgent({ resourceName: 'users', autoRefresh: false });
      sinon.stub(agent, 'refresh');

      spy1 = sinon.spy();
      spy2 = sinon.spy();
      spy3 = sinon.spy();
      stubFetchAPI(spy1);

      agent.ajax('POST', '/users', { name: 'X', password: 'Y' }, spy2, spy3);
      expect(spy1.called).to.be.true;
      expect(spy2.called).to.be.true;
      expect(spy3.called).to.be.true;
      expect(agent.refresh.called).to.be.false;

      global.fetch.restore();
    })
  })

  describe('#refresh', function() {
    it('should go through a fetch api chain', function() {
      var agent, spy1;

      spy1 = sinon.spy();
      stubFetchAPI(spy1, { users: [ {}, {} ] });
      agent = new Cape.CollectionAgent({ resourceName: 'users' });
      sinon.stub(agent, 'defaultErrorHandler');
      agent.refresh();
      expect(spy1.called).to.be.true;
      expect(agent.objects.length).to.equal(2);
      global.fetch.restore();
    })
  })

  describe('#index', function() {
    it('should go through a fetch api chain', function() {
      var agent, spy;

      spy = sinon.spy();
      stubFetchAPI(spy);
      agent = new Cape.CollectionAgent({ resourceName: 'users' });
      sinon.stub(agent, 'defaultErrorHandler');
      agent.index({ page: 1, per_page: 20 });
      expect(spy.called).to.be.true;
      global.fetch.restore();
    })
  })

  describe('#show', function() {
    it('should go through a fetch api chain', function() {
      var agent, spy;

      spy = sinon.spy();
      stubFetchAPI(spy);
      agent = new Cape.CollectionAgent({ resourceName: 'users' });
      sinon.stub(agent, 'defaultErrorHandler');
      agent.show(1);
      expect(spy.called).to.be.true;
      global.fetch.restore();
    })
  })

  describe('#create', function() {
    it('should go through a fetch api chain', function() {
      var agent, spy;

      spy = sinon.spy();
      stubFetchAPI(spy);
      agent = new Cape.CollectionAgent({ resourceName: 'users' });
      sinon.stub(agent, 'defaultErrorHandler');
      agent.create({ name: 'X', password: 'Y' });
      expect(spy.called).to.be.true;
      global.fetch.restore();
    })
  })

  describe('#update', function() {
    it('should go through a fetch api chain', function() {
      var agent, spy;

      spy = sinon.spy();
      stubFetchAPI(spy);
      agent = new Cape.CollectionAgent({ resourceName: 'users' });
      sinon.stub(agent, 'defaultErrorHandler');
      agent.update(1, { name: 'X', password: 'Y' });
      expect(spy.called).to.be.true;
      global.fetch.restore();
    })
  })

  describe('#destroy', function() {
    it('should go through a fetch api chain', function() {
      var agent, spy;

      spy = sinon.spy();
      stubFetchAPI(spy);
      agent = new Cape.CollectionAgent({ resourceName: 'users' });
      sinon.stub(agent, 'defaultErrorHandler');
      agent.destroy(1);
      expect(spy.called).to.be.true;
      global.fetch.restore();
    })
  })

  describe('#get', function() {
    it('should call this.ajax() with "GET"', function() {
      var agent = new Cape.CollectionAgent({ resourceName: 'users' });
      sinon.stub(agent, 'ajax');
      agent.get('suspended', null);
      expect(agent.ajax.calledWith('GET', '/users/suspended')).to.be.true;
    })
  })

  describe('#post', function() {
    it('should call this.ajax() with "POST"', function() {
      var agent = new Cape.CollectionAgent({ resourceName: 'users' });
      sinon.stub(agent, 'ajax');
      agent.post('tags', 1, { tags: [ 'A', 'B' ] });
      expect(agent.ajax.calledWith('POST', '/users/1/tags')).to.be.true;
    })
  })

  describe('#patch', function() {
    it('should call this.ajax() with "PATCH"', function() {
      var agent = new Cape.CollectionAgent({ resourceName: 'users' });
      sinon.stub(agent, 'ajax');
      agent.patch('suspend', 1, { name: 'X', password: 'Y' });
      expect(agent.ajax.calledWith('PATCH', '/users/1/suspend')).to.be.true;
    })
  })

  describe('#put', function() {
    it('should call this.ajax() with "PUT"', function() {
      var agent = new Cape.CollectionAgent({ resourceName: 'users' });
      sinon.stub(agent, 'ajax');
      agent.put('suspend', 1, { name: 'X', password: 'Y' });
      expect(agent.ajax.calledWith('PUT', '/users/1/suspend')).to.be.true;
    })
  })

  describe('#delete', function() {
    it('should call this.ajax() with "DELETE"', function() {
      var agent = new Cape.CollectionAgent({ resourceName: 'users' });
      sinon.stub(agent, 'ajax');
      agent.delete('tags', 1);
      expect(agent.ajax.calledWith('DELETE', '/users/1/tags')).to.be.true;
    })
  })
})
