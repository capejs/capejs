"use strict";

var ResourceCollectionAgent = require('../resource_collection_agent');

// Cape.RailsCollectionResourceAgent
//
// See Cape.ResourceCollectionAgent for details
function RailsResourceCollectionAgent(resourceName, client, options) {
  ResourceCollectionAgent.call(this, resourceName, client, options);

  var metaElements = document.getElementsByTagName('meta');
  for (var i = metaElements.length - 1; i >= 0; i--) {
    if (metaElements[i].getAttribute('name') === 'csrf-token') {
      this.headers['X-CSRF-Token'] = metaElements[i].getAttribute('content');
      break;
    }
  }
}
RailsResourceCollectionAgent.prototype = Object.create(ResourceCollectionAgent.prototype);
RailsResourceCollectionAgent.prototype.constructor = RailsResourceCollectionAgent;

module.exports = RailsResourceCollectionAgent;
