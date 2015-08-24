'use strict';

var UserAgent = Cape.createResourceAgentClass({
  constructor: function(client, options) {
    this.client = client;
    this.resourceName = 'user';
    this.adapter = 'foo_bar';
  }
});

describe('ResourceAgent', function() {
  describe('constructor', function() {
    it('should take its client as the first argument', function() {
      var form, agent;

      form = { id: 123 };
      agent = new Cape.ResourceAgent(form);

      expect(agent.client).to.equal(form);
    })

    it('should take an object (options) as the second argument', function() {
      var form, options, agent;

      form = { id: 123 };
      options = { resourceName: 'user', basePath: '/api/' };
      agent = new Cape.ResourceAgent(form, options);

      expect(agent.resourceName).to.equal('user');
      expect(agent.basePath).to.equal('/api/');
    })
  })

  describe('.createResourceAgentClass', function() {
    it('should create a class inheriting Cape.ResrouceAgent', function() {
      var form, agent;

      form = { id: 123 };
      agent = new UserAgent(form);

      expect(agent.client).to.equal(form);
    })
  })

  describe('#collectionPath', function() {
    it('should return standard values', function() {
      var form, options, agent;

      form = {};
      options = { resourceName: 'user' };
      agent = new Cape.ResourceAgent(form, options);

      expect(agent.collectionPath()).to.equal('/users');
    })

    it('should add prefix to the paths', function() {
      var form, options, agent;

      form = {};
      options = {
        resourceName: 'user', basePath: '/api/', nestedIn: 'companies/123/' };
      agent = new Cape.ResourceAgent(form, options);

      expect(agent.collectionPath()).to.equal('/api/companies/123/users');
    })
  })

  describe('#newPath', function() {
    it('should return standard values', function() {
      var form, options, agent;

      form = { id: undefined };
      options = { resourceName: 'user' };
      agent = new Cape.ResourceAgent(form, options);

      expect(agent.newPath()).to.equal('/users/new');
    })

    it('should add prefix to the paths', function() {
      var form, options, agent;

      form = { id: undefined };
      options = { resourceName: 'user', basePath: '/api/' };
      agent = new Cape.ResourceAgent(form, options);

      expect(agent.newPath()).to.equal('/api/users/new');
    })
  })

  describe('#memberPath', function() {
    it('should return standard values', function() {
      var form, options, agent;

      form = { id: 123 };
      options = { resourceName: 'user' };
      agent = new Cape.ResourceAgent(form, options);

      expect(agent.memberPath()).to.equal('/users/123');
    })

    it('should add prefix to the paths', function() {
      var form, options, agent;

      form = { id: 123 };
      options = { resourceName: 'user', basePath: '/api/' };
      agent = new Cape.ResourceAgent(form, options);

      expect(agent.memberPath()).to.equal('/api/users/123');
    })
  })

  describe('#singularPath', function() {
    it('should return standard values', function() {
      var form, options, agent;

      form = {};
      options = { resourceName: 'profile', singular: true };
      agent = new Cape.ResourceAgent(form, options);

      expect(agent.singularPath()).to.equal('/profile');
    })

    it('should keep resourceName as is', function() {
      var form, options, agent;

      form = {};
      options = { resourceName: 'my_settings', singular: true };
      agent = new Cape.ResourceAgent(form, options);

      expect(agent.singularPath()).to.equal('/my_settings');
    })

    it('should add prefix to the paths', function() {
      var form, options, agent;

      form = {};
      options = { resourceName: 'profile', basePath: '/api/', singular: true };
      agent = new Cape.ResourceAgent(form, options);

      expect(agent.singularPath()).to.equal('/api/profile');
    })
  })

  describe('#init', function() {
    afterEach(function() {
      global.fetch.restore();
    })

    it('should make a request to the memberPath', function() {
      var form, options, agent, spy1, spy2, spy3;

      spy1 = sinon.spy();
      spy2 = sinon.spy();
      spy3 = sinon.spy();

      Cape.AgentAdapters.FooBarAdapter = sinon.spy();
      form = { id: 123, setValues: spy2, refresh: spy3 };
      options = { resourceName: 'user' };
      agent = new Cape.ResourceAgent(form, options);
      agent.adapter = 'foo_bar';
      agent.defaultErrorHandler = function(ex) {};

      stubFetchAPI(spy1, '{ "user": { "id": 123, "name": "John" } }');

      agent.init();
      expect(agent.data.user.name).to.eq('John')
      expect(spy1.called).to.be.true;
      expect(spy2.calledWith('user', { id: 123, name: 'John' })).to.be.ok;
      expect(spy3.called).to.be.true;
      expect(global.fetch.calledWith('/users/123')).to.be.true;
      expect(Cape.AgentAdapters.FooBarAdapter.called).to.be.true;

      Cape.AgentAdapters.FooBarAdapter = undefined;
    })

    it('should make a request to the newPath', function() {
      var form, options, agent, spy1, spy2, spy3;

      spy1 = sinon.spy();
      spy2 = sinon.spy();
      spy3 = sinon.spy();

      Cape.AgentAdapters.FooBarAdapter = sinon.spy();
      form = { id: undefined, setValues: spy2, refresh: spy3 };
      options = { resourceName: 'user' };
      agent = new Cape.ResourceAgent(form, options);
      agent.adapter = 'foo_bar';
      agent.defaultErrorHandler = function(ex) {};

      stubFetchAPI(spy1, '{ "user": { "name": "" } }');

      agent.init();
      expect(agent.data.user.name).to.eq('')
      expect(spy1.called).to.be.true;
      expect(spy2.calledWith('user', { name: '' })).to.be.ok;
      expect(spy3.called).to.be.true;
      expect(global.fetch.calledWith('/users/new')).to.be.true;
      expect(Cape.AgentAdapters.FooBarAdapter.called).to.be.true;

      Cape.AgentAdapters.FooBarAdapter = undefined;
    })

    it('should go through a fetch api chain', function() {
      var form, options, agent, spy1, spy2, spy3;

      Cape.AgentAdapters.FooBarAdapter = sinon.spy();
      form = { id: 123 };
      options = { resourceName: 'user' };
      agent = new Cape.ResourceAgent(form, options);
      agent.adapter = 'foo_bar';

      spy1 = sinon.spy();
      spy2 = sinon.spy();
      spy3 = sinon.spy();
      stubFetchAPI(spy1, '{ "user": { "id": 123, "name": "John" } }');

      agent.init(spy2, spy3);
      expect(spy1.called).to.be.true;
      expect(spy2.calledWith(agent)).to.be.true;
      expect(spy3.called).to.be.true;
      expect(global.fetch.calledWith('/users/123')).to.be.true;
      expect(Cape.AgentAdapters.FooBarAdapter.called).to.be.true;

      Cape.AgentAdapters.FooBarAdapter = undefined;
    })

    it('should fetch a singular resource', function() {
      var form, options, agent, spy1, spy2, spy3;

      form = {};
      options = { resourceName: 'profile', singular: true };
      agent = new Cape.ResourceAgent(form, options);

      spy1 = sinon.spy();
      spy2 = sinon.spy();
      spy3 = sinon.spy();
      stubFetchAPI(spy1);

      agent.init(spy2, spy3);
      expect(spy1.called).to.be.true;
      expect(spy2.called).to.be.true;
      expect(spy3.called).to.be.true;
      expect(global.fetch.calledWith('/profile')).to.be.true;
    })
  })

  describe('#create', function() {
    afterEach(function() {
      global.fetch.restore();
    })

    it('should go through a fetch api chain', function() {
      var form, options, agent, spy1, spy2, spy3;

      form = { paramsFor: function() { return {} } };
      options = { resourceName: 'user' };
      agent = new Cape.ResourceAgent(form, options);

      spy1 = sinon.spy();
      spy2 = sinon.spy();
      spy3 = sinon.spy();
      stubFetchAPI(spy1);

      agent.create(spy2, spy3);
      expect(spy1.called).to.be.true;
      expect(spy2.called).to.be.true;
      expect(spy3.called).to.be.true;
      expect(global.fetch.calledWith('/users')).to.be.true;
    })

    it('should create a singular resource', function() {
      var form, options, agent, spy1, spy2, spy3;

      form = { paramsFor: function() { return {} } };
      options = { resourceName: 'profile', singular: true };
      agent = new Cape.ResourceAgent(form, options);

      spy1 = sinon.spy();
      spy2 = sinon.spy();
      spy3 = sinon.spy();
      stubFetchAPI(spy1);

      agent.create(spy2, spy3);
      expect(spy1.called).to.be.true;
      expect(spy2.called).to.be.true;
      expect(spy3.called).to.be.true;
      expect(global.fetch.calledWith('/profile')).to.be.true;
    })
  })

  describe('#update', function() {
    afterEach(function() {
      global.fetch.restore();
    })

    it('should go through a fetch api chain', function() {
      var form, options, agent, spy1, spy2, spy3;

      form = { id: 123, paramsFor: function() { return {} } };
      options = { resourceName: 'user' };
      agent = new Cape.ResourceAgent(form, options);

      spy1 = sinon.spy();
      spy2 = sinon.spy();
      spy3 = sinon.spy();
      stubFetchAPI(spy1, '{ "result": "OK" }');

      agent.update(spy2, spy3);
      expect(spy1.called).to.be.true;
      expect(spy2.called).to.be.true;
      expect(spy3.called).to.be.true;
      expect(global.fetch.calledWith('/users/123')).to.be.true;
      expect(agent.data.result).to.equal('OK');
    })

    it('should update a singular resource', function() {
      var form, options, agent, spy1, spy2, spy3;

      form = { paramsFor: function() { return {} } };
      options = { resourceName: 'profile', singular: true };
      agent = new Cape.ResourceAgent(form, options);

      spy1 = sinon.spy();
      spy2 = sinon.spy();
      spy3 = sinon.spy();
      stubFetchAPI(spy1);

      agent.update(spy2, spy3);
      expect(spy1.called).to.be.true;
      expect(spy2.called).to.be.true;
      expect(spy3.called).to.be.true;
      expect(global.fetch.calledWith('/profile')).to.be.true;
    })
  })

  describe('#destroy', function() {
    afterEach(function() {
      global.fetch.restore();
    })

    it('should go through a fetch api chain', function() {
      var form, options, agent, spy1, spy2, spy3;

      form = { id: 123 };
      options = { resourceName: 'user' };
      agent = new Cape.ResourceAgent(form, options);

      spy1 = sinon.spy();
      spy2 = sinon.spy();
      spy3 = sinon.spy();
      stubFetchAPI(spy1);

      agent.destroy(spy2, spy3);
      expect(spy1.called).to.be.true;
      expect(spy2.called).to.be.true;
      expect(spy3.called).to.be.true;
      expect(global.fetch.calledWith('/users/123')).to.be.true;
    })

    it('should destroy a singular resource', function() {
      var form, options, agent, spy1, spy2, spy3;

      form = { paramsFor: function() { return {} } };
      options = { resourceName: 'profile', singular: true };
      agent = new Cape.ResourceAgent(form, options);

      spy1 = sinon.spy();
      spy2 = sinon.spy();
      spy3 = sinon.spy();
      stubFetchAPI(spy1);

      agent.destroy(spy2, spy3);
      expect(spy1.called).to.be.true;
      expect(spy2.called).to.be.true;
      expect(spy3.called).to.be.true;
      expect(global.fetch.calledWith('/profile')).to.be.true;
    })
  })

  describe('#get', function() {
    it('should call this.ajax() with "GET"', function() {
      var agent = new Cape.ResourceAgent({}, { resourceName: 'user' });
      sinon.stub(agent, 'ajax');
      agent.get('suspended');
      expect(agent.ajax.calledWith('GET', '/users/suspended')).to.be.true;
    })
  })

  describe('#head', function() {
    it('should call this.ajax() with "HEAD"', function() {
      var agent = new Cape.ResourceAgent({}, { resourceName: 'user' });
      sinon.stub(agent, 'ajax');
      agent.head('suspended');
      expect(agent.ajax.calledWith('HEAD', '/users/suspended')).to.be.true;
    })
  })

  describe('#post', function() {
    it('should call this.ajax() with "POST"', function() {
      var agent = new Cape.ResourceAgent({ id: 1 }, { resourceName: 'user' });
      sinon.stub(agent, 'ajax');
      agent.post('tags', { tags: [ 'A', 'B' ] });
      expect(agent.ajax.calledWith('POST', '/users/1/tags')).to.be.true;
    })
  })

  describe('#patch', function() {
    it('should call this.ajax() with "PATCH"', function() {
      var agent = new Cape.ResourceAgent({ id: 1 }, { resourceName: 'user' });
      sinon.stub(agent, 'ajax');
      agent.patch('suspend', { name: 'X', password: 'Y' });
      expect(agent.ajax.calledWith('PATCH', '/users/1/suspend')).to.be.true;
    })
  })

  describe('#put', function() {
    it('should call this.ajax() with "PUT"', function() {
      var agent = new Cape.ResourceAgent({ id: 1 }, { resourceName: 'user' });
      sinon.stub(agent, 'ajax');
      agent.put('suspend', { name: 'X', password: 'Y' });
      expect(agent.ajax.calledWith('PUT', '/users/1/suspend')).to.be.true;
    })
  })

  describe('#delete', function() {
    it('should call this.ajax() with "DELETE"', function() {
      var agent = new Cape.ResourceAgent({ id: 1 }, { resourceName: 'user' });
      sinon.stub(agent, 'ajax');
      agent.delete('tags');
      expect(agent.ajax.calledWith('DELETE', '/users/1/tags')).to.be.true;
    })
  })
})
