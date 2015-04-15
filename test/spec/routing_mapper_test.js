describe('RoutingMapper', function() {
  describe('match', function() {
    it('should add a route to specified component', function() {
      var router = { routes: [] },
          mapper = new Cape.RoutingMapper(router),
          route;

      mapper.match('members/search/:name', 'members#search');
      expect(router.routes.length).to.be(1);

      route = router.routes[0];
      expect('members/search/foo').to.match(route.regexp);
      expect('members/search').not.to.match(route.regexp);
      expect(route.keys.length).to.be(1);
      expect(route.keys[0]).to.be('name');
      expect(route.params.collection).to.be('members');
      expect(route.params.action).to.be('search');
    })

    it('should add a route with constraints', function() {
      var router = { routes: [] },
          mapper = new Cape.RoutingMapper(router),
          route;

      mapper.match('members/:id/edit', 'members#edit', { id: '\\d+' });
      expect(router.routes.length).to.be(1);

      route = router.routes[0];
      expect('members/123/edit').to.match(route.regexp);
      expect('members/foo/edit').not.to.match(route.regexp);
      expect('members/new').not.to.match(route.regexp);
      expect(route.keys.length).to.be(1);
      expect(route.keys[0]).to.be('id');
      expect(route.params.collection).to.be('members');
      expect(route.params.action).to.be('edit');
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
      expect(route.params.collection).to.be('members');

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
      expect(route.params.collection).to.be('members');

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
  })
})
