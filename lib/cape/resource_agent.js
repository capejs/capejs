"use strict";

var Inflector = require('inflected');
var Cape = require('./utilities');

// Cape.ResourceAgent
//
// public properties:
//   form: the component that utilize this agent
//   object: the object that represents the resource
//   errors: the object that holds error messages
// private properties:
//   _: the object that holds internal methods and properties of this class.
var ResourceAgent = function ResourceAgent(form) {
  this.form = form;
  this.object = {};
  this.errors = {};
  this.headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }

  // Following codes are specific to Ruby on Rails.
  var metaElements = document.getElementsByTagName('meta');
  for (var i = metaElements.length - 1; i >= 0; i--) {
    if (metaElements[i].getAttribute('name') === 'csrf-token') {
      this.headers['X-CSRF-Token'] = metaElements[i].getAttribute('content');
      break;
    }
  }

  this._ = new _Internal(this);
};

Cape.extend(ResourceAgent.prototype, {
  init: function(afterInitialize) {
    var self = this;
    if (this.form.id) {
      fetch(this.memberPath(), {
        credentials: 'same-origin'
      })
      .then(function(response) {
        var json = response.json()
        self.object = json[self.resourceName()];
        if (typeof afterInitialize === 'function') {
          afterInitialize.call(self.form, self);
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
      body: JSON.stringify(this.form.paramsFor(this.resourceName())),
      credentials: 'same-origin'
    })
    .then(function(response) {
      afterCreate.call(self.form, response.json())
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
      body: JSON.stringify(this.form.paramsFor(this.resourceName())),
      credentials: 'same-origin'
    })
    .then(function(response) {
      afterUpdate.call(self.form, response.json());
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
    return this.pathPrefix() + resources + '/' + this.form.id;
  },

  pathPrefix: function() {
    return '/';
  },

  resourceName: function() {
    return Inflector.underscore(
      this.constructor.name.replace(/Agent$/, ''));
  }
});

// Internal properties of Cape.ResourceAgent
var _Internal = function _Internal(main) {
  this.main = main;
}

module.exports = ResourceAgent;
