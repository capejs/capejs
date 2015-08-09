'use strict';

var Inflector = require('inflected');
var Cape = require('./utilities');

// Cape.ResourceAgent
//
// public properties:
//   resourceName: the name of resource
//   client: the object that utilizes this agent
//   basePath: the string that is added to the request path. Default value is '/'.
//   nestedIn: the string that is inserted between path prefix and the resource
//     name. Default value is ''.
//   adapter: the name of adapter (e.g., 'rails'). Default is undefined.
//     Default value can be changed by setting Cape.defaultAgentAdapter property.
//   dataType: the type of data that you're expecting from the server.
//     The value must be 'json', text' or undefined.
//     When the `dataType` option is not defined, the type is detected automatically.
//   singular: a boolean value that specifies if the resource is singular or not.
//     Resources are called 'singular' when they have a URL without ID. Default is false.
//   object: the object that represents the resource
//   errors: the object that holds error messages
//   headers: the HTTP headers for Ajax requests
// private properties:
//   _: the object that holds internal methods and properties of this class.
//
// parameters for the constructor
//   options: an object that is used to initialize properties. The properties
//     which can be initialized by it are `resourceName`, `basePath`,
//     `nestedIn`, `adapter`, `dataType`, and `singular`.
function ResourceAgent(resourceName, client, options) {
  var adapterName, adapter;

  options = options || {};

  this._ = new _Internal(this);
  this.resourceName = resourceName;
  this.client = client;
  this.basePath = options.basePath;
  this.nestedIn = options.nestedIn;
  this.adapter = options.adapter;
  this.dataType = options.dataType;
  this.singular = options.singular || false;

  this.object = undefined;
  this.errors = {};
  this.headers = { 'Content-Type': 'application/json' };
};

Cape.extend(ResourceAgent.prototype, {
  init: function(afterInitialize, errorHandler) {
    var self = this, path;

    if (this.client.id === undefined && !this.singular)
      throw new Error("this.client.id is not defined.");

    path = this.singular ? this.singularPath() : this.memberPath();
    errorHandler = errorHandler || this.defaultErrorHandler;

    this._.applyAdapter();

    fetch(path, {
      headers: this._.headers(),
      credentials: 'same-origin'
    })
    .then(this._.responseHandler())
    .then(function(data) {
      if (typeof data === 'object') self.object = data[self.resourceName];
      if (typeof afterInitialize === 'function') {
        afterInitialize.call(self.client, self, data);
      }
    })
    .catch(errorHandler);
  },

  create: function(afterCreate, errorHandler) {
    var path = this.singular ? this.singularPath() : this.collectionPath();
    this.ajax('POST', path, afterCreate, errorHandler);
    return false;
  },

  update: function(afterUpdate, errorHandler) {
    var path = this.singular ? this.singularPath() : this.memberPath();
    this.ajax('PATCH', path, afterUpdate, errorHandler);
    return false;
  },

  destroy: function(afterDestroy, errorHandler) {
    var path = this.singular ? this.singularPath() : this.memberPath();
    this.ajax('DELETE', path, afterDestroy, errorHandler);
    return false;
  },

  ajax: function(httpMethod, path, callback, errorHandler) {
    var self = this, fetchOptions, params;

    errorHandler = errorHandler || this.defaultErrorHandler;

    this._.applyAdapter();

    fetchOptions = {
      method: httpMethod,
      headers: this._.headers(),
      credentials: 'same-origin'
    }

    if (httpMethod === 'POST' || httpMethod === 'PATCH') {
      params = this.client.paramsFor(this.resourceName);
      fetchOptions.body = JSON.stringify(params);
    }

    fetch(path, fetchOptions)
      .then(this._.responseHandler())
      .then(function(data) { self._.dataHandler(data, callback); })
      .catch(errorHandler);
  },

  collectionPath: function() {
    var resources = Inflector.pluralize(Inflector.underscore(this.resourceName));
    return this._.pathPrefix() + resources;
  },

  memberPath: function() {
    var resources = Inflector.pluralize(Inflector.underscore(this.resourceName));
    return this._.pathPrefix() + resources + '/' + this.client.id;
  },

  singularPath: function() {
    var resource = Inflector.singularize(Inflector.underscore(this.resourceName));
    return this._.pathPrefix() + resource;
  },

  defaultErrorHandler: function(ex) {
    console.log(ex)
  }
});

// Internal properties of Cape.ResourceAgent
var _Internal = function _Internal(main) {
  this.main = main;
}

var AgentCommonInnerMethods = require('./mixins/agent_common_inner_methods');

// Internal methods of Cape.ResourceAgent
Cape.extend(_Internal.prototype, AgentCommonInnerMethods);

module.exports = ResourceAgent;
