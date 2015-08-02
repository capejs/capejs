'use strict';

var Inflector = require('inflected');
var Cape = require('./utilities');

// Cape.CollectionAgent
//
// public properties:
//   resourceName: the name of resource
//   options: the object that holds option values given to the constructor
//   objects: the array of objects that represent the collection of resources
//   headers: the HTTP headers for Ajax requests
//   responseHandler: the function that processes the response object
// options:
//   adapter: the name of adapter (e.g., 'rails'). Default is undefined.
//     Default value can be changed by setting Cape.defaultAgentAdapter property.
//   autoRefresh: a boolean value that controls unsafe Ajax requests trigger
//     this.refresh(). Default is true.
//   dataType: the type of data that you're expecting from the server.
//     The value must be 'json' (default) or 'text'.
//   pathPrefix: the string that is added to the request path. Default value is '/'.
// private properties:
//   _: the object that holds internal methods and properties of this class.
var CollectionAgent = function CollectionAgent(resourceName, options) {
  var adapterName, adapter;

  this.resourceName = resourceName;
  this.options = options || {};
  if (this.options.autoRefresh === undefined) this.options.autoRefresh = true;
  if (this.options.dataType === undefined) this.options.dataType = 'json';
  this.objects = [];
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

CollectionAgent.create = function(resourceName, options) {
  this.instances = this.instances || {};
  var x = new this(resourceName, options)
  if (!this.instances[resourceName])
    this.instances[resourceName] = new this(resourceName, options);
  return this.instances[resourceName];
}

Cape.extend(CollectionAgent.prototype, {
  attach: function(component) {
    var target = component;
    for (var i = 0, len = this._.components.length; i < len; i++) {
      if (this._.components[i] === component) return;
    }
    this._.components.push(component);
  },

  detach: function(component) {
    for (var i = 0, len = this._.components.length; i < len; i++) {
      if (this._.components[i] === component) {
        this._.components.splice(i, 1);
        break;
      }
    }
  },

  propagate: function() {
    for (var i = this._.components.length; i--;)
      this._.components[i].refresh();
  },

  // Fetch current data through the API and refresh this.objects.
  //
  // The default implementation assumes that the request URI has no parameters and
  // the API returns a hash like this:
  //   { users: [ { id: 1, name: 'John' }, { id: 2, name: 'Kate' } ]}
  //
  // Otherwise, this method should be overridden in child classes. For example,
  //   refresh: function() {
  //     var self = this;
  //     var params = { page: this.currentPage, per_page: this.perPage };
  //     this.index(params, function(data) {
  //       self.refreshObjects(data, 'user_list');
  //       self.totalPage = data.total_page;
  //       self.propagate();
  //     })
  //   }
  refresh: function() {
    var self = this;
    this.index({}, function(data) {
      self.refreshObjects(data);
      self.propagate();
    })
  },

  refreshObjects: function(data, paramName) {
    paramName = paramName || Inflector.tableize(this.resourceName);

    this.objects.length = 0;
    if (typeof data === 'object' && Array.isArray(data[paramName])) {
      for (var i = 0; i < data[paramName].length; i++) {
       this.objects.push(data[paramName][i]);
      }
    }
  },

  index: function(params, callback, errorHandler) {
    this.get('', null, params, callback, errorHandler);
  },

  show: function(id, callback, errorHandler) {
    this.get('', id, {}, callback, errorHandler);
  },

  create: function(params, callback, errorHandler) {
    this.post('', null, params, callback, errorHandler);
  },

  update: function(id, params, callback, errorHandler) {
    this.patch('', id, params, callback, errorHandler);
  },

  destroy: function(id, callback, errorHandler) {
    this.delete('', id, {}, callback, errorHandler);
  },

  get: function(actionName, id, params, callback, errorHandler) {
    var path = id ? this.memberPath(id) : this.collectionPath();
    if (actionName !== '') path = path + '/' + actionName;
    this.ajax('GET', path, params, callback, errorHandler);
  },

  post: function(actionName, id, params, callback, errorHandler) {
    var path = id ? this.memberPath(id) : this.collectionPath();
    if (actionName !== '') path = path + '/' + actionName;
    this.ajax('POST', path, params, callback, errorHandler);
  },

  patch: function(actionName, id, params, callback, errorHandler) {
    var path = id ? this.memberPath(id) : this.collectionPath();
    if (actionName !== '') path = path + '/' + actionName;
    this.ajax('PATCH', path, params, callback, errorHandler);
  },

  put: function(actionName, id, params, callback, errorHandler) {
    var path = id ? this.memberPath(id) : this.collectionPath();
    if (actionName !== '') path = path + '/' + actionName;
    this.ajax('PUT', path, params, callback, errorHandler);
  },

  delete: function(actionName, id, params, callback, errorHandler) {
    var path = id ? this.memberPath(id) : this.collectionPath();
    if (actionName !== '') path = path + '/' + actionName;
    this.ajax('DELETE', path, params, callback, errorHandler);
  },

  ajax: function(httpMethod, path, params, callback, errorHandler) {
    var self = this, isSafeMethod, fetchOptions;

    params = params || {};
    errorHandler = errorHandler || this.defaultErrorHandler;

    isSafeMethod = (httpMethod === 'GET' || httpMethod === 'HEAD');
    fetchOptions = {
      method: httpMethod,
      headers: this.headers,
      credentials: 'same-origin'
    }

    if (isSafeMethod) {
      var pairs = [];
      for (var key in params) {
        pairs.push(encodeURIComponent(key) + "=" +
          encodeURIComponent(params[key]));
      }
      if (pairs.length) path = path + '?' + pairs.join('&');
    }
    else {
      fetchOptions.body = JSON.stringify(params)
    }

    fetch(path, fetchOptions)
      .then(this.responseHandler)
      .then(function(data) {
        if (typeof callback === 'function') callback.call(self.client, data);
        if (self.options.autoRefresh && !isSafeMethod) self.refresh();
      })
      .catch(errorHandler);

    return false;
  },

  collectionPath: function() {
    var resources = Inflector.pluralize(Inflector.underscore(this.resourceName));
    return this.pathPrefix() + resources;
  },

  memberPath: function(id) {
    var resources = Inflector.pluralize(Inflector.underscore(this.resourceName));
    return this.pathPrefix() + resources + '/' + id;
  },

  pathPrefix: function() {
    return this.options.pathPrefix || '/';
  },

  defaultErrorHandler: function(ex) {
    console.log(ex)
  }
});

// Internal properties of Cape.CollectionAgent
var _Internal = function _Internal(main) {
  this.main = main;
  this.components = [];
}

module.exports = CollectionAgent;
