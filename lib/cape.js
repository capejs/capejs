var Cape = require('./cape/utilities')
Cape.MarkupBuilder = require('./cape/markup_builder')
Cape.Component = require('./cape/component.js')
Cape.DataStore = require('./cape/data_store.js')
Cape.ResourceAgent = require('./cape/resource_agent.js')
Cape.RailsResourceAgent = require('./cape/resource_agents/rails_resource_agent.js')
Cape.ResourceCollectionAgent = require('./cape/resource_collection_agent.js')
Cape.RailsResourceCollectionAgent =
  require('./cape/resource_agents/rails_resource_collection_agent.js')
Cape.RoutingMapper = require('./cape/routing_mapper.js')
Cape.Router = require('./cape/router.js')
module.exports = Cape;
