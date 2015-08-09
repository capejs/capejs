'use strict';

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
      options = { basePath: '/api/' }
      agent = new Cape.ResourceAgent('user', form, options);

      expect(agent.basePath).to.equal('/api/');
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
      agent = new Cape.ResourceAgent('user', form, { basePath: '/api/' });

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
      agent = new Cape.ResourceAgent('user', form, { basePath: '/api/' });

      expect(agent.memberPath()).to.equal('/api/users/123');
    })
  })

  describe('#singularPath', function() {
    it('should return standard values', function() {
      var form, agent;

      form = {};
      agent = new Cape.ResourceAgent('profile', form, { singular: true });

      expect(agent.singularPath()).to.equal('/profile');
    })

    it('should add prefix to the paths', function() {
      var form, agent;

      form = {};
      agent = new Cape.ResourceAgent('profile', form,
        { basePath: '/api/', singular: true });

      expect(agent.singularPath()).to.equal('/api/profile');
    })
  })

  describe('#init', function() {
    it('should go through a fetch api chain', function() {
      var form, agent, spy1, spy2, spy3;

      Cape.AgentAdapters.FooBarAdapter = sinon.spy();
      form = { id: 123 };
      agent = new Cape.ResourceAgent('user', form);
      agent.adapter = 'foo_bar';

      spy1 = sinon.spy();
      spy2 = sinon.spy();
      spy3 = sinon.spy();
      stubFetchAPI(spy1);

      agent.init(spy2, spy3);
      expect(spy1.called).to.be.true;
      expect(spy2.called).to.be.true;
      expect(spy3.called).to.be.true;
      expect(global.fetch.calledWith('/users/123')).to.be.true;
      expect(Cape.AgentAdapters.FooBarAdapter.called).to.be.true;

      Cape.AgentAdapters.FooBarAdapter = undefined;

      global.fetch.restore();
    })

    it('should fetch a singular resource', function() {
      var form, agent, spy1, spy2, spy3;

      form = {};
      agent = new Cape.ResourceAgent('profile', form, { singular: true });

      spy1 = sinon.spy();
      spy2 = sinon.spy();
      spy3 = sinon.spy();
      stubFetchAPI(spy1);

      agent.init(spy2, spy3);
      expect(spy1.called).to.be.true;
      expect(spy2.called).to.be.true;
      expect(spy3.called).to.be.true;
      expect(global.fetch.calledWith('/profile')).to.be.true;

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
      stubFetchAPI(spy1);

      agent.create(spy2, spy3);
      expect(spy1.called).to.be.true;
      expect(spy2.called).to.be.true;
      expect(spy3.called).to.be.true;
      expect(global.fetch.calledWith('/users')).to.be.true;

      global.fetch.restore();
    })

    it('should create a singular resource', function() {
      var form, agent, spy1, spy2, spy3;

      form = { paramsFor: function() { return {} } };
      agent = new Cape.ResourceAgent('profile', form, { singular: true });

      spy1 = sinon.spy();
      spy2 = sinon.spy();
      spy3 = sinon.spy();
      stubFetchAPI(spy1);

      agent.create(spy2, spy3);
      expect(spy1.called).to.be.true;
      expect(spy2.called).to.be.true;
      expect(spy3.called).to.be.true;
      expect(global.fetch.calledWith('/profile')).to.be.true;

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
      stubFetchAPI(spy1);

      agent.update(spy2, spy3);
      expect(spy1.called).to.be.true;
      expect(spy2.called).to.be.true;
      expect(spy3.called).to.be.true;
      expect(global.fetch.calledWith('/users/123')).to.be.true;

      global.fetch.restore();
    })

    it('should update a singular resource', function() {
      var form, agent, spy1, spy2, spy3;

      form = { paramsFor: function() { return {} } };
      agent = new Cape.ResourceAgent('profile', form, { singular: true });

      spy1 = sinon.spy();
      spy2 = sinon.spy();
      spy3 = sinon.spy();
      stubFetchAPI(spy1);

      agent.update(spy2, spy3);
      expect(spy1.called).to.be.true;
      expect(spy2.called).to.be.true;
      expect(spy3.called).to.be.true;
      expect(global.fetch.calledWith('/profile')).to.be.true;

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
      stubFetchAPI(spy1);

      agent.destroy(spy2, spy3);
      expect(spy1.called).to.be.true;
      expect(spy2.called).to.be.true;
      expect(spy3.called).to.be.true;
      expect(global.fetch.calledWith('/users/123')).to.be.true;

      global.fetch.restore();
    })

    it('should destroy a singular resource', function() {
      var form, agent, spy1, spy2, spy3;

      form = { paramsFor: function() { return {} } };
      agent = new Cape.ResourceAgent('profile', form, { singular: true });

      spy1 = sinon.spy();
      spy2 = sinon.spy();
      spy3 = sinon.spy();
      stubFetchAPI(spy1);

      agent.destroy(spy2, spy3);
      expect(spy1.called).to.be.true;
      expect(spy2.called).to.be.true;
      expect(spy3.called).to.be.true;
      expect(global.fetch.calledWith('/profile')).to.be.true;

      global.fetch.restore();
    })
  })
})
