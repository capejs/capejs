'use strict';

// Cape.AgentAdapters.RailsAdapter
//
// This function is called just before an instance of Cape.ResourceAgent or
// Cape.ResourceCollectionAgent makes an Ajax request.
//
// The purpose of this adapter is to set the X-CSRF-Token header of Ajax requests.
function RailsAdapter(resourceName, client, options) {
  var metaElements = document.getElementsByTagName('meta');
  for (var i = metaElements.length - 1; i >= 0; i--) {
    if (metaElements[i].getAttribute('name') === 'csrf-token') {
      this.headers['X-CSRF-Token'] = metaElements[i].getAttribute('content');
      break;
    }
  }
}

module.exports = RailsAdapter;
