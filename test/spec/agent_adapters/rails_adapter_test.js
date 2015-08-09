'use strict';

// This test script should NOT be included into test/runner.html.
describe('AgentAdapters.RailsAdapter', function() {
  describe('constructor', function() {
    it('should set X-CSRF-Token header', function() {
      var form, options, agent;

      global.document  = jsdom(
        '<html>' +
        '<head><meta name="csrf-token" content="token"></head>' +
        '<body></body></html>'
      )

      form = { id: 123 };
      options = { resourceName: 'user', adapter: 'rails' };
      agent = new Cape.ResourceAgent(form, options);
      agent._.applyAdapter();

      expect(agent.headers['X-CSRF-Token']).to.equal('token');
    })

    it('should not set X-CSRF-Token header', function() {
      var form, options, agent;

      global.document  = jsdom(
        '<html><head></head><body></body></html>'
      )

      form = { id: 123 };
      options = { resourceName: 'user', adapter: 'rails' };
      agent = new Cape.ResourceAgent(form, options);
      agent._.applyAdapter();

      expect(agent.headers['X-CSRF-Token']).to.be.undefined;
    })
  })
})
