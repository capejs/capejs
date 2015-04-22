describe('RoutingMapper', function() {
  describe('match', function() {
    it('should add a route to specified component', function() {
      var router = { routes: [] },
          mapper = new Cape.RoutingMapper(router),
          route;

      mapper.page('members/search/:name', 'search');
      expect(router.routes.length).to.equal(1);

      route = router.routes[0];
      expect('members/search/foo').to.match(route.regexp);
      expect('members/search').not.to.match(route.regexp);
      expect(route.keys.length).to.equal(1);
      expect(route.keys[0]).to.equal('name');
      expect(route.namespace).to.equal(null);
      expect(route.component).to.equal('search');
    })

    it('should add a route to namespaced component', function() {
      var router = { routes: [] },
          mapper = new Cape.RoutingMapper(router),
          route;

      mapper.page('members/search/:name', 'members.search');
      expect(router.routes.length).to.equal(1);

      route = router.routes[0];
      expect('members/search/foo').to.match(route.regexp);
      expect('members/search').not.to.match(route.regexp);
      expect(route.keys.length).to.equal(1);
      expect(route.keys[0]).to.equal('name');
    })

    it('should add a route with constraints', function() {
      var router = { routes: [] },
          mapper = new Cape.RoutingMapper(router),
          route;

      mapper.page('members/:id/edit', 'members.edit', { id: '\\d+' });
      expect(router.routes.length).to.equal(1);

      route = router.routes[0];
      expect('members/123/edit').to.match(route.regexp);
      expect('members/foo/edit').not.to.match(route.regexp);
      expect('members/new').not.to.match(route.regexp);
      expect(route.keys.length).to.equal(1);
      expect(route.keys[0]).to.equal('id');
    })

    it('should add a route to deeply namespaced component', function() {
      var router = { routes: [] },
          mapper = new Cape.RoutingMapper(router),
          route;

      mapper.page('admin/members/search/:name', 'app.admin.members.search');
      expect(router.routes.length).to.equal(1);

      route = router.routes[0];
      expect('admin/members/search/foo').to.match(route.regexp);
      expect('admin/members/search').not.to.match(route.regexp);
      expect(route.keys.length).to.equal(1);
      expect(route.keys[0]).to.equal('name');
    })
  })

  describe('root', function() {
    it('should add a route for empty hash', function() {
      var router = { routes: [] },
          mapper = new Cape.RoutingMapper(router),
          route;

      mapper.root('top.index');
      expect(router.routes.length).to.equal(1);

      route = router.routes[0];
      expect('').to.match(route.regexp);
      expect('top/index').not.to.match(route.regexp);
      expect(route.namespace).to.equal('top');
      expect(route.component).to.equal('index');
    })

    it('should add a route for empty hash under a namespace', function() {
      var router = { routes: [] },
          mapper = new Cape.RoutingMapper(router),
          route;

      mapper.namespace('admin', function(m) {
        m.root('top.index');
      })

      expect(router.routes.length).to.equal(1);

      route = router.routes[0];
      expect('admin').to.match(route.regexp);
      expect('').not.to.match(route.regexp);
      expect(route.namespace).to.equal('admin.top');
      expect(route.component).to.equal('index');
    })
  })

  describe('many', function() {
    it('should add four routes', function() {
      var router = { routes: [] },
          mapper = new Cape.RoutingMapper(router),
          route;

      mapper.many('members');
      expect(router.routes.length).to.equal(4);

      route = router.routes[0];
      expect('members').to.match(route.regexp);
      expect(route.component).to.equal('list');

      route = router.routes[1];
      expect('members/new').to.match(route.regexp);
      expect(route.component).to.equal('form');

      route = router.routes[2];
      expect('members/123').to.match(route.regexp);
      expect(route.component).to.equal('item');

      route = router.routes[3];
      expect('members/123/edit').to.match(route.regexp);
      expect(route.component).to.equal('form');
    })

    it('should take an action name for "only" option', function() {
      var router = { routes: [] },
          mapper = new Cape.RoutingMapper(router),
          route;

      mapper.many('members', { only: 'show' });
      expect(router.routes.length).to.equal(1);
    })

    it('should take an array of names for "only" option', function() {
      var router = { routes: [] },
          mapper = new Cape.RoutingMapper(router),
          route;

      mapper.many('members', { only: ['show', 'edit'] });
      expect(router.routes.length).to.equal(2);
    })

    it('should take an action name for "except" option', function() {
      var router = { routes: [] },
          mapper = new Cape.RoutingMapper(router),
          route;

      mapper.many('members', { except: 'new' });
      expect(router.routes.length).to.equal(3);
    })

    it('should take an array of names for "except" option', function() {
      var router = { routes: [] },
          mapper = new Cape.RoutingMapper(router),
          route;

      mapper.many('members', { except: ['show', 'edit'] });
      expect(router.routes.length).to.equal(2);
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
      expect(router.routes[0].namespace).to.equal('members');
      expect(router.routes[0].component).to.equal('special');
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
      expect(router.routes[4].keys[0]).to.equal('member_id');
      expect(router.routes[4].keys[1]).to.equal('id');
      expect(router.routes[0].namespace).to.equal('members');
      expect(router.routes[0].component).to.equal('item');
      expect(router.routes[4].namespace).to.equal('addresses');
      expect(router.routes[4].component).to.equal('form');
    })
  })

  describe('one', function() {
    it('should add three routes', function() {
      var router = { routes: [] },
          mapper = new Cape.RoutingMapper(router),
          route;

      mapper.one('member');
      expect(router.routes.length).to.equal(3);

      route = router.routes[0];
      expect('member').to.match(route.regexp);
      expect(route.namespace).to.equal('member');
      expect(route.component).to.equal('content');

      route = router.routes[1];
      expect('member/new').to.match(route.regexp);
      expect(route.component).to.equal('form');

      route = router.routes[2];
      expect('member/edit').to.match(route.regexp);
      expect(route.component).to.equal('form');
    })

    it('should take an action name for "only" option', function() {
      var router = { routes: [] },
          mapper = new Cape.RoutingMapper(router),
          route;

      mapper.one('member', { only: 'show' });
      expect(router.routes.length).to.equal(1);
    })

    it('should take an array of names for "only" option', function() {
      var router = { routes: [] },
          mapper = new Cape.RoutingMapper(router),
          route;

      mapper.one('member', { only: ['show', 'edit'] });
      expect(router.routes.length).to.equal(2);
    })

    it('should take an action name for "except" option', function() {
      var router = { routes: [] },
          mapper = new Cape.RoutingMapper(router),
          route;

      mapper.one('member', { except: 'new' });
      expect(router.routes.length).to.equal(2);
    })

    it('should take an array of names for "except" option', function() {
      var router = { routes: [] },
          mapper = new Cape.RoutingMapper(router),
          route;

      mapper.one('member', { except: ['show', 'edit'] });
      expect(router.routes.length).to.equal(1);
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
      expect(router.routes[3].namespace).to.equal('my_account');
      expect(router.routes[3].component).to.equal('phone');
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
      expect(router.routes[0].namespace).to.equal('member');
      expect(router.routes[0].component).to.equal('content');
      expect(router.routes[4].keys[0]).to.equal('id');
      expect(router.routes[4].namespace).to.equal('addresses');
      expect(router.routes[4].component).to.equal('form');
    })
  })

  describe('collection', function() {
    it('should throw error when it is not used under a plural resource', function() {
      var router = { routes: [] },
          mapper = new Cape.RoutingMapper(router);

      expect(function() {
        mapper.one('account', function(m) {
          m.collection('emails');
        })
      }).to.throw(Error);
    });
  })

  describe('member', function() {
    it('should throw error when it is not used under a plural resource', function() {
      var router = { routes: [] },
          mapper = new Cape.RoutingMapper(router);

      expect(function() {
        mapper.one('account', function(m) {
          m.member('address');
        })
      }).to.throw(Error);
    });
  })

  describe('new', function() {
    it('should throw error when it is not used under a resource', function() {
      var router = { routes: [] },
          mapper = new Cape.RoutingMapper(router);

      expect(function() {
        mapper.new('quick');
      }).to.throw(Error);
    });
  })

  describe('view', function() {
    it('should throw error when it is not used under a singular resource', function() {
      var router = { routes: [] },
          mapper = new Cape.RoutingMapper(router);

      expect(function() {
        mapper.many('members', function(m) {
          m.view('info');
        })
      }).to.throw(Error);
    });
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
      expect(router.routes.length).to.equal(12);

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
      expect(router.routes[0].namespace).to.equal('admin.messages');
      expect(router.routes[0].component).to.equal('show');
      expect(router.routes[4].component).to.equal('form');
      expect(router.routes[5].namespace).to.equal('admin.addresses');
      expect(router.routes[5].component).to.equal('list');
      expect(router.routes[9].component).to.equal('form');
      expect(router.routes[11].namespace).to.equal('admin.password');
      expect(router.routes[11].component).to.equal('content');
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
      expect(router.routes.length).to.equal(8);

      expect('app/admin/hello/world').to.match(router.routes[0].regexp);
      expect('app/admin/members').to.match(router.routes[1].regexp);
      expect('app/admin/members/new').to.match(router.routes[2].regexp);
      expect('app/admin/members/123').to.match(router.routes[3].regexp);
      expect('app/admin/members/123/edit').to.match(router.routes[4].regexp);
      expect('app/admin/account').to.match(router.routes[5].regexp);
      expect('app/admin/account/new').to.match(router.routes[6].regexp);
      expect('app/admin/account/edit').to.match(router.routes[7].regexp);
      expect(router.routes[4].namespace).to.equal('app.admin.members');
      expect(router.routes[4].component).to.equal('form');
    })
  })
})
