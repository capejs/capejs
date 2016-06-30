'use strict'

class UserAgent extends Cape.ResourceAgent {
  constructor(client, options) {
    super(client, options)
    this.client = client
    this.resourceName = 'user'
    this.adapter = 'foo_bar'
  }
}

describe('ResourceAgent', () => {
  describe('constructor', () => {
    it('should take its client as the first argument', () => {
      let form = {}
      let agent = new Cape.ResourceAgent(form)

      expect(agent.client).to.equal(form)
    })

    it('should take an object (options) as the second argument', () => {
      let form = {}
      let options = { resourceName: 'user', basePath: '/api/', id: 123 }
      let agent = new Cape.ResourceAgent(form, options)

      expect(agent.resourceName).to.equal('user')
      expect(agent.basePath).to.equal('/api/')
    })
  })

  describe('.createResourceAgentClass', () => {
    it('should create a class inheriting Cape.ResrouceAgent', () => {
      let form = {}
      let agent = new UserAgent(form)

      expect(agent.client).to.equal(form)
    })
  })

  describe('#collectionPath', () => {
    it('should return standard values', () => {
      let form = {}
      let options = { resourceName: 'user' }
      let agent = new Cape.ResourceAgent(form, options)

      expect(agent.collectionPath()).to.equal('/users')
    })

    it('should add prefix to the paths', () => {
      let form = {}
      let options = {
        resourceName: 'user', basePath: '/api/', nestedIn: 'companies/123/' }
      let agent = new Cape.ResourceAgent(form, options)

      expect(agent.collectionPath()).to.equal('/api/companies/123/users')
    })
  })

  describe('#newPath', () => {
    it('should return standard values', () => {
      let form = { id: undefined }
      let options = { resourceName: 'user' }
      let agent = new Cape.ResourceAgent(form, options)

      expect(agent.newPath()).to.equal('/users/new')
    })

    it('should add prefix to the paths', () => {
      let form = { id: undefined }
      let options = { resourceName: 'user', basePath: '/api/' }
      let agent = new Cape.ResourceAgent(form, options)

      expect(agent.newPath()).to.equal('/api/users/new')
    })
  })

  describe('#memberPath', () => {
    it('should return standard values', () => {
      let form = {}
      let options = { resourceName: 'user', id: 123 }
      let agent = new Cape.ResourceAgent(form, options)

      expect(agent.memberPath()).to.equal('/users/123')
    })

    it('should add prefix to the paths', () => {
      let form = {}
      let options = { resourceName: 'user', basePath: '/api/', id: 123 }
      let agent = new Cape.ResourceAgent(form, options)

      expect(agent.memberPath()).to.equal('/api/users/123')
    })

    it('should add "nestedIn" string to the path', () => {
      let agent = new Cape.ResourceAgent({},
        { resourceName: 'users', nestedIn: 'teams/9/', id: 123  })

      expect(agent.memberPath()).to.equal('/teams/9/users/123')
    })

    it('should not add "nestedIn" string to the path', () => {
      let agent = new Cape.ResourceAgent({},
        { resourceName: 'users', nestedIn: 'teams/9/', id: 123, shallow: true })

      expect(agent.memberPath()).to.equal('/users/123')
    })
  })

  describe('#singularPath', () => {
    it('should return standard values', () => {
      let form = {}
      let options = { resourceName: 'profile', singular: true }
      let agent = new Cape.ResourceAgent(form, options)

      expect(agent.singularPath()).to.equal('/profile')
    })

    it('should keep resourceName as is', () => {
      let form = {}
      let options = { resourceName: 'my_settings', singular: true }
      let agent = new Cape.ResourceAgent(form, options)

      expect(agent.singularPath()).to.equal('/my_settings')
    })

    it('should add prefix to the paths', () => {
      let form = {}
      let options = { resourceName: 'profile', basePath: '/api/', singular: true }
      let agent = new Cape.ResourceAgent(form, options)

      expect(agent.singularPath()).to.equal('/api/profile')
    })
  })

  describe('#requestPath', () => {
    it('should return singular path', () => {
      let form = {}
      let options = { resourceName: 'profile', singular: true }
      let agent = new Cape.ResourceAgent(form, options)

      expect(agent.requestPath()).to.equal('/profile')
    })

    it('should return collection path', () => {
      let form = {}
      let options = { resourceName: 'articles', singular: false }
      let agent = new Cape.ResourceAgent(form, options)

      expect(agent.requestPath()).to.equal('/articles')
    })

    it('should return member path', () => {
      let form = {}
      let options = { resourceName: 'articles', id: 99, singular: false }
      let agent = new Cape.ResourceAgent(form, options)

      expect(agent.requestPath()).to.equal('/articles/99')
    })
  })

  describe('#init', () => {
    afterEach(() => {
      global.fetch.restore()
    })

    it('should make a request to the memberPath', () => {
      let spy1 = sinon.spy()
      let spy2 = sinon.spy()
      let spy3 = sinon.spy()

      Cape.AgentAdapters.FooBarAdapter = sinon.spy()
      let form = { setValues: spy2, refresh: spy3 }
      let options = { resourceName: 'user', id: 123 }
      let agent = new Cape.ResourceAgent(form, options)
      agent.adapter = 'foo_bar'
      agent.defaultErrorHandler = function(ex) {}

      stubFetchAPI(spy1, '{ "user": { "id": 123, "name": "John" } }')

      agent.init()
      expect(agent.data.user.name).to.eq('John')
      expect(spy1.called).to.be.true
      expect(spy2.calledWith('user', { id: 123, name: 'John' })).to.be.ok
      expect(spy3.called).to.be.true
      expect(global.fetch.calledWith('/users/123')).to.be.true
      expect(Cape.AgentAdapters.FooBarAdapter.called).to.be.true

      Cape.AgentAdapters.FooBarAdapter = undefined
    })

    it('should make a request to the newPath', () => {
      let spy1 = sinon.spy()
      let spy2 = sinon.spy()
      let spy3 = sinon.spy()

      Cape.AgentAdapters.FooBarAdapter = sinon.spy()
      let form = { id: undefined, setValues: spy2, refresh: spy3 }
      let options = { resourceName: 'user' }
      let agent = new Cape.ResourceAgent(form, options)
      agent.adapter = 'foo_bar'
      agent.defaultErrorHandler = function(ex) {}

      stubFetchAPI(spy1, '{ "user": { "name": "" } }')

      agent.init()
      expect(agent.data.user.name).to.eq('')
      expect(spy1.called).to.be.true
      expect(spy2.calledWith('user', { name: '' })).to.be.ok
      expect(spy3.called).to.be.true
      expect(global.fetch.calledWith('/users/new')).to.be.true
      expect(Cape.AgentAdapters.FooBarAdapter.called).to.be.true

      Cape.AgentAdapters.FooBarAdapter = undefined
    })

    it('should go through a fetch api chain', () => {
      Cape.AgentAdapters.FooBarAdapter = sinon.spy()
      let form = {}
      let options = { resourceName: 'user', id: 123 }
      let agent = new Cape.ResourceAgent(form, options)
      agent.adapter = 'foo_bar'

      let spy1 = sinon.spy()
      let spy2 = sinon.spy()
      let spy3 = sinon.spy()
      stubFetchAPI(spy1, '{ "user": { "id": 123, "name": "John" } }')

      agent.init(spy2, spy3)
      expect(spy1.called).to.be.true
      expect(spy2.calledWith(agent)).to.be.true
      expect(spy3.called).to.be.true
      expect(global.fetch.calledWith('/users/123')).to.be.true
      expect(Cape.AgentAdapters.FooBarAdapter.called).to.be.true

      Cape.AgentAdapters.FooBarAdapter = undefined
    })

    it('should fetch a singular resource', () => {
      let form = {}
      let options = { resourceName: 'profile', singular: true }
      let agent = new Cape.ResourceAgent(form, options)

      let spy1 = sinon.spy()
      let spy2 = sinon.spy()
      let spy3 = sinon.spy()
      stubFetchAPI(spy1)

      agent.init(spy2, spy3)
      expect(spy1.called).to.be.true
      expect(spy2.called).to.be.true
      expect(spy3.called).to.be.true
      expect(global.fetch.calledWith('/profile')).to.be.true
    })
  })

  describe('#refresh', () => {
    afterEach(() => {
      global.fetch.restore()
    })

    it('should go through a fetch api chain', () => {
      let options = { resourceName: 'user', id: 123 }
      let spy0 = sinon.spy()
      let spy1 = sinon.spy()
      let spy2 = sinon.spy()

      let agent = new Cape.ResourceAgent({ refresh: spy0 }, options)
      agent.defaultErrorHandler = spy1

      stubFetchAPI(spy2)

      agent.refresh()
      expect(spy0.called).to.be.true
      expect(spy1.called).to.be.true
      expect(spy2.called).to.be.true
      expect(global.fetch.calledWith('/users/123')).to.be.true
    })
  })

  describe('#show', () => {
    afterEach(() => {
      global.fetch.restore()
    })

    it('should go through a fetch api chain', () => {
      let options = { resourceName: 'user', id: 123 }
      let agent = new Cape.ResourceAgent({}, options)

      let spy1 = sinon.spy()
      let spy2 = sinon.spy()
      let spy3 = sinon.spy()
      stubFetchAPI(spy1)

      agent.show(spy2, spy3)
      expect(spy1.called).to.be.true
      expect(spy2.called).to.be.true
      expect(spy3.called).to.be.true
      expect(global.fetch.calledWith('/users/123')).to.be.true
    })

    it('should get a singular resource', () => {
      let options = { resourceName: 'profile', singular: true }
      let agent = new Cape.ResourceAgent({}, options)

      let spy1 = sinon.spy()
      let spy2 = sinon.spy()
      let spy3 = sinon.spy()
      stubFetchAPI(spy1)

      agent.show(spy2, spy3)
      expect(spy1.called).to.be.true
      expect(spy2.called).to.be.true
      expect(spy3.called).to.be.true
      expect(global.fetch.calledWith('/profile')).to.be.true
    })
  })

  describe('#create', () => {
    afterEach(() => {
      global.fetch.restore()
    })

    it('should go through a fetch api chain', () => {
      let form = { paramsFor: () => { return {} } }
      let options = { resourceName: 'user' }
      let agent = new Cape.ResourceAgent(form, options)

      let spy1 = sinon.spy()
      let spy2 = sinon.spy()
      let spy3 = sinon.spy()
      stubFetchAPI(spy1)

      agent.create(spy2, spy3)
      expect(spy1.called).to.be.true
      expect(spy2.called).to.be.true
      expect(spy3.called).to.be.true
      expect(global.fetch.calledWith('/users')).to.be.true
    })

    it('should create a singular resource', () => {
      let form = { paramsFor: () => { return {} } }
      let options = { resourceName: 'profile', singular: true }
      let agent = new Cape.ResourceAgent(form, options)

      let spy1 = sinon.spy()
      let spy2 = sinon.spy()
      let spy3 = sinon.spy()
      stubFetchAPI(spy1)

      agent.create(spy2, spy3)
      expect(spy1.called).to.be.true
      expect(spy2.called).to.be.true
      expect(spy3.called).to.be.true
      expect(global.fetch.calledWith('/profile')).to.be.true
    })
  })

  describe('#update', () => {
    afterEach(() => {
      global.fetch.restore()
    })

    it('should go through a fetch api chain', () => {
      let form = { paramsFor: () => { return {} } }
      let options = { resourceName: 'user', id: 123 }
      let agent = new Cape.ResourceAgent(form, options)

      let spy1 = sinon.spy()
      let spy2 = sinon.spy()
      let spy3 = sinon.spy()
      stubFetchAPI(spy1, '{ "result": "OK" }')

      agent.update(spy2, spy3)
      expect(spy1.called).to.be.true
      expect(spy2.called).to.be.true
      expect(spy3.called).to.be.true
      expect(global.fetch.calledWith('/users/123')).to.be.true
      expect(agent.data.result).to.equal('OK')
    })

    it('should update a singular resource', () => {
      let form = { paramsFor: () => { return {} } }
      let options = { resourceName: 'profile', singular: true }
      let agent = new Cape.ResourceAgent(form, options)

      let spy1 = sinon.spy()
      let spy2 = sinon.spy()
      let spy3 = sinon.spy()
      stubFetchAPI(spy1)

      agent.update(spy2, spy3)
      expect(spy1.called).to.be.true
      expect(spy2.called).to.be.true
      expect(spy3.called).to.be.true
      expect(global.fetch.calledWith('/profile')).to.be.true
    })
  })

  describe('#destroy', () => {
    afterEach(() => {
      global.fetch.restore()
    })

    it('should go through a fetch api chain', () => {
      let form = {}
      let options = { resourceName: 'user', id: 123 }
      let agent = new Cape.ResourceAgent(form, options)

      let spy1 = sinon.spy()
      let spy2 = sinon.spy()
      let spy3 = sinon.spy()
      stubFetchAPI(spy1)

      agent.destroy(spy2, spy3)
      expect(spy1.called).to.be.true
      expect(spy2.called).to.be.true
      expect(spy3.called).to.be.true
      expect(global.fetch.calledWith('/users/123')).to.be.true
    })

    it('should destroy a singular resource', () => {
      let form = { paramsFor: () => { return {} } }
      let options = { resourceName: 'profile', singular: true }
      let agent = new Cape.ResourceAgent(form, options)

      let spy1 = sinon.spy()
      let spy2 = sinon.spy()
      let spy3 = sinon.spy()
      stubFetchAPI(spy1)

      agent.destroy(spy2, spy3)
      expect(spy1.called).to.be.true
      expect(spy2.called).to.be.true
      expect(spy3.called).to.be.true
      expect(global.fetch.calledWith('/profile')).to.be.true
    })
  })

  describe('#get', () => {
    it('should call this.ajax() with "GET"', () => {
      let agent = new Cape.ResourceAgent({}, { resourceName: 'user' })
      sinon.stub(agent, 'ajax')
      agent.get('suspended')
      expect(agent.ajax.calledWith('GET', '/users/suspended')).to.be.true
    })
  })

  describe('#head', () => {
    it('should call this.ajax() with "HEAD"', () => {
      let agent = new Cape.ResourceAgent({}, { resourceName: 'user' })
      sinon.stub(agent, 'ajax')
      agent.head('suspended')
      expect(agent.ajax.calledWith('HEAD', '/users/suspended')).to.be.true
    })
  })

  describe('#post', () => {
    it('should call this.ajax() with "POST"', () => {
      let agent = new Cape.ResourceAgent({}, { resourceName: 'user', id: 1 })
      sinon.stub(agent, 'ajax')
      agent.post('tags', { tags: [ 'A', 'B' ] })
      expect(agent.ajax.calledWith('POST', '/users/1/tags')).to.be.true
    })
  })

  describe('#patch', () => {
    it('should call this.ajax() with "PATCH"', () => {
      let agent = new Cape.ResourceAgent({}, { resourceName: 'user', id: 1 })
      sinon.stub(agent, 'ajax')
      agent.patch('suspend', { name: 'X', password: 'Y' })
      expect(agent.ajax.calledWith('PATCH', '/users/1/suspend')).to.be.true
    })
  })

  describe('#put', () => {
    it('should call this.ajax() with "PUT"', () => {
      let agent = new Cape.ResourceAgent({}, { resourceName: 'user', id: 1 })
      sinon.stub(agent, 'ajax')
      agent.put('suspend', { name: 'X', password: 'Y' })
      expect(agent.ajax.calledWith('PUT', '/users/1/suspend')).to.be.true
    })
  })

  describe('#delete', () => {
    it('should call this.ajax() with "DELETE"', () => {
      let agent = new Cape.ResourceAgent({}, { resourceName: 'user', id: 1 })
      sinon.stub(agent, 'ajax')
      agent.delete('tags')
      expect(agent.ajax.calledWith('DELETE', '/users/1/tags')).to.be.true
    })
  })
})
