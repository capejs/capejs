"use strict";

var ResourceAgent = require('../resource_agent');

// Cape.RailsResourceAgent
//
// See Cape.ResourceAgent for details
var RailsResourceAgent = function RailsResourceAgent(resourceName, client, options) {
  ResourceAgent.call(this, resourceName, client, options);

  var metaElements = document.getElementsByTagName('meta');
  for (var i = metaElements.length - 1; i >= 0; i--) {
    if (metaElements[i].getAttribute('name') === 'csrf-token') {
      this.headers['X-CSRF-Token'] = metaElements[i].getAttribute('content');
      break;
    }
  }
}
RailsResourceAgent.prototype = Object.create(ResourceAgent.prototype);
RailsResourceAgent.prototype.constructor = RailsResourceAgent;

module.exports = RailsResourceAgent;
