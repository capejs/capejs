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

  describe('resources', function() {
    it('should add four routes', function() {
      var router = { routes: [] },
          mapper = new Cape.RoutingMapper(router),
          route;

      mapper.resources('members');
      expect(router.routes.length).to.be(4);

      route = router.routes[0];
      expect('members').to.match(route.regexp);

      route = router.routes[1];
      expect('members/new').to.match(route.regexp);

      route = router.routes[2];
      expect('members/123').to.match(route.regexp);

      route = router.routes[3];
      expect('members/123/edit').to.match(route.regexp);
    })

    it('should take an action name for "only" option', function() {
      var router = { routes: [] },
          mapper = new Cape.RoutingMapper(router),
          route;

      mapper.resources('members', { only: 'show' });
      expect(router.routes.length).to.be(1);
    })

    it('should take an array of names for "only" option', function() {
      var router = { routes: [] },
          mapper = new Cape.RoutingMapper(router),
          route;

      mapper.resources('members', { only: ['show', 'edit'] });
      expect(router.routes.length).to.be(2);
    })

    it('should take an action name for "except" option', function() {
      var router = { routes: [] },
          mapper = new Cape.RoutingMapper(router),
          route;

      mapper.resources('members', { except: 'new' });
      expect(router.routes.length).to.be(3);
    })

    it('should take an array of names for "except" option', function() {
      var router = { routes: [] },
          mapper = new Cape.RoutingMapper(router),
          route;

      mapper.resources('members', { except: ['show', 'edit'] });
      expect(router.routes.length).to.be(2);
    })

    it('should take a hash for "pathNames" option', function() {
      var router = { routes: [] },
          mapper = new Cape.RoutingMapper(router),
          route;

      mapper.resources('members',
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

      mapper.resources('members', { path: 'players' });
      expect('players').to.match(router.routes[0].regexp);
      expect('players/new').to.match(router.routes[1].regexp);
      expect('players/123').to.match(router.routes[2].regexp);
      expect('players/123/edit').to.match(router.routes[3].regexp);
    })

    it('should define a custom route', function() {
      var router = { routes: [] },
          mapper = new Cape.RoutingMapper(router),
          route;

      mapper.resources('members', { only: [] }, function(m) {
        m.get('list', { on: 'collection' })
        m.get('info', 'address', { on: 'member' })
      });
      expect('members/list').to.match(router.routes[0].regexp);
      expect('members/123/info').to.match(router.routes[1].regexp);
      expect('members/123/address').to.match(router.routes[2].regexp);
      expect(router.routes[0].namespace).to.be('members');
      expect(router.routes[0].component).to.be('list');
    })

    it('should define a nested resource', function() {
      var router = { routes: [] },
          mapper = new Cape.RoutingMapper(router),
          route;

      mapper.resources('members', { only: 'show' }, function(m) {
        m.resources('addresses')
      });
      expect('members/123').to.match(router.routes[0].regexp);
      expect('members/123/addresses').to.match(router.routes[1].regexp);
      expect('members/123/addresses/new').to.match(router.routes[2].regexp);
      expect('members/123/addresses/99').to.match(router.routes[3].regexp);
      expect('members/123/addresses/99/edit').to.match(router.routes[4].regexp);
      expect(router.routes[4].keys[0]).to.be('member_id');
      expect(router.routes[4].keys[1]).to.be('id');
      expect(router.routes[0].namespace).to.be('members');
      expect(router.routes[0].component).to.be('show');
      expect(router.routes[4].namespace).to.be('addresses');
      expect(router.routes[4].component).to.be('edit');
    })
  })

  describe('resource', function() {
    it('should add three routes', function() {
      var router = { routes: [] },
          mapper = new Cape.RoutingMapper(router),
          route;

      mapper.resource('member');
      expect(router.routes.length).to.be(3);

      route = router.routes[0];
      expect('member').to.match(route.regexp);

      route = router.routes[1];
      expect('member/new').to.match(route.regexp);

      route = router.routes[2];
      expect('member/edit').to.match(route.regexp);
    })

    it('should take an action name for "only" option', function() {
      var router = { routes: [] },
          mapper = new Cape.RoutingMapper(router),
          route;

      mapper.resource('member', { only: 'show' });
      expect(router.routes.length).to.be(1);
    })

    it('should take an array of names for "only" option', function() {
      var router = { routes: [] },
          mapper = new Cape.RoutingMapper(router),
          route;

      mapper.resource('member', { only: ['show', 'edit'] });
      expect(router.routes.length).to.be(2);
    })

    it('should take an action name for "except" option', function() {
      var router = { routes: [] },
          mapper = new Cape.RoutingMapper(router),
          route;

      mapper.resource('member', { except: 'new' });
      expect(router.routes.length).to.be(2);
    })

    it('should take an array of names for "except" option', function() {
      var router = { routes: [] },
          mapper = new Cape.RoutingMapper(router),
          route;

      mapper.resource('member', { except: ['show', 'edit'] });
      expect(router.routes.length).to.be(1);
    })

    it('should take a hash for "pathNames" option', function() {
      var router = { routes: [] },
          mapper = new Cape.RoutingMapper(router),
          route;

      mapper.resource('member',
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

      mapper.resource('member', { path: 'player' });
      expect('player').to.match(router.routes[0].regexp);
      expect('player/new').to.match(router.routes[1].regexp);
      expect('player/edit').to.match(router.routes[2].regexp);
    })

    it('should define a custom route', function() {
      var router = { routes: [] },
          mapper = new Cape.RoutingMapper(router),
          route;

      mapper.resource('my_settings', {}, function(m) {
        m.get('phone', 'address')
      });
      expect('my_settings/phone').to.match(router.routes[3].regexp);
      expect('my_settings/address').to.match(router.routes[4].regexp);
      expect(router.routes[3].namespace).to.be('my_settings');
      expect(router.routes[3].component).to.be('phone');
    })

    it('should define a nested resource', function() {
      var router = { routes: [] },
          mapper = new Cape.RoutingMapper(router),
          route;

      mapper.resource('member', { only: 'show' }, function(m) {
        m.resources('addresses')
        m.resource('password', { only: 'show' })
      });
      expect('member').to.match(router.routes[0].regexp);
      expect('member/addresses').to.match(router.routes[1].regexp);
      expect('member/addresses/new').to.match(router.routes[2].regexp);
      expect('member/addresses/99').to.match(router.routes[3].regexp);
      expect('member/addresses/99/edit').to.match(router.routes[4].regexp);
      expect('member/password').to.match(router.routes[5].regexp);
      expect(router.routes[0].namespace).to.be('members');
      expect(router.routes[0].component).to.be('show');
      expect(router.routes[4].keys[0]).to.be('id');
      expect(router.routes[4].namespace).to.be('addresses');
      expect(router.routes[4].component).to.be('edit');
    })
  })

  describe('namespace', function() {
    it('should set namespace for routes', function() {
      var router = { routes: [] },
          mapper = new Cape.RoutingMapper(router),
          route;

      mapper.namespace('admin', function(m) {
        m.page('hello/:message', 'messages.show');
        m.resources('members', function(m) {
          m.resources('addresses', { only: 'index' });
          m.resource('password', { only: 'show' });
        })
        m.resource('account', function(m) {
          m.resources('addresses', { only: 'index' });
          m.resource('password', { only: 'show' });
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
      expect(router.routes[4].component).to.be('edit');
      expect(router.routes[5].namespace).to.be('admin.addresses');
      expect(router.routes[5].component).to.be('index');
      expect(router.routes[9].component).to.be('edit');
      expect(router.routes[11].namespace).to.be('admin.passwords');
      expect(router.routes[11].component).to.be('show');
    })

    it('should set nested namespace for routes', function() {
      var router = { routes: [] },
          mapper = new Cape.RoutingMapper(router),
          route;

      mapper.namespace('app', function(m) {
        m.namespace('admin', function(m) {
          m.page('hello/:message', 'messages.show');
          m.resources('members')
          m.resource('account')
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
      expect(router.routes[4].component).to.be('edit');
    })
  })
})
