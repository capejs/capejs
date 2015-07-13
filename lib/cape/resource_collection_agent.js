"use strict";

var Inflector = require('inflected');
var Cape = require('./utilities');

// Cape.ResourceCollectionAgent
//
// public properties:
//   resourceName: the name of resource
//   client: the object that utilizes this agent
//   options: the object that holds option values given to the constructor
//   objects: the array of objects that represent the resource collection
//   errors: the object that holds error messages
// private properties:
//   _: the object that holds internal methods and properties of this class.
function ResourceCollectionAgent(resourceName, client, options) {
  this.resourceName = resourceName;
  this.client = client;
  this.options = options || {};
  this.objects = [];
  this.errors = {};
  this.headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
  this._ = new _Internal(this);
};

Cape.extend(ResourceCollectionAgent.prototype, {
  init: function(afterInitialize, errorHandler) {
    var self = this, url;

    url = this.collectionPath();
    if (typeof this.options.params === 'object') {
      var pairs = [];
      for (var key in this.options.params) {
        pairs.push(encodeURIComponent(key) + "=" +
          encodeURIComponent(this.options.params[key]));
      }
      if (pairs.length) url = url + '?' + pairs.join('&');
    }

    errorHandler = errorHandler || this.defaultErrorHandler;

    fetch(url, { credentials: 'same-origin' })
    .then(function(response) {
      return response.json()
    })
    .then(function(json) {
      var resources = Inflector.pluralize(self.resourceName);
      self.objects.length = 0
      if (Array.isArray(json[resources])) {
        for (let i = 0; i < json[resources].length; i++) {
          self.objects.push(json[resources][i])
        }
      }
      if (typeof afterInitialize === 'function') {
        afterInitialize.call(self.client, self, json);
      }
    })
    .catch(errorHandler);
  },

  create: function(afterCreate, errorHandler) {
    if (typeof afterCreate !== 'function') {
      throw new Error("The first argument must be a function.");
    }

    errorHandler = errorHandler || this.defaultErrorHandler;

    var self = this;
    fetch(this.collectionPath(), {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(this.client.paramsFor(this.resourceName)),
      credentials: 'same-origin'
    })
    .then(function(response) {
      return response.json()
    })
    .then(function(json) {
      afterCreate.call(self.client, json)
    })
    .catch(errorHandler);

    return false;
  },

  collectionPath: function() {
    var resources = Inflector.pluralize(this.resourceName);
    return this.pathPrefix() + resources;
  },

  pathPrefix: function() {
    return this.options.pathPrefix || '/';
  },

  defaultErrorHandler: function(ex) {
    console.log(ex)
  }
});

// Internal properties of Cape.ResourceCollectionAgent
var _Internal = function _Internal(main) {
  this.main = main;
}

module.exports = ResourceCollectionAgent;
