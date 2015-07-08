"use strict";

var Inflector = require('inflected');
var Cape = require('./utilities');

// Cape.ResourceAgent
//
// public properties:
//   user: the component that utilize this agent
//   options: the object that holds option values given to the constructor
//   object: the object that represents the resource
//   errors: the object that holds error messages
// private properties:
//   _: the object that holds internal methods and properties of this class.
var ResourceAgent = function ResourceAgent(user, options) {
  this.user = user;
  this.options = options || {};
  this.object = undefined;
  this.errors = {};
  this.headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
  this._ = new _Internal(this);
};

Cape.extend(ResourceAgent.prototype, {
  init: function(afterInitialize) {
    var self = this;
    if (this.user.id) {
      fetch(this.memberPath(), {
        credentials: 'same-origin'
      })
      .then(function(response) {
        return response.json()
      })
      .then(function(json) {
        self.object = json[self.resourceName()];
        if (typeof afterInitialize === 'function') {
          afterInitialize.call(self.user, self);
        }
      })
      .catch(function(ex) {
        console.log(ex);
      });
    }
  },

  create: function(afterCreate) {
    if (typeof afterCreate !== 'function') {
      throw new Error("The first argument must be a function.");
    }

    var self = this;
    fetch(this.collectionPath(), {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(this.user.paramsFor(this.resourceName())),
      credentials: 'same-origin'
    })
    .then(function(response) {
      return response.json()
    })
    .then(function(json) {
      afterCreate.call(self.user, json)
    })
    .catch(function(ex) {
      console.log(ex)
    });

    return false;
  },

  update: function(afterUpdate) {
    if (typeof afterUpdate !== 'function') {
      throw new Error("The first argument must be a function.");
    }

    var self = this;
    fetch(this.memberPath(), {
      method: 'PATCH',
      headers: this.headers,
      body: JSON.stringify(this.user.paramsFor(this.resourceName())),
      credentials: 'same-origin'
    })
    .then(function(response) {
      return response.json()
    })
    .then(function(json) {
      afterUpdate.call(self.user, json);
    })
    .catch(function(ex) {
      console.log(ex)
    });

    return false;
  },

  destroy: function(afterDestroy) {
    if (typeof afterDestroy !== 'function') {
      throw new Error("The first argument must be a function.");
    }

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
      afterDestroy.call(self.user, json);
    })
    .catch(function(ex) {
      console.log(ex)
    });

    return false;
  },

  collectionPath: function() {
    var resources = Inflector.pluralize(this.resourceName());
    return this.pathPrefix() + resources;
  },

  memberPath: function() {
    var resources = Inflector.pluralize(this.resourceName());
    return this.pathPrefix() + resources + '/' + this.user.id;
  },

  pathPrefix: function() {
    return '/';
  },

  resourceName: function() {
    if (this.constructor.toString().match(/^function (\w+)Agent\(/)) {
      return Inflector.underscore(RegExp.$1)
    }
    else {
      throw new Error('The class name must end with "Agent".')
    }
  }
});

// Internal properties of Cape.ResourceAgent
var _Internal = function _Internal(main) {
  this.main = main;
}

module.exports = ResourceAgent;
