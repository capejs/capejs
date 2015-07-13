"use strict";

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
// private properties:
//   _: the object that holds internal methods and properties of this class.
function ResourceAgent(resourceName, client, options) {
  var adapterName, adapter;

  if (client.id === undefined)
    throw new Error("The second argument should have a value for the 'id' attribute.");

  this.resourceName = resourceName;
  this.client = client;
  this.options = options || {};
  this.object = undefined;
  this.errors = {};
  this.headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  };
  this._ = new _Internal(this);

  adapterName = this.options.adapter || Cape.defaultAgentAdapter;
  if (typeof adapterName === 'string') {
    adapter = Cape.AgentAdapters[Inflector.camelize(adapterName) + 'Adapter'];
    if (typeof adapter === 'function') adapter.apply(this, arguments);
  }
};

Cape.extend(ResourceAgent.prototype, {
  init: function(afterInitialize, errorHandler) {
    var self = this;

    errorHandler = errorHandler || this.defaultErrorHandler;

    fetch(this.memberPath(), {
      credentials: 'same-origin'
    })
    .then(function(response) {
      return response.json()
    })
    .then(function(json) {
      self.object = json[self.resourceName];
      if (typeof afterInitialize === 'function') {
        afterInitialize.call(self.client, self);
      }
    })
    .catch(errorHandler);
  },

  update: function(afterUpdate, errorHandler) {
    if (typeof afterUpdate !== 'function') {
      throw new Error("The first argument must be a function.");
    }

    errorHandler = errorHandler || this.defaultErrorHandler;

    var self = this;
    fetch(this.memberPath(), {
      method: 'PATCH',
      headers: this.headers,
      body: JSON.stringify(this.client.paramsFor(this.resourceName)),
      credentials: 'same-origin'
    })
    .then(function(response) {
      return response.json()
    })
    .then(function(json) {
      afterUpdate.call(self.client, json);
    })
    .catch(errorHandler);

    return false;
  },

  destroy: function(afterDestroy, errorHandler) {
    if (typeof afterDestroy !== 'function') {
      throw new Error("The first argument must be a function.");
    }

    errorHandler = errorHandler || this.defaultErrorHandler;

    var self = this;
    fetch(this.memberPath(), {
      method: 'DELETE',
      headers: this.headers,
      credentials: 'same-origin'
    })
    .then(function(response) {
      return response.json()
    })
    .then(function(json) {
      afterDestroy.call(self.client, json);
    })
    .catch(errorHandler);

    return false;
  },

  memberPath: function() {
    var resources = Inflector.pluralize(Inflector.underscore(this.resourceName));
    return this.pathPrefix() + resources + '/' + this.client.id;
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
