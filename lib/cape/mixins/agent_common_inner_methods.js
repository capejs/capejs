'use strict';

var Inflector = require('inflected');

var AgentCommonInnerMethods = {
  applyAdapter: function() {
    var adapterName, adapter;

    adapterName = this.main.adapter || Cape.defaultAgentAdapter;
    if (typeof adapterName === 'string') {
      adapter = Cape.AgentAdapters[Inflector.camelize(adapterName) + 'Adapter'];
      if (typeof adapter === 'function') adapter.apply(this.main, arguments);
    }
  },

  headers: function() {
    var headers = this.main.headers;
    if (this.main.dataType === undefined) {
      headers['Accept'] = 'application/json, text/plain';
    }
    else if (this.main.dataType === 'json') {
      headers['Accept'] = 'application/json';
    }
    else if (this.main.dataType === 'text') {
      headers['Accept'] = 'text/plain';
    }
    else {
      throw new Error('Unsupported data type: ' + this.main.dataType);
    }
    return headers;
  },

  pathPrefix: function(shallow) {
    var prefix = this.main.basePath || '/';
    if (this.main.nestedIn && !shallow) prefix = prefix + this.main.nestedIn;
    return prefix;
  },

  responseHandler: function() {
    if (this.main.dataType === undefined) {
      return function(response) { return response.text() };
    }
    else if (this.main.dataType === 'json') {
      return function(response) { return response.json() };
    }
    else if (this.main.dataType === 'text') {
      return function(response) { return response.text() };
    }
    else {
      throw new Error('Unsupported data type: ' + this.main.dataType);
    }
  },

  dataHandler: function(data, callback) {
    if (this.main.dataType === undefined) {
      try {
        this.main.data = JSON.parse(data);
      }
      catch (e) {
        this.main.data = data;
      }
    }
    else {
      this.main.data = data;
    }

    if (typeof callback === 'function') {
      callback.call(this.main.client, this.main.data);
    }
  }
}

module.exports = AgentCommonInnerMethods;
