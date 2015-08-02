'use strict';

var Inflector = require('inflected');
var Cape = require('./utilities');

// Cape.ResourceAgent
//
// public properties:
//   resourceName: the name of resource
//   client: the object that utilizes this agent
//   options: the object that holds option values given to the constructor
//   object: the object that represents the resource
//   errors: the object that holds error messages
//   headers: the HTTP headers for Ajax requests
//   responseHandler: the function that processes the response object
// options:
//   adapter: the name of adapter (e.g., 'rails'). Default is undefined.
//     Default value can be changed by setting Cape.defaultAgentAdapter property.
//   dataType: the type of data that you're expecting from the server.
//     The value must be 'json' (default) or 'text'.
//   pathPrefix: the string that is added to the request path. Default value is '/'.
//   singular: a boolean value that specifies if the resource is singular or not.
//     Resources are called 'singular' when they have a URL without ID. Default is false.
// private properties:
//   _: the object that holds internal methods and properties of this class.
function ResourceAgent(resourceName, client, options) {
  var adapterName, adapter;

  this.resourceName = resourceName;
  this.client = client;
  this.options = options || {};
  if (this.options.dataType === undefined) this.options.dataType = 'json';
  this.object = undefined;
  this.errors = {};
  this.headers = {
    'Content-Type': 'application/json'
  };
  if (this.options.dataType === 'json') {
    this.headers['Accept'] = 'application/json';
    this.responseHandler = function(response) { return response.json() };
  }
  else if (this.options.dataType === 'text') {
    this.headers['Accept'] = 'text/plain';
    this.responseHandler = function(response) { return response.text() };
  }
  else {
    throw new Error('Unsupported data type: ' + this.options.dataType);
  }

  this._ = new _Internal(this);

  adapterName = this.options.adapter || Cape.defaultAgentAdapter;
  if (typeof adapterName === 'string') {
    adapter = Cape.AgentAdapters[Inflector.camelize(adapterName) + 'Adapter'];
    if (typeof adapter === 'function') adapter.apply(this, arguments);
  }
};

Cape.extend(ResourceAgent.prototype, {
  init: function(afterInitialize, errorHandler) {
    var self = this, path;

    if (this.client.id === undefined && !this.options.singular)
      throw new Error("this.client.id is not defined.");

    path = this.options.singular ? this.singularPath() : this.memberPath();
    errorHandler = errorHandler || this.defaultErrorHandler;

    fetch(path, {
      headers: this.headers,
      credentials: 'same-origin'
    })
    .then(this.responseHandler)
    .then(function(data) {
      if (typeof data === 'object') self.object = data[self.resourceName];
      if (typeof afterInitialize === 'function') {
        afterInitialize.call(self.client, self, data);
      }
    })
    .catch(errorHandler);
  },

  create: function(afterCreate, errorHandler) {
    var path = this.options.singular ? this.singularPath() : this.collectionPath();
    this.ajax('POST', path, afterCreate, errorHandler);
    return false;
  },

  update: function(afterUpdate, errorHandler) {
    var path = this.options.singular ? this.singularPath() : this.memberPath();
    this.ajax('PATCH', path, afterUpdate, errorHandler);
    return false;
  },

  destroy: function(afterDestroy, errorHandler) {
    var path = this.options.singular ? this.singularPath() : this.memberPath();
    this.ajax('DELETE', path, afterDestroy, errorHandler);
    return false;
  },

  ajax: function(httpMethod, path, callback, errorHandler) {
    var self = this, fetchOptions, params;

    errorHandler = errorHandler || this.defaultErrorHandler;

    fetchOptions = {
      method: httpMethod,
      headers: this.headers,
      credentials: 'same-origin'
    }

    if (httpMethod === 'POST' || httpMethod === 'PATCH') {
      params = this.client.paramsFor(this.resourceName);
      fetchOptions.body = JSON.stringify(params);
    }

    fetch(path, fetchOptions)
      .then(this.responseHandler)
      .then(function(data) {
        if (typeof callback === 'function') callback.call(self.client, data);
      })
      .catch(errorHandler);
  },

  collectionPath: function() {
    var resources = Inflector.pluralize(Inflector.underscore(this.resourceName));
    return this.pathPrefix() + resources;
  },

  memberPath: function() {
    var resources = Inflector.pluralize(Inflector.underscore(this.resourceName));
    return this.pathPrefix() + resources + '/' + this.client.id;
  },

  singularPath: function() {
    var resource = Inflector.singularize(Inflector.underscore(this.resourceName));
    return this.pathPrefix() + resource;
  },

  pathPrefix: function() {
    return this.options.pathPrefix || '/';
  },

  defaultErrorHandler: function(ex) {
    console.log(ex)
  }
});

// Internal properties of Cape.ResourceAgent
var _Internal = function _Internal(main) {
  this.main = main;
}

module.exports = ResourceAgent;
