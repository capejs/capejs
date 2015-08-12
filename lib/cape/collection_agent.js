'use strict';

var Inflector = require('inflected');
var Cape = require('./utilities');

// Cape.CollectionAgent
//
// public properties:
//   resourceName: the name of resource
//   basePath: the string that is added to the request path. Default value is '/'.
//   nestedIn: the string that is inserted between path prefix and the resource
//     name. Default value is ''.
//   adapter: the name of adapter (e.g., 'rails'). Default is undefined.
//     Default value can be changed by setting Cape.defaultAgentAdapter property.
//   autoRefresh: a boolean value that controls unsafe Ajax requests trigger
//     this.refresh(). Default is true.
//   dataType: the type of data that you're expecting from the server.
//     The value must be 'json', 'text' or undefined. Default is undefiend.
//     When the `dataType` option is not defined, the type is detected automatically.
//   paramName: the name of parameter to be used when the `objects`
//     property is initialized and refreshed. Default is undefiend.
//     When the `paramName` option is not defined, the name is derived from the
//     `resourceName` property, e.g. `user` if the resource name is `users`.
//   objects: the array of objects that represent the collection of resources
//   headers: the HTTP headers for Ajax requests
// private properties:
//   _: the object that holds internal methods and properties of this class.
//
// parameters for the constructor
//   options: an object that is used to initialize properties. The properties
//     which can be initialized by it are `resourceName`, `basePath`,
//     `nestedIn`, `adapter`, `autoRefresh`, `dataType`, and `paramName`.
//
var CollectionAgent = function CollectionAgent(options) {
  this._ = new _Internal(this);
  this.init(options);

  this.objects = [];
  this.headers = { 'Content-Type': 'application/json' };
};

CollectionAgent.create = function(options) {
  options = options || {};
  var key = options.basePath || '/';
  if (options.nestedIn) key = key + options.nestedIn;
  if (options.resourceName) key = key + options.resourceName;
  this.instances = this.instances || {};
  if (!this.instances[key]) this.instances[key] = new this(options);
  return this.instances[key];
}

var PropagatorMethods = require('./mixins/propagator_methods');
Cape.extend(CollectionAgent.prototype, PropagatorMethods);

Cape.extend(CollectionAgent.prototype, {
  init: function(options) {
    options = options || {};
    this.resourceName = options.resourceName;
    this.basePath = options.basePath;
    this.nestedIn = options.nestedIn;
    this.adapter = options.adapter;
    this.autoRefresh = options.autoRefresh;
    if (this.autoRefresh === undefined) this.autoRefresh = true;
    this.dataType = options.dataType;
    this.paramName = options.paramName;
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
  //       self.refreshObjects(data);
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

  refreshObjects: function(data) {
    var paramName = this.paramName || Inflector.tableize(this.resourceName);

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

    this._.applyAdapter();

    isSafeMethod = (httpMethod === 'GET' || httpMethod === 'HEAD');
    fetchOptions = {
      method: httpMethod,
      headers: this._.headers(),
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
      .then(this._.responseHandler())
      .then(function(data) {
        self._.dataHandler(data, callback);
        if (self.autoRefresh && !isSafeMethod) self.refresh();
      })
      .catch(errorHandler);

    return false;
  },

  collectionPath: function() {
    var resources = Inflector.pluralize(Inflector.underscore(this.resourceName));
    return this._.pathPrefix() + resources;
  },

  memberPath: function(id) {
    var resources = Inflector.pluralize(Inflector.underscore(this.resourceName));
    return this._.pathPrefix() + resources + '/' + id;
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

var AgentCommonInnerMethods = require('./mixins/agent_common_inner_methods');

// Internal methods of Cape.CollectionAgent
Cape.extend(_Internal.prototype, AgentCommonInnerMethods);

module.exports = CollectionAgent;
