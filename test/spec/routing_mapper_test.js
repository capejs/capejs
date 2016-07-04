'use strict'

describe('RoutingMapper', () => {
  describe('page', () => {
    it('should add a route to specified component', () => {
      var router = { routes: [] },
          mapper = new Cape.RoutingMapper(router),
          route

      mapper.page('members/search/:name', 'search')
      expect(router.routes.length).to.equal(1)

      route = router.routes[0]
      expect('members/search/foo').to.match(route.regexp)
      expect('members/search').not.to.match(route.regexp)
      expect(route.keys.length).to.equal(1)
      expect(route.keys[0]).to.equal('name')
      expect(route.namespace).to.equal(null)
      expect(route.component).to.equal('search')
    })

    it('should add a route to namespaced component', () => {
      var router = { routes: [] },
          mapper = new Cape.RoutingMapper(router),
          route

      mapper.page('members/search/:name', 'members.search')
      expect(router.routes.length).to.equal(1)

      route = router.routes[0]
      expect('members/search/foo').to.match(route.regexp)
      expect('members/search').not.to.match(route.regexp)
      expect(route.keys.length).to.equal(1)
      expect(route.keys[0]).to.equal('name')
    })

    it('should add a route with constraints', () => {
      var router = { routes: [] },
          mapper = new Cape.RoutingMapper(router),
          route

      mapper.page('members/:id/edit', 'members.edit', { id: '\\d+' })
      expect(router.routes.length).to.equal(1)

      route = router.routes[0]
      expect('members/123/edit').to.match(route.regexp)
      expect('members/foo/edit').not.to.match(route.regexp)
      expect('members/new').not.to.match(route.regexp)
      expect(route.keys.length).to.equal(1)
      expect(route.keys[0]).to.equal('id')
    })

    it('should add a route with constraints that contains non capturing groups', () => {
      var router = { routes: [] },
          mapper = new Cape.RoutingMapper(router),
          route,
          md

      mapper.page('blog/:year/:month', 'blogs.index',
        { year: '201\\d', month: '(?:0\\d|1[012])' })
      expect(router.routes.length).to.equal(1)

      route = router.routes[0]
      expect('blog/2012/12').to.match(route.regexp)
      expect('blog/2012/13').not.to.match(route.regexp)
      expect(route.keys.length).to.equal(2)
      expect(route.keys[0]).to.equal('year')
      expect(route.keys[1]).to.equal('month')

      md = 'blog/2012/12'.match(route.regexp)
      expect(md[1]).to.equal('2012')
      expect(md[2]).to.equal('12')
    })

    it('should add a route to deeply namespaced component', () => {
      var router = { routes: [] },
          mapper = new Cape.RoutingMapper(router),
          route

      mapper.page('admin/members/search/:name', 'app.admin.members.search')
      expect(router.routes.length).to.equal(1)

      route = router.routes[0]
      expect('admin/members/search/foo').to.match(route.regexp)
      expect('admin/members/search').not.to.match(route.regexp)
      expect(route.keys.length).to.equal(1)
      expect(route.keys[0]).to.equal('name')
    })

    it('should infer component class path from the hash pattern', () => {
      var router = { routes: [] },
          mapper = new Cape.RoutingMapper(router),
          route

      mapper.page('company/info')
      expect(router.routes.length).to.equal(1)

      route = router.routes[0]
      expect('company/info').to.match(route.regexp)
      expect(route.container).to.equal('company')
      expect(route.component).to.equal('info')
    })

    it('should throw exception when the first argument is missing', () => {
      var router = { routes: [] },
          mapper = new Cape.RoutingMapper(router),
          route

      expect(mapper.page.bind(mapper)).to.throw('Missing hash pattern.')
    })

    it('should throw exception when the second argument is missing', () => {
      var router = { routes: [] },
          mapper = new Cape.RoutingMapper(router),
          route

      expect(mapper.page.bind(mapper, 'help/:page')).to.throw('Missing class name path.')
    })
  })

  describe('root', () => {
    it('should add a route for empty hash', () => {
      var router = { routes: [] },
          mapper = new Cape.RoutingMapper(router),
          route

      mapper.root('top.index')
      expect(router.routes.length).to.equal(1)

      route = router.routes[0]
      expect('').to.match(route.regexp)
      expect('top/index').not.to.match(route.regexp)
      expect(route.namespace).to.be.null
      expect(route.resource).to.be.null
      expect(route.action).to.be.null
      expect(route.container).to.equal('top')
      expect(route.component).to.equal('index')
    })

    it('should add a route for empty hash under a namespace', () => {
      var router = { routes: [] },
          mapper = new Cape.RoutingMapper(router),
          route

      mapper.namespace('admin', function(m) {
        m.root('top.index')
      })

      expect(router.routes.length).to.equal(1)

      route = router.routes[0]
      expect('admin').to.match(route.regexp)
      expect('').not.to.match(route.regexp)
      expect(route.container).to.equal('admin.top')
      expect(route.component).to.equal('index')
    })
  })

  describe('many', () => {
    it('should add four routes', () => {
      var router = { routes: [] },
          mapper = new Cape.RoutingMapper(router),
          route

      mapper.many('members')
      expect(router.routes.length).to.equal(4)

      route = router.routes[0]
      expect('members').to.match(route.regexp)
      expect(route.namespace).to.be.null
      expect(route.resource).to.equal('members')
      expect(route.action).to.equal('index')
      expect(route.container).to.equal('members')
      expect(route.component).to.equal('list')

      route = router.routes[1]
      expect('members/new').to.match(route.regexp)
      expect(route.resource).to.equal('members')
      expect(route.action).to.equal('new')
      expect(route.container).to.equal('members')
      expect(route.component).to.equal('form')

      route = router.routes[2]
      expect('members/123').to.match(route.regexp)
      expect(route.resource).to.equal('members')
      expect(route.action).to.equal('show')
      expect(route.container).to.equal('members')
      expect(route.component).to.equal('item')

      route = router.routes[3]
      expect('members/123/edit').to.match(route.regexp)
      expect(route.resource).to.equal('members')
      expect(route.action).to.equal('edit')
      expect(route.container).to.equal('members')
      expect(route.component).to.equal('form')
    })

    it('should take an action name for "only" option', () => {
      var router = { routes: [] },
          mapper = new Cape.RoutingMapper(router),
          route

      mapper.many('members', { only: 'show' })
      expect(router.routes.length).to.equal(1)
    })

    it('should take an array of names for "only" option', () => {
      var router = { routes: [] },
          mapper = new Cape.RoutingMapper(router),
          route

      mapper.many('members', { only: ['show', 'edit'] })
      expect(router.routes.length).to.equal(2)
    })

    it('should take an action name for "except" option', () => {
      var router = { routes: [] },
          mapper = new Cape.RoutingMapper(router),
          route

      mapper.many('members', { except: 'new' })
      expect(router.routes.length).to.equal(3)
    })

    it('should take an array of names for "except" option', () => {
      var router = { routes: [] },
          mapper = new Cape.RoutingMapper(router),
          route

      mapper.many('members', { except: ['show', 'edit'] })
      expect(router.routes.length).to.equal(2)
    })

    it('should take a hash for "pathNames" option', () => {
      var router = { routes: [] },
          mapper = new Cape.RoutingMapper(router),
          route

      mapper.many('members',
        { pathNames: { new: 'add', edit: 'modify' } })
      route = router.routes[1]
      expect('members/add').to.match(route.regexp)
      route = router.routes[3]
      expect('members/123/modify').to.match(route.regexp)
    })

    it('should take a string for "path" option', () => {
      var router = { routes: [] },
          mapper = new Cape.RoutingMapper(router),
          route

      mapper.many('members', { path: 'players' })
      expect('players').to.match(router.routes[0].regexp)
      expect('players/new').to.match(router.routes[1].regexp)
      expect('players/123').to.match(router.routes[2].regexp)
      expect('players/123/edit').to.match(router.routes[3].regexp)
    })

    it('should define a custom route', () => {
      var router = { routes: [] },
          mapper = new Cape.RoutingMapper(router),
          route

      mapper.many('members', { only: [] }, function(m) {
        m.collection('special')
        m.member('info', 'address')
        m.new('quick')
      })
      expect('members/special').to.match(router.routes[0].regexp)
      expect('members/123/info').to.match(router.routes[1].regexp)
      expect('members/123/address').to.match(router.routes[2].regexp)
      expect('members/new/quick').to.match(router.routes[3].regexp)
      expect(router.routes[0].namespace).to.be.null
      expect(router.routes[0].resource).to.equal('members')
      expect(router.routes[0].action).to.equal('special')
      expect(router.routes[0].container).to.equal('members')
      expect(router.routes[0].component).to.equal('special')
    })

    it('should define a nested resource', () => {
      var router = { routes: [] },
          mapper = new Cape.RoutingMapper(router),
          route

      mapper.many('members', { only: 'show' }, function(m) {
        m.many('addresses')
      })
      expect('members/123').to.match(router.routes[0].regexp)
      expect('members/123/addresses').to.match(router.routes[1].regexp)
      expect('members/123/addresses/new').to.match(router.routes[2].regexp)
      expect('members/123/addresses/99').to.match(router.routes[3].regexp)
      expect('members/123/addresses/99/edit').to.match(router.routes[4].regexp)
      expect(router.routes[4].keys[0]).to.equal('member_id')
      expect(router.routes[4].keys[1]).to.equal('id')
      expect(router.routes[0].namespace).to.be.null
      expect(router.routes[0].resource).to.equal('members')
      expect(router.routes[0].action).to.equal('show')
      expect(router.routes[0].container).to.equal('members')
      expect(router.routes[0].component).to.equal('item')
      expect(router.routes[4].resource).to.equal('members/addresses')
      expect(router.routes[4].action).to.equal('edit')
      expect(router.routes[4].container).to.equal('addresses')
      expect(router.routes[4].component).to.equal('form')
    })
  })

  describe('one', () => {
    it('should add three routes', () => {
      var router = { routes: [] },
          mapper = new Cape.RoutingMapper(router),
          route

      mapper.one('member')
      expect(router.routes.length).to.equal(3)

      route = router.routes[0]
      expect('member').to.match(route.regexp)
      expect(route.namespace).to.be.null
      expect(route.resource).to.equal('member')
      expect(route.action).to.equal('show')
      expect(route.container).to.equal('member')
      expect(route.component).to.equal('content')

      route = router.routes[1]
      expect('member/new').to.match(route.regexp)
      expect(route.namespace).to.be.null
      expect(route.resource).to.equal('member')
      expect(route.action).to.equal('new')
      expect(route.container).to.equal('member')
      expect(route.component).to.equal('form')

      route = router.routes[2]
      expect('member/edit').to.match(route.regexp)
      expect(route.namespace).to.be.null
      expect(route.resource).to.equal('member')
      expect(route.action).to.equal('edit')
      expect(route.container).to.equal('member')
      expect(route.component).to.equal('form')
    })

    it('should take an action name for "only" option', () => {
      var router = { routes: [] },
          mapper = new Cape.RoutingMapper(router),
          route

      mapper.one('member', { only: 'show' })
      expect(router.routes.length).to.equal(1)
    })

    it('should take an array of names for "only" option', () => {
      var router = { routes: [] },
          mapper = new Cape.RoutingMapper(router),
          route

      mapper.one('member', { only: ['show', 'edit'] })
      expect(router.routes.length).to.equal(2)
    })

    it('should take an action name for "except" option', () => {
      var router = { routes: [] },
          mapper = new Cape.RoutingMapper(router),
          route

      mapper.one('member', { except: 'new' })
      expect(router.routes.length).to.equal(2)
    })

    it('should take an array of names for "except" option', () => {
      var router = { routes: [] },
          mapper = new Cape.RoutingMapper(router),
          route

      mapper.one('member', { except: ['show', 'edit'] })
      expect(router.routes.length).to.equal(1)
    })

    it('should take a hash for "pathNames" option', () => {
      var router = { routes: [] },
          mapper = new Cape.RoutingMapper(router),
          route

      mapper.one('member',
        { pathNames: { new: 'add', edit: 'modify' } })
      route = router.routes[1]
      expect('member/add').to.match(route.regexp)
      route = router.routes[2]
      expect('member/modify').to.match(route.regexp)
    })

    it('should take a string for "path" option', () => {
      var router = { routes: [] },
          mapper = new Cape.RoutingMapper(router),
          route

      mapper.one('member', { path: 'player' })
      expect('player').to.match(router.routes[0].regexp)
      expect('player/new').to.match(router.routes[1].regexp)
      expect('player/edit').to.match(router.routes[2].regexp)
    })

    it('should define a custom route', () => {
      var router = { routes: [] },
          mapper = new Cape.RoutingMapper(router),
          route

      mapper.one('my_account', function(m) {
        m.view('phone', 'address')
        m.new('quick')
      })
      expect('my_account/phone').to.match(router.routes[3].regexp)
      expect('my_account/address').to.match(router.routes[4].regexp)
      expect('my_account/new/quick').to.match(router.routes[5].regexp)
      expect(router.routes[3].namespace).to.be.null
      expect(router.routes[3].resource).to.equal('my_account')
      expect(router.routes[3].action).to.equal('phone')
      expect(router.routes[3].container).to.equal('my_account')
      expect(router.routes[3].component).to.equal('phone')
    })

    it('should define a nested resource', () => {
      var router = { routes: [] },
          mapper = new Cape.RoutingMapper(router),
          route

      mapper.one('member', { only: 'show' }, function(m) {
        m.many('addresses')
        m.one('password', { only: 'show' })
      })
      expect('member').to.match(router.routes[0].regexp)
      expect('member/addresses').to.match(router.routes[1].regexp)
      expect('member/addresses/new').to.match(router.routes[2].regexp)
      expect('member/addresses/99').to.match(router.routes[3].regexp)
      expect('member/addresses/99/edit').to.match(router.routes[4].regexp)
      expect('member/password').to.match(router.routes[5].regexp)
      expect(router.routes[0].container).to.equal('member')
      expect(router.routes[0].component).to.equal('content')
      expect(router.routes[4].keys[0]).to.equal('id')
      expect(router.routes[4].container).to.equal('addresses')
      expect(router.routes[4].component).to.equal('form')
    })
  })

  describe('collection', () => {
    it('should throw error when it is not used under a plural resource', () => {
      var router = { routes: [] },
          mapper = new Cape.RoutingMapper(router)

      expect(() => {
        mapper.one('account', function(m) {
          m.collection('emails')
        })
      }).to.throw(Error)
    })
  })

  describe('member', () => {
    it('should throw error when it is not used under a plural resource', () => {
      var router = { routes: [] },
          mapper = new Cape.RoutingMapper(router)

      expect(() => {
        mapper.one('account', function(m) {
          m.member('address')
        })
      }).to.throw(Error)
    })
  })

  describe('new', () => {
    it('should throw error when it is not used under a resource', () => {
      var router = { routes: [] },
          mapper = new Cape.RoutingMapper(router)

      expect(() => {
        mapper.new('quick')
      }).to.throw(Error)
    })
  })

  describe('view', () => {
    it('should throw error when it is not used under a singular resource', () => {
      var router = { routes: [] },
          mapper = new Cape.RoutingMapper(router)

      expect(() => {
        mapper.many('members', function(m) {
          m.view('info')
        })
      }).to.throw(Error)
    })
  })

  describe('namespace', () => {
    it('should set namespace for routes', () => {
      var router = { routes: [] },
          mapper = new Cape.RoutingMapper(router),
          route

      mapper.namespace('admin', function(m) {
        m.page('hello/:message', 'messages.show')
        m.many('members', function(m) {
          m.many('addresses', { only: 'index' })
          m.one('password', { only: 'show' })
        })
        m.one('account', function(m) {
          m.many('addresses', { only: 'index' })
          m.one('password', { only: 'show' })
        })
      })
      expect(router.routes.length).to.equal(12)

      expect('admin/hello/world').to.match(router.routes[0].regexp)
      expect('admin/members').to.match(router.routes[1].regexp)
      expect('admin/members/new').to.match(router.routes[2].regexp)
      expect('admin/members/123').to.match(router.routes[3].regexp)
      expect('admin/members/123/edit').to.match(router.routes[4].regexp)
      expect('admin/members/123/addresses').to.match(router.routes[5].regexp)
      expect('admin/members/123/password').to.match(router.routes[6].regexp)
      expect('admin/account').to.match(router.routes[7].regexp)
      expect('admin/account/new').to.match(router.routes[8].regexp)
      expect('admin/account/edit').to.match(router.routes[9].regexp)
      expect('admin/account/addresses').to.match(router.routes[10].regexp)
      expect('admin/account/password').to.match(router.routes[11].regexp)
      expect(router.routes[0].namespace).to.equal('admin')
      expect(router.routes[0].resource).to.be.null
      expect(router.routes[0].action).to.be.null
      expect(router.routes[0].container).to.equal('admin.messages')
      expect(router.routes[0].component).to.equal('show')
      expect(router.routes[4].component).to.equal('form')
      expect(router.routes[5].container).to.equal('admin.addresses')
      expect(router.routes[5].component).to.equal('list')
      expect(router.routes[9].component).to.equal('form')
      expect(router.routes[11].container).to.equal('admin.password')
      expect(router.routes[11].component).to.equal('content')
    })

    it('should set nested namespace for routes', () => {
      var router = { routes: [] },
          mapper = new Cape.RoutingMapper(router),
          route

      mapper.namespace('app', function(m) {
        m.namespace('admin', function(m) {
          m.page('hello/:message', 'messages.show')
          m.many('members')
          m.one('account')
        })
      })
      expect(router.routes.length).to.equal(8)

      expect('app/admin/hello/world').to.match(router.routes[0].regexp)
      expect('app/admin/members').to.match(router.routes[1].regexp)
      expect('app/admin/members/new').to.match(router.routes[2].regexp)
      expect('app/admin/members/123').to.match(router.routes[3].regexp)
      expect('app/admin/members/123/edit').to.match(router.routes[4].regexp)
      expect('app/admin/account').to.match(router.routes[5].regexp)
      expect('app/admin/account/new').to.match(router.routes[6].regexp)
      expect('app/admin/account/edit').to.match(router.routes[7].regexp)
      expect(router.routes[4].namespace).to.equal('app/admin')
      expect(router.routes[4].resource).to.equal('members')
      expect(router.routes[4].action).to.equal('edit')
      expect(router.routes[4].container).to.equal('app.admin.members')
      expect(router.routes[4].component).to.equal('form')
    })
  })
})
