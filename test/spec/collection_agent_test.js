'use strict'

class UserCollectionAgent extends Cape.CollectionAgent {
  constructor(client, options) {
    super(client, options)
    this.resourceName = 'users'
    this.adapter = 'foo_bar'
  }
}

describe('CollectionAgent', () => {
  describe('constructor', () => {
    it('should take an object (options) as the second argument', () => {
      let component, options, agent

      component = {}
      options = { resourceName: 'users', basePath: '/api/' }
      agent = new Cape.CollectionAgent(component, options)

      expect(agent.resourceName).to.equal('users')
      expect(agent.basePath).to.equal('/api/')
    })
  })

  describe('#collectionPath', () => {
    it('should return standard values', () => {
      let agent

      agent = new Cape.CollectionAgent({}, { resourceName: 'users' })

      expect(agent.collectionPath()).to.equal('/users')
    })

    it('should add prefix to the paths', () => {
      let agent

      agent = new Cape.CollectionAgent({},
        { resourceName: 'users', basePath: '/api/' })

      expect(agent.collectionPath()).to.equal('/api/users')
    })

    it('should insert the "nestedIn" string to the paths', () => {
      let agent

      agent = new UserCollectionAgent({},
        { basePath: '/api/', nestedIn: 'groups/123/' })

      expect(agent.collectionPath()).to.equal('/api/groups/123/users')
    })
  })

  describe('#memberPath', () => {
    it('should return standard values', () => {
      let agent

      agent = new Cape.CollectionAgent({}, { resourceName: 'users' })

      expect(agent.memberPath(123)).to.equal('/users/123')
    })

    it('should add prefix to the path', () => {
      let agent

      agent = new Cape.CollectionAgent({},
        { resourceName: 'users', basePath: '/api/' })

      expect(agent.memberPath(123)).to.equal('/api/users/123')
    })

    it('should add "nestedIn" string to the path', () => {
      let agent

      agent = new Cape.CollectionAgent({},
        { resourceName: 'users', nestedIn: 'teams/9/' })

      expect(agent.memberPath(123)).to.equal('/teams/9/users/123')
    })

    it('should not add "nestedIn" string to the path', () => {
      let agent

      agent = new Cape.CollectionAgent({},
        { resourceName: 'users', nestedIn: 'teams/9/', shallow: true })

      expect(agent.memberPath(123)).to.equal('/users/123')
    })
  })

  describe('#ajax GET', () => {
    afterEach(() => {
      global.fetch.restore()
    })

    it('should go through a fetch api chain', () => {
      let agent, spy1, spy2, spy3

      Cape.AgentAdapters.FooBarAdapter = sinon.spy()
      agent = new Cape.CollectionAgent({}, { resourceName: 'users' })
      agent.adapter = 'foo_bar'
      sinon.stub(agent, 'refresh')

      spy1 = sinon.spy()
      spy2 = sinon.spy()
      spy3 = sinon.spy()
      stubFetchAPI(spy1)

      agent.ajax('GET', '/users', { page: 1, per_page: 20 }, spy2, spy3)
      expect(spy1.called).to.be.true
      expect(spy2.called).to.be.true
      expect(spy3.called).to.be.true
      expect(agent.refresh.called).to.be.false
      expect(Cape.AgentAdapters.FooBarAdapter.called).to.be.true

      Cape.AgentAdapters.FooBarAdapter = undefined
    })

    it('should accept text/plain data', () => {
      let agent, spy1, spy2, spy3

      agent = new Cape.CollectionAgent({}, { resourceName: 'users', dataType: 'text' })
      sinon.stub(agent, 'refresh')

      spy1 = sinon.spy()
      spy2 = sinon.spy()
      spy3 = sinon.spy()
      stubFetchAPI(spy1, {}, 'text')

      agent.ajax('GET', '/users', { page: 1, per_page: 20 }, spy2, spy3)
      expect(spy1.called).to.be.true
      expect(spy2.called).to.be.true
      expect(spy3.called).to.be.true
      expect(agent.refresh.called).to.be.false
    })
  })

  describe('#ajax POST', () => {
    afterEach(() => {
      global.fetch.restore()
    })

    it('should go through a fetch api chain', () => {
      let agent, spy1, spy2, spy3

      agent = new Cape.CollectionAgent({}, { resourceName: 'users' })
      sinon.stub(agent, 'refresh')

      spy1 = sinon.spy()
      spy2 = sinon.spy()
      spy3 = sinon.spy()
      stubFetchAPI(spy1, '{ "result": "OK" }')

      agent.ajax('POST', '/users', { name: 'X', password: 'Y' }, spy2, spy3)
      expect(spy1.called).to.be.true
      expect(spy2.called).to.be.true
      expect(spy3.called).to.be.true
      expect(agent.refresh.called).to.be.true
      expect(agent.data.result).to.equal('OK')
    })

    it('should not call agent.refresh()', () => {
      let agent, spy1, spy2, spy3

      agent = new Cape.CollectionAgent({},
        { resourceName: 'users', autoRefresh: false })
      sinon.stub(agent, 'refresh')

      spy1 = sinon.spy()
      spy2 = sinon.spy()
      spy3 = sinon.spy()
      stubFetchAPI(spy1)

      agent.ajax('POST', '/users', { name: 'X', password: 'Y' }, spy2, spy3)
      expect(spy1.called).to.be.true
      expect(spy2.called).to.be.true
      expect(spy3.called).to.be.true
      expect(agent.refresh.called).to.be.false
    })
  })

  describe('#refresh', () => {
    afterEach(() => {
      global.fetch.restore()
    })

    it('should go through a fetch api chain', () => {
      let component, agent, spy1

      component = { refresh: () => {} }
      spy1 = sinon.spy()
      stubFetchAPI(spy1, { users: [ {}, {} ] })
      agent = new Cape.CollectionAgent(component, { resourceName: 'users' })
      sinon.stub(agent, 'defaultErrorHandler')
      agent.refresh()
      expect(spy1.called).to.be.true
      expect(agent.objects.length).to.equal(2)
      expect(agent.data.users.length).to.equal(2)
    })

    it('should call paramsForRefresh() to construct the request path', () => {
      let component, agent, spy1

      component = { refresh: () => {} }
      spy1 = stubFetchAPI(sinon.spy(), { users: [ {}, {} ], user_count: 2 })
      agent = new Cape.CollectionAgent(component, { resourceName: 'users' })
      sinon.stub(agent, 'paramsForRefresh', () => { return { page: 1 } })
      sinon.stub(agent, 'defaultErrorHandler')

      agent.refresh()

      expect(spy1.calledWith('/users?page=1')).to.be.true
    })

    it('should call the afterRefresh()', () => {
      let agent, spy1

      spy1 = sinon.spy()
      stubFetchAPI(spy1, { users: [ {}, {} ], user_count: 2 })
      agent = new Cape.CollectionAgent({}, { resourceName: 'users' })
      sinon.stub(agent, 'afterRefresh', function() {
        agent.userCount = agent.data.user_count
      })
      sinon.stub(agent, 'defaultErrorHandler')

      agent.refresh()

      expect(spy1.called).to.be.true
      expect(agent.objects.length).to.equal(2)
      expect(agent.data.users.length).to.equal(2)
      expect(agent.userCount).to.equal(2)
    })

    it('should call the client.refresh()', () => {
      let component, agent, spy1, spy2

      spy1 = sinon.spy()
      spy2 = sinon.spy()
      component = { refresh: spy1 }
      stubFetchAPI(spy2, { users: [ {}, {} ], user_count: 2 })
      agent = new Cape.CollectionAgent(component, { resourceName: 'users' })
      sinon.stub(agent, 'defaultErrorHandler')

      agent.refresh()

      expect(spy1.called).to.be.true
      expect(spy2.called).to.be.true
    })
  })

  describe('#index', () => {
    afterEach(() => {
      global.fetch.restore()
    })

    it('should go through a fetch api chain', () => {
      let agent, spy

      spy = sinon.spy()
      stubFetchAPI(spy)
      agent = new Cape.CollectionAgent({}, { resourceName: 'users' })
      sinon.stub(agent, 'defaultErrorHandler')
      agent.index({ page: 1, per_page: 20 })
      expect(spy.called).to.be.true
    })
  })

  describe('#create', () => {
    afterEach(() => {
      global.fetch.restore()
    })

    it('should go through a fetch api chain', () => {
      let component, agent, spy

      component = { refresh: () => {} }
      spy = sinon.spy()
      stubFetchAPI(spy)
      agent = new Cape.CollectionAgent(component, { resourceName: 'users' })
      sinon.stub(agent, 'defaultErrorHandler')
      agent.create({ name: 'X', password: 'Y' })
      expect(spy.called).to.be.true
    })
  })

  describe('#update', () => {
    afterEach(() => {
      global.fetch.restore()
    })

    it('should go through a fetch api chain', () => {
      let component, agent, spy

      component = { refresh: () => {} }
      spy = sinon.spy()
      stubFetchAPI(spy)
      agent = new Cape.CollectionAgent(component, { resourceName: 'users' })
      sinon.stub(agent, 'defaultErrorHandler')
      agent.update(1, { name: 'X', password: 'Y' })
      expect(spy.called).to.be.true
    })
  })

  describe('#destroy', () => {
    afterEach(() => {
      global.fetch.restore()
    })

    it('should go through a fetch api chain', () => {
      let component, agent, spy

      component = { refresh: () => {} }
      spy = sinon.spy()
      stubFetchAPI(spy)
      agent = new Cape.CollectionAgent(component, { resourceName: 'users' })
      sinon.stub(agent, 'defaultErrorHandler')
      agent.destroy(1)
      expect(spy.called).to.be.true
    })
  })

  describe('#get', () => {
    it('should call this.ajax() with "GET"', () => {
      let agent = new Cape.CollectionAgent({}, { resourceName: 'users' })
      sinon.stub(agent, 'ajax')
      agent.get('suspended', null)
      expect(agent.ajax.calledWith('GET', '/users/suspended')).to.be.true
    })
  })

  describe('#head', () => {
    it('should call this.ajax() with "HEAD"', () => {
      let agent = new Cape.CollectionAgent({}, { resourceName: 'users' })
      sinon.stub(agent, 'ajax')
      agent.head('suspended', null)
      expect(agent.ajax.calledWith('HEAD', '/users/suspended')).to.be.true
    })
  })

  describe('#post', () => {
    it('should call this.ajax() with "POST"', () => {
      let agent = new Cape.CollectionAgent({}, { resourceName: 'users' })
      sinon.stub(agent, 'ajax')
      agent.post('tags', 1, { tags: [ 'A', 'B' ] })
      expect(agent.ajax.calledWith('POST', '/users/1/tags')).to.be.true
    })
  })

  describe('#patch', () => {
    it('should call this.ajax() with "PATCH"', () => {
      let agent = new Cape.CollectionAgent({}, { resourceName: 'users' })
      sinon.stub(agent, 'ajax')
      agent.patch('suspend', 1, { name: 'X', password: 'Y' })
      expect(agent.ajax.calledWith('PATCH', '/users/1/suspend')).to.be.true
    })
  })

  describe('#put', () => {
    it('should call this.ajax() with "PUT"', () => {
      let agent = new Cape.CollectionAgent({}, { resourceName: 'users' })
      sinon.stub(agent, 'ajax')
      agent.put('suspend', 1, { name: 'X', password: 'Y' })
      expect(agent.ajax.calledWith('PUT', '/users/1/suspend')).to.be.true
    })
  })

  describe('#delete', () => {
    it('should call this.ajax() with "DELETE"', () => {
      let agent = new Cape.CollectionAgent({}, { resourceName: 'users' })
      sinon.stub(agent, 'ajax')
      agent.delete('tags', 1)
      expect(agent.ajax.calledWith('DELETE', '/users/1/tags')).to.be.true
    })
  })
})
