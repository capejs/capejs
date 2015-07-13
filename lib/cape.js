var Cape = require('./cape/utilities')
Cape.MarkupBuilder = require('./cape/markup_builder')
Cape.Component = require('./cape/component.js')
Cape.DataStore = require('./cape/data_store.js')
Cape.AgentAdapters = {};
Cape.AgentAdapters.RailsAdapter =
  require('./cape/agent_adapters/rails_adapter.js')
Cape.ResourceAgent = require('./cape/resource_agent.js')
Cape.CollectionAgent = require('./cape/collection_agent.js')
Cape.RoutingMapper = require('./cape/routing_mapper.js')
Cape.Router = require('./cape/router.js')

// Default name of adapter fo CollectionAgent and ResourceAgent (e.g. 'rails')
Cape.defaultAgentAdapter = undefined;

module.exports = Cape;
