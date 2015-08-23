'use strict';

var Inflector = require('inflected');

var AgentCommonMethods = {
  get: function(actionName, id, params, callback, errorHandler) {
    var path = id ? this.memberPath(id) : this.collectionPath();
    if (actionName !== '') path = path + '/' + actionName;
    this.ajax('GET', path, params, callback, errorHandler);
  },

  head: function(actionName, id, params, callback, errorHandler) {
    var path = id ? this.memberPath(id) : this.collectionPath();
    if (actionName !== '') path = path + '/' + actionName;
    this.ajax('HEAD', path, params, callback, errorHandler);
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
  }
};

module.exports = AgentCommonMethods;
