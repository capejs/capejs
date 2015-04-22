describe('RoutingMapper', function() {
  describe('match', function() {
    it('should add a route to specified component', function() {
      var router = { routes: [] },
          mapper = new Cape.RoutingMapper(router),
          route;

      mapper.page('members/search/:name', 'search');
      expect(router.routes.length).to.be(1);

      route = router.routes[0];
      expect('members/search/foo').to.match(route.regexp);
      expect('members/search').not.to.match(route.regexp);
      expect(route.keys.length).to.be(1);
      expect(route.keys[0]).to.be('name');
      expect(route.namespace).to.be(null);
      expect(route.component).to.be('search');
    })

    it('should add a route to namespaced component', function() {
      var router = { routes: [] },
          mapper = new Cape.RoutingMapper(router),
          route;

      mapper.page('members/search/:name', 'members.search');
      expect(router.routes.length).to.be(1);

      route = router.routes[0];
      expect('members/search/foo').to.match(route.regexp);
      expect('members/search').not.to.match(route.regexp);
      expect(route.keys.length).to.be(1);
      expect(route.keys[0]).to.be('name');
    })

    it('should add a route with constraints', function() {
      var router = { routes: [] },
          mapper = new Cape.RoutingMapper(router),
          route;

      mapper.page('members/:id/edit', 'members.edit', { id: '\\d+' });
      expect(router.routes.length).to.be(1);

      route = router.routes[0];
      expect('members/123/edit').to.match(route.regexp);
      expect('members/foo/edit').not.to.match(route.regexp);
      expect('members/new').not.to.match(route.regexp);
      expect(route.keys.length).to.be(1);
      expect(route.keys[0]).to.be('id');
    })

    it('should add a route to deeply namespaced component', function() {
      var router = { routes: [] },
          mapper = new Cape.RoutingMapper(router),
          route;

      mapper.page('admin/members/search/:name', 'app.admin.members.search');
      expect(router.routes.length).to.be(1);

      route = router.routes[0];
      expect('admin/members/search/foo').to.match(route.regexp);
      expect('admin/members/search').not.to.match(route.regexp);
      expect(route.keys.length).to.be(1);
      expect(route.keys[0]).to.be('name');
    })
  })

  describe('root', function() {
    it('should add a route for empty hash', function() {
      var router = { routes: [] },
          mapper = new Cape.RoutingMapper(router),
          route;

      mapper.root('top.index');
      expect(router.routes.length).to.be(1);

      route = router.routes[0];
      expect('').to.match(route.regexp);
      expect('top/index').not.to.match(route.regexp);
      expect(route.namespace).to.be('top');
      expect(route.component).to.be('index');
    })

    it('should add a route for empty hash under a namespace', function() {
      var router = { routes: [] },
          mapper = new Cape.RoutingMapper(router),
          route;

      mapper.namespace('admin', function(m) {
        m.root('top.index');
      })

      expect(router.routes.length).to.be(1);

      route = router.routes[0];
      expect('admin').to.match(route.regexp);
      expect('').not.to.match(route.regexp);
      expect(route.namespace).to.be('admin.top');
      expect(route.component).to.be('index');
    })
  })

  describe('many', function() {
    it('should add four routes', function() {
      var router = { routes: [] },
          mapper = new Cape.RoutingMapper(router),
          route;

      mapper.many('members');
      expect(router.routes.length).to.be(4);

      route = router.routes[0];
      expect('members').to.match(route.regexp);
      expect(route.component).to.be('list');

      route = router.routes[1];
      expect('members/new').to.match(route.regexp);
      expect(route.component).to.be('form');

      route = router.routes[2];
      expect('members/123').to.match(route.regexp);
      expect(route.component).to.be('item');

      route = router.routes[3];
      expect('members/123/edit').to.match(route.regexp);
      expect(route.component).to.be('form');
    })

    it('should take an action name for "only" option', function() {
      var router = { routes: [] },
          mapper = new Cape.RoutingMapper(router),
          route;

      mapper.many('members', { only: 'show' });
      expect(router.routes.length).to.be(1);
    })

    it('should take an array of names for "only" option', function() {
      var router = { routes: [] },
          mapper = new Cape.RoutingMapper(router),
          route;

      mapper.many('members', { only: ['show', 'edit'] });
      expect(router.routes.length).to.be(2);
    })

    it('should take an action name for "except" option', function() {
      var router = { routes: [] },
          mapper = new Cape.RoutingMapper(router),
          route;

      mapper.many('members', { except: 'new' });
      expect(router.routes.length).to.be(3);
    })

    it('should take an array of names for "except" option', function() {
      var router = { routes: [] },
          mapper = new Cape.RoutingMapper(router),
          route;

      mapper.many('members', { except: ['show', 'edit'] });
      expect(router.routes.length).to.be(2);
    })

    it('should take a hash for "pathNames" option', function() {
      var router = { routes: [] },
          mapper = new Cape.RoutingMapper(router),
          route;

      mapper.many('members',
        { pathNames: { new: 'add', edit: 'modify' } });
      route = router.routes[1];
      expect('members/add').to.match(route.regexp);
      route = router.routes[3];
      expect('members/123/modify').to.match(route.regexp);
    })

    it('should take a string for "path" option', function() {
      var router = { routes: [] },
          mapper = new Cape.RoutingMapper(router),
          route;

      mapper.many('members', { path: 'players' });
      expect('players').to.match(router.routes[0].regexp);
      expect('players/new').to.match(router.routes[1].regexp);
      expect('players/123').to.match(router.routes[2].regexp);
      expect('players/123/edit').to.match(router.routes[3].regexp);
    })

    it('should define a custom route', function() {
      var router = { routes: [] },
          mapper = new Cape.RoutingMapper(router),
          route;

      mapper.many('members', { only: [] }, function(m) {
        m.collection('special')
        m.member('info', 'address')
        m.new('quick');
      });
      expect('members/special').to.match(router.routes[0].regexp);
      expect('members/123/info').to.match(router.routes[1].regexp);
      expect('members/123/address').to.match(router.routes[2].regexp);
      expect('members/new/quick').to.match(router.routes[3].regexp);
      expect(router.routes[0].namespace).to.be('members');
      expect(router.routes[0].component).to.be('special');
    })

    it('should define a nested resource', function() {
      var router = { routes: [] },
          mapper = new Cape.RoutingMapper(router),
          route;

      mapper.many('members', { only: 'show' }, function(m) {
        m.many('addresses')
      });
      expect('members/123').to.match(router.routes[0].regexp);
      expect('members/123/addresses').to.match(router.routes[1].regexp);
      expect('members/123/addresses/new').to.match(router.routes[2].regexp);
      expect('members/123/addresses/99').to.match(router.routes[3].regexp);
      expect('members/123/addresses/99/edit').to.match(router.routes[4].regexp);
      expect(router.routes[4].keys[0]).to.be('member_id');
      expect(router.routes[4].keys[1]).to.be('id');
      expect(router.routes[0].namespace).to.be('members');
      expect(router.routes[0].component).to.be('item');
      expect(router.routes[4].namespace).to.be('addresses');
      expect(router.routes[4].component).to.be('form');
    })
  })

  describe('one', function() {
    it('should add three routes', function() {
      var router = { routes: [] },
          mapper = new Cape.RoutingMapper(router),
          route;

      mapper.one('member');
      expect(router.routes.length).to.be(3);

      route = router.routes[0];
      expect('member').to.match(route.regexp);
      expect(route.component).to.be('item');

      route = router.routes[1];
      expect('member/new').to.match(route.regexp);
      expect(route.component).to.be('form');

      route = router.routes[2];
      expect('member/edit').to.match(route.regexp);
      expect(route.component).to.be('form');
    })

    it('should take an action name for "only" option', function() {
      var router = { routes: [] },
          mapper = new Cape.RoutingMapper(router),
          route;

      mapper.one('member', { only: 'show' });
      expect(router.routes.length).to.be(1);
    })

    it('should take an array of names for "only" option', function() {
      var router = { routes: [] },
          mapper = new Cape.RoutingMapper(router),
          route;

      mapper.one('member', { only: ['show', 'edit'] });
      expect(router.routes.length).to.be(2);
    })

    it('should take an action name for "except" option', function() {
      var router = { routes: [] },
          mapper = new Cape.RoutingMapper(router),
          route;

      mapper.one('member', { except: 'new' });
      expect(router.routes.length).to.be(2);
    })

    it('should take an array of names for "except" option', function() {
      var router = { routes: [] },
          mapper = new Cape.RoutingMapper(router),
          route;

      mapper.one('member', { except: ['show', 'edit'] });
      expect(router.routes.length).to.be(1);
    })

    it('should take a hash for "pathNames" option', function() {
      var router = { routes: [] },
          mapper = new Cape.RoutingMapper(router),
          route;

      mapper.one('member',
        { pathNames: { new: 'add', edit: 'modify' } });
      route = router.routes[1];
      expect('member/add').to.match(route.regexp);
      route = router.routes[2];
      expect('member/modify').to.match(route.regexp);
    })

    it('should take a string for "path" option', function() {
      var router = { routes: [] },
          mapper = new Cape.RoutingMapper(router),
          route;

      mapper.one('member', { path: 'player' });
      expect('player').to.match(router.routes[0].regexp);
      expect('player/new').to.match(router.routes[1].regexp);
      expect('player/edit').to.match(router.routes[2].regexp);
    })

    it('should define a custom route', function() {
      var router = { routes: [] },
          mapper = new Cape.RoutingMapper(router),
          route;

      mapper.one('my_account', function(m) {
        m.view('phone', 'address');
        m.new('quick');
      });
      expect('my_account/phone').to.match(router.routes[3].regexp);
      expect('my_account/address').to.match(router.routes[4].regexp);
      expect('my_account/new/quick').to.match(router.routes[5].regexp);
      expect(router.routes[3].namespace).to.be('my_account');
      expect(router.routes[3].component).to.be('phone');
    })

    it('should define a nested resource', function() {
      var router = { routes: [] },
          mapper = new Cape.RoutingMapper(router),
          route;

      mapper.one('member', { only: 'show' }, function(m) {
        m.many('addresses')
        m.one('password', { only: 'show' })
      });
      expect('member').to.match(router.routes[0].regexp);
      expect('member/addresses').to.match(router.routes[1].regexp);
      expect('member/addresses/new').to.match(router.routes[2].regexp);
      expect('member/addresses/99').to.match(router.routes[3].regexp);
      expect('member/addresses/99/edit').to.match(router.routes[4].regexp);
      expect('member/password').to.match(router.routes[5].regexp);
      expect(router.routes[0].namespace).to.be('members');
      expect(router.routes[0].component).to.be('item');
      expect(router.routes[4].keys[0]).to.be('id');
      expect(router.routes[4].namespace).to.be('addresses');
      expect(router.routes[4].component).to.be('form');
    })
  })

  describe('namespace', function() {
    it('should set namespace for routes', function() {
      var router = { routes: [] },
          mapper = new Cape.RoutingMapper(router),
          route;

      mapper.namespace('admin', function(m) {
        m.page('hello/:message', 'messages.show');
        m.many('members', function(m) {
          m.many('addresses', { only: 'index' });
          m.one('password', { only: 'show' });
        })
        m.one('account', function(m) {
          m.many('addresses', { only: 'index' });
          m.one('password', { only: 'show' });
        })
      })
      expect(router.routes.length).to.be(12);

      expect('admin/hello/world').to.match(router.routes[0].regexp);
      expect('admin/members').to.match(router.routes[1].regexp);
      expect('admin/members/new').to.match(router.routes[2].regexp);
      expect('admin/members/123').to.match(router.routes[3].regexp);
      expect('admin/members/123/edit').to.match(router.routes[4].regexp);
      expect('admin/members/123/addresses').to.match(router.routes[5].regexp);
      expect('admin/members/123/password').to.match(router.routes[6].regexp);
      expect('admin/account').to.match(router.routes[7].regexp);
      expect('admin/account/new').to.match(router.routes[8].regexp);
      expect('admin/account/edit').to.match(router.routes[9].regexp);
      expect('admin/account/addresses').to.match(router.routes[10].regexp);
      expect('admin/account/password').to.match(router.routes[11].regexp);
      expect(router.routes[0].namespace).to.be('admin.messages');
      expect(router.routes[0].component).to.be('show');
      expect(router.routes[4].component).to.be('form');
      expect(router.routes[5].namespace).to.be('admin.addresses');
      expect(router.routes[5].component).to.be('list');
      expect(router.routes[9].component).to.be('form');
      expect(router.routes[11].namespace).to.be('admin.passwords');
      expect(router.routes[11].component).to.be('item');
    })

    it('should set nested namespace for routes', function() {
      var router = { routes: [] },
          mapper = new Cape.RoutingMapper(router),
          route;

      mapper.namespace('app', function(m) {
        m.namespace('admin', function(m) {
          m.page('hello/:message', 'messages.show');
          m.many('members')
          m.one('account')
        })
      })
      expect(router.routes.length).to.be(8);

      expect('app/admin/hello/world').to.match(router.routes[0].regexp);
      expect('app/admin/members').to.match(router.routes[1].regexp);
      expect('app/admin/members/new').to.match(router.routes[2].regexp);
      expect('app/admin/members/123').to.match(router.routes[3].regexp);
      expect('app/admin/members/123/edit').to.match(router.routes[4].regexp);
      expect('app/admin/account').to.match(router.routes[5].regexp);
      expect('app/admin/account/new').to.match(router.routes[6].regexp);
      expect('app/admin/account/edit').to.match(router.routes[7].regexp);
      expect(router.routes[4].namespace).to.be('app.admin.members');
      expect(router.routes[4].component).to.be('form');
    })
  })
})
