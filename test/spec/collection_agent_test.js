'use strict';

var UserCollectionAgent = Cape.createCollectionAgentClass({
  constructor: function(client, options) {
    this.init(options);
    this.client = client;
    this.resourceName = 'users';
    this.adapter = 'foo_bar';
  }
});

describe('CollectionAgent', function() {
  describe('constructor', function() {
    it('should take an object (options) as the second argument', function() {
      var component, options, agent;

      component = {};
      options = { resourceName: 'users', basePath: '/api/' };
      agent = new Cape.CollectionAgent(component, options);

      expect(agent.resourceName).to.equal('users');
      expect(agent.basePath).to.equal('/api/');
    })
  })

  describe('#collectionPath', function() {
    it('should return standard values', function() {
      var agent;

      agent = new Cape.CollectionAgent({}, { resourceName: 'users' });

      expect(agent.collectionPath()).to.equal('/users');
    })

    it('should add prefix to the paths', function() {
      var agent;

      agent = new Cape.CollectionAgent({},
        { resourceName: 'users', basePath: '/api/' });

      expect(agent.collectionPath()).to.equal('/api/users');
    })

    it('should insert the "nestedIn" string to the paths', function() {
      var agent;

      agent = new UserCollectionAgent({},
        { basePath: '/api/', nestedIn: 'groups/123/' });

      expect(agent.collectionPath()).to.equal('/api/groups/123/users');
    })
  })

  describe('#memberPath', function() {
    it('should return standard values', function() {
      var agent;

      agent = new Cape.CollectionAgent({}, { resourceName: 'users' });

      expect(agent.memberPath(123)).to.equal('/users/123');
    })

    it('should add prefix to the path', function() {
      var agent;

      agent = new Cape.CollectionAgent({},
        { resourceName: 'users', basePath: '/api/' });

      expect(agent.memberPath(123)).to.equal('/api/users/123');
    })

    it('should add "nestedIn" string to the path', function() {
      var agent;

      agent = new Cape.CollectionAgent({},
        { resourceName: 'users', nestedIn: 'teams/9/' });

      expect(agent.memberPath(123)).to.equal('/teams/9/users/123');
    })

    it('should not add "nestedIn" string to the path', function() {
      var agent;

      agent = new Cape.CollectionAgent({},
        { resourceName: 'users', nestedIn: 'teams/9/', shallow: true });

      expect(agent.memberPath(123)).to.equal('/users/123');
    })
  })

  describe('#ajax GET', function() {
    afterEach(function() {
      global.fetch.restore();
    })

    it('should go through a fetch api chain', function() {
      var agent, spy1, spy2, spy3;

      Cape.AgentAdapters.FooBarAdapter = sinon.spy();
      agent = new Cape.CollectionAgent({}, { resourceName: 'users' });
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
    })

    it('should accept text/plain data', function() {
      var agent, spy1, spy2, spy3;

      agent = new Cape.CollectionAgent({}, { resourceName: 'users', dataType: 'text' });
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
    })
  })

  describe('#ajax POST', function() {
    afterEach(function() {
      global.fetch.restore();
    })

    it('should go through a fetch api chain', function() {
      var agent, spy1, spy2, spy3;

      agent = new Cape.CollectionAgent({}, { resourceName: 'users' });
      sinon.stub(agent, 'refresh');

      spy1 = sinon.spy();
      spy2 = sinon.spy();
      spy3 = sinon.spy();
      stubFetchAPI(spy1, '{ "result": "OK" }');

      agent.ajax('POST', '/users', { name: 'X', password: 'Y' }, spy2, spy3);
      expect(spy1.called).to.be.true;
      expect(spy2.called).to.be.true;
      expect(spy3.called).to.be.true;
      expect(agent.refresh.called).to.be.true;
      expect(agent.data.result).to.equal('OK');
    })

    it('should not call agent.refresh()', function() {
      var agent, spy1, spy2, spy3;

      agent = new Cape.CollectionAgent({},
        { resourceName: 'users', autoRefresh: false });
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
    })
  })

  describe('#refresh', function() {
    afterEach(function() {
      global.fetch.restore();
    })

    it('should go through a fetch api chain', function() {
      var component, agent, spy1;

      component = { refresh: function() {} };
      spy1 = sinon.spy();
      stubFetchAPI(spy1, { users: [ {}, {} ] });
      agent = new Cape.CollectionAgent(component, { resourceName: 'users' });
      sinon.stub(agent, 'defaultErrorHandler');
      agent.refresh();
      expect(spy1.called).to.be.true;
      expect(agent.objects.length).to.equal(2);
      expect(agent.data.users.length).to.equal(2);
    })

    it('should call paramsForRefresh() to construct the request path', function() {
      var component, agent, spy1;

      component = { refresh: function() {} };
      spy1 = stubFetchAPI(sinon.spy(), { users: [ {}, {} ], user_count: 2 });
      agent = new Cape.CollectionAgent(component, { resourceName: 'users' });
      sinon.stub(agent, 'paramsForRefresh', function() { return { page: 1 } });
      sinon.stub(agent, 'defaultErrorHandler');

      agent.refresh();

      expect(spy1.calledWith('/users?page=1')).to.be.true;
    })

    it('should call the afterRefresh()', function() {
      var agent, spy1;

      spy1 = sinon.spy();
      stubFetchAPI(spy1, { users: [ {}, {} ], user_count: 2 });
      agent = new Cape.CollectionAgent({}, { resourceName: 'users' });
      sinon.stub(agent, 'afterRefresh', function() {
        this.userCount = this.data.user_count;
      })
      sinon.stub(agent, 'defaultErrorHandler');

      agent.refresh();

      expect(spy1.called).to.be.true;
      expect(agent.objects.length).to.equal(2);
      expect(agent.data.users.length).to.equal(2);
      expect(agent.userCount).to.equal(2);
    })

    it('should call the client.refresh()', function() {
      var component, agent, spy1, spy2;

      spy1 = sinon.spy();
      spy2 = sinon.spy();
      component = { refresh: spy1 };
      stubFetchAPI(spy2, { users: [ {}, {} ], user_count: 2 });
      agent = new Cape.CollectionAgent(component, { resourceName: 'users' });
      sinon.stub(agent, 'defaultErrorHandler');

      agent.refresh();

      expect(spy1.called).to.be.true;
      expect(spy2.called).to.be.true;
    })
  })

  describe('#index', function() {
    afterEach(function() {
      global.fetch.restore();
    })

    it('should go through a fetch api chain', function() {
      var agent, spy;

      spy = sinon.spy();
      stubFetchAPI(spy);
      agent = new Cape.CollectionAgent({}, { resourceName: 'users' });
      sinon.stub(agent, 'defaultErrorHandler');
      agent.index({ page: 1, per_page: 20 });
      expect(spy.called).to.be.true;
    })
  })

  describe('#create', function() {
    afterEach(function() {
      global.fetch.restore();
    })

    it('should go through a fetch api chain', function() {
      var component, agent, spy;

      component = { refresh: function() {} };
      spy = sinon.spy();
      stubFetchAPI(spy);
      agent = new Cape.CollectionAgent(component, { resourceName: 'users' });
      sinon.stub(agent, 'defaultErrorHandler');
      agent.create({ name: 'X', password: 'Y' });
      expect(spy.called).to.be.true;
    })
  })

  describe('#update', function() {
    afterEach(function() {
      global.fetch.restore();
    })

    it('should go through a fetch api chain', function() {
      var component, agent, spy;

      component = { refresh: function() {} };
      spy = sinon.spy();
      stubFetchAPI(spy);
      agent = new Cape.CollectionAgent(component, { resourceName: 'users' });
      sinon.stub(agent, 'defaultErrorHandler');
      agent.update(1, { name: 'X', password: 'Y' });
      expect(spy.called).to.be.true;
    })
  })

  describe('#destroy', function() {
    afterEach(function() {
      global.fetch.restore();
    })

    it('should go through a fetch api chain', function() {
      var component, agent, spy;

      component = { refresh: function() {} };
      spy = sinon.spy();
      stubFetchAPI(spy);
      agent = new Cape.CollectionAgent(component, { resourceName: 'users' });
      sinon.stub(agent, 'defaultErrorHandler');
      agent.destroy(1);
      expect(spy.called).to.be.true;
    })
  })

  describe('#get', function() {
    it('should call this.ajax() with "GET"', function() {
      var agent = new Cape.CollectionAgent({}, { resourceName: 'users' });
      sinon.stub(agent, 'ajax');
      agent.get('suspended', null);
      expect(agent.ajax.calledWith('GET', '/users/suspended')).to.be.true;
    })
  })

  describe('#head', function() {
    it('should call this.ajax() with "HEAD"', function() {
      var agent = new Cape.CollectionAgent({}, { resourceName: 'users' });
      sinon.stub(agent, 'ajax');
      agent.head('suspended', null);
      expect(agent.ajax.calledWith('HEAD', '/users/suspended')).to.be.true;
    })
  })

  describe('#post', function() {
    it('should call this.ajax() with "POST"', function() {
      var agent = new Cape.CollectionAgent({}, { resourceName: 'users' });
      sinon.stub(agent, 'ajax');
      agent.post('tags', 1, { tags: [ 'A', 'B' ] });
      expect(agent.ajax.calledWith('POST', '/users/1/tags')).to.be.true;
    })
  })

  describe('#patch', function() {
    it('should call this.ajax() with "PATCH"', function() {
      var agent = new Cape.CollectionAgent({}, { resourceName: 'users' });
      sinon.stub(agent, 'ajax');
      agent.patch('suspend', 1, { name: 'X', password: 'Y' });
      expect(agent.ajax.calledWith('PATCH', '/users/1/suspend')).to.be.true;
    })
  })

  describe('#put', function() {
    it('should call this.ajax() with "PUT"', function() {
      var agent = new Cape.CollectionAgent({}, { resourceName: 'users' });
      sinon.stub(agent, 'ajax');
      agent.put('suspend', 1, { name: 'X', password: 'Y' });
      expect(agent.ajax.calledWith('PUT', '/users/1/suspend')).to.be.true;
    })
  })

  describe('#delete', function() {
    it('should call this.ajax() with "DELETE"', function() {
      var agent = new Cape.CollectionAgent({}, { resourceName: 'users' });
      sinon.stub(agent, 'ajax');
      agent.delete('tags', 1);
      expect(agent.ajax.calledWith('DELETE', '/users/1/tags')).to.be.true;
    })
  })
})
