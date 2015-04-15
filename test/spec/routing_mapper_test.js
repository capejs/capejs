describe('RoutingMapper', function() {
  describe('hash', function() {
    it('should add a route to specified component', function() {
      var router = { routes: [] },
          mapper = new Cape.RoutingMapper(router),
          route;

      mapper.hash('members/search/:name', 'members#search');
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

      mapper.hash('members/:id/edit', 'members#edit', { id: '\\d+' });
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
})
