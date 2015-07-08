// This test script should NOT be included into test/runner.html.
describe('RailsResourceAgent', function() {
  describe('constructor', function() {
    it('should set X-CSRF-Token header', function() {
      var UserAgent, form, agent;

      global.document  = jsdom(
        '<html>' +
        '<head><meta name="csrf-token" content="token"></head>' +
        '<body></body></html>'
      )

      UserAgent = function UserAgent(form) {
        Cape.RailsResourceAgent.apply(this, arguments);
      }
      Cape.extend(UserAgent.prototype, Cape.RailsResourceAgent.prototype);

      form = { id: 123 };
      agent = new UserAgent(form);

      expect(agent.headers['X-CSRF-Token']).to.equal('token');
    })

    it('should not set X-CSRF-Token header', function() {
      var UserAgent, form, agent;

      global.document  = jsdom(
        '<html><head></head><body></body></html>'
      )

      UserAgent = function UserAgent(form) {
        Cape.RailsResourceAgent.apply(this, arguments);
      }
      Cape.extend(UserAgent.prototype, Cape.RailsResourceAgent.prototype);

      form = { id: 123 };
      agent = new UserAgent(form);

      expect(agent.headers['X-CSRF-Token']).to.be.undefined;
    })
  })
})
