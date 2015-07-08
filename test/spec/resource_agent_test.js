describe('ResourceAgent', function() {
  describe('#resourceName, #collectionPath, #memberPath', function() {
    it('should return standard values', function() {
      var UserAgent, form, agent;

      UserAgent = function UserAgent(form) {
        Cape.ResourceAgent.apply(this, arguments);
      }
      Cape.extend(UserAgent.prototype, Cape.ResourceAgent.prototype);

      form = { id: 123 };
      agent = new UserAgent(form);

      expect(agent.resourceName()).to.equal('user');
      expect(agent.collectionPath()).to.equal('/users');
      expect(agent.memberPath()).to.equal('/users/123');
    })

    it('should add prefix to the paths', function() {
      var UserAgent, form, agent;

      UserAgent = function UserAgent(form) {
        Cape.ResourceAgent.apply(this, arguments);
      }
      Cape.extend(UserAgent.prototype, Cape.ResourceAgent.prototype);
      Cape.extend(UserAgent.prototype, {
        pathPrefix: function() {
          return '/api/'
        }
      })

      form = { id: 123 };
      agent = new UserAgent(form);

      expect(agent.resourceName()).to.equal('user');
      expect(agent.collectionPath()).to.equal('/api/users');
      expect(agent.memberPath()).to.equal('/api/users/123');
    })
  })
})
