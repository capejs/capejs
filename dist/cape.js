(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Cape = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var Cape = require('./cape/utilities');
Cape.MarkupBuilder = require('./cape/markup_builder');
Cape.VirtualForms = require('./cape/virtual_forms');
Cape.Component = require('./cape/component.js');
Cape.Partial = require('./cape/partial.js');
Cape.DataStore = require('./cape/data_store.js');
Cape.AgentAdapters = {};
Cape.AgentAdapters.RailsAdapter = require('./cape/agent_adapters/rails_adapter.js');
Cape.ResourceAgent = require('./cape/resource_agent.js');
Cape.CollectionAgent = require('./cape/collection_agent.js');
Cape.RoutingMapper = require('./cape/routing_mapper.js');
Cape.Router = require('./cape/router.js');

// Default name of adapter fo CollectionAgent and ResourceAgent (e.g. 'rails')
Cape.defaultAgentAdapter = undefined;

module.exports = Cape;

},{"./cape/agent_adapters/rails_adapter.js":2,"./cape/collection_agent.js":3,"./cape/component.js":4,"./cape/data_store.js":5,"./cape/markup_builder":6,"./cape/partial.js":11,"./cape/resource_agent.js":12,"./cape/router.js":13,"./cape/routing_mapper.js":14,"./cape/utilities":15,"./cape/virtual_forms":16}],2:[function(require,module,exports){
'use strict';

// Cape.AgentAdapters.RailsAdapter
//
// This function is called just before an instance of Cape.ResourceAgent or
// Cape.ResourceCollectionAgent makes an Ajax request.
//
// The purpose of this adapter is to set the X-CSRF-Token header of Ajax requests.

function RailsAdapter(resourceName, client, options) {
  var metaElements = document.getElementsByTagName('meta');
  for (var i = metaElements.length - 1; i >= 0; i--) {
    if (metaElements[i].getAttribute('name') === 'csrf-token') {
      this.headers['X-CSRF-Token'] = metaElements[i].getAttribute('content');
      break;
    }
  }
}

module.exports = RailsAdapter;

},{}],3:[function(require,module,exports){
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var Inflector = require('inflected');
var Cape = require('./utilities');

// Cape.CollectionAgent
//
// public properties:
//   resourceName: the name of resource
//   basePath: the string that is added to the request path. Default value is '/'.
//   nestedIn: the string that is inserted between path prefix and the resource
//     name. Default value is ''.
//   shallow: a boolean value that controls whether the agent should omit
//     the `nestedIn` string from the member path. Default is `false`.
//   adapter: the name of adapter (e.g., 'rails'). Default is undefined.
//     Default value can be changed by setting Cape.defaultAgentAdapter property.
//   autoRefresh: a boolean value that controls unsafe Ajax requests trigger
//     this.refresh(). Default is `true`.
//   dataType: the type of data that you're expecting from the server.
//     The value must be 'json', 'text' or undefined. Default is undefiend.
//     When the `dataType` option is not defined, the type is detected automatically.
//   paramName: the name of parameter to be used when the `objects`
//     property is initialized and refreshed. Default is undefiend.
//     When the `paramName` option is not defined, the name is derived from the
//     `resourceName` property, e.g. `user` if the resource name is `users`.
//   objects: the array of objects that represent the collection of resources
//   data: the response data from the server. This property holds an object
//     if the response data is a valid JSON string. Otherwise, it holds the
//     original string value.
//   headers: the HTTP headers for Ajax requests
// private properties:
//   _: the object that holds internal methods and properties of this class.
//
// parameters for the constructor
//   options: an object that is used to initialize properties. The properties
//     which can be initialized by it are `resourceName`, `basePath`,
//     `nestedIn`, `adapter`, `autoRefresh`, `dataType`, and `paramName`.
//
var CollectionAgent = function CollectionAgent(client, options) {
  this._ = new _Internal(this);
  this.init(options);

  this.client = client;
  this.objects = [];
  this.data = undefined;
  this.headers = { 'Content-Type': 'application/json' };
};

_extends(CollectionAgent.prototype, {
  init: function (options) {
    options = options || {};
    this.resourceName = options.resourceName;
    this.basePath = options.basePath;
    this.nestedIn = options.nestedIn;
    this.shallow = options.shallow || false;
    this.adapter = options.adapter;
    this.autoRefresh = options.autoRefresh;
    if (this.autoRefresh === undefined) this.autoRefresh = true;
    this.dataType = options.dataType;
    this.paramName = options.paramName;
  },

  // Fetch current data through the API and refresh this.objects.
  //
  // The default implementation assumes that the request URI has no query string and
  // the API returns a hash like this:
  //   { users: [ { id: 1, name: 'John' }, { id: 2, name: 'Kate' } ]}
  //
  // Developers may change this assumption by overriding the `paramsForRefresh()`
  // method or setting the `paramName` property.
  refresh: function () {
    var self = this;
    this.index(this.paramsForRefresh(), function (data) {
      self.data = data;
      self.refreshObjects(data);
      self.afterRefresh();
    });
  },

  // Returns an empty object always. This object is used to construct
  // the query string of the request URL during the `refresh()` process.
  //
  // Developers may override this method to change this behavior.
  paramsForRefresh: function () {
    return {};
  },

  // Refresh the `objects` property using the response data from the server.
  //
  // Developers may override this method to change its default behavior.
  refreshObjects: function (data) {
    var paramName = this.paramName || Inflector.tableize(this.resourceName);

    this.objects.length = 0;
    if (typeof data === 'object' && Array.isArray(data[paramName])) {
      for (var i = 0; i < data[paramName].length; i++) {
        this.objects.push(data[paramName][i]);
      }
    }
  },

  // Called by the `refresh()` method after it updates the `data` and
  // `objects` properties.
  //
  // Developers may override this method to let the agent do some
  // post-processing jobs.
  afterRefresh: function () {
    this.client.refresh();
  },

  index: function (params, callback, errorHandler) {
    this.get('', null, params, callback, errorHandler);
  },

  create: function (params, callback, errorHandler) {
    this.post('', null, params, callback, errorHandler);
  },

  update: function (id, params, callback, errorHandler) {
    this.patch('', id, params, callback, errorHandler);
  },

  destroy: function (id, callback, errorHandler) {
    this.delete('', id, {}, callback, errorHandler);
  },

  get: function (actionName, id, params, callback, errorHandler) {
    var path = id ? this.memberPath(id) : this.collectionPath();
    if (actionName !== '') path = path + '/' + actionName;
    this.ajax('GET', path, params, callback, errorHandler);
  },

  head: function (actionName, id, params, callback, errorHandler) {
    var path = id ? this.memberPath(id) : this.collectionPath();
    if (actionName !== '') path = path + '/' + actionName;
    this.ajax('HEAD', path, params, callback, errorHandler);
  },

  post: function (actionName, id, params, callback, errorHandler) {
    var path = id ? this.memberPath(id) : this.collectionPath();
    if (actionName !== '') path = path + '/' + actionName;
    this.ajax('POST', path, params, callback, errorHandler);
  },

  patch: function (actionName, id, params, callback, errorHandler) {
    var path = id ? this.memberPath(id) : this.collectionPath();
    if (actionName !== '') path = path + '/' + actionName;
    this.ajax('PATCH', path, params, callback, errorHandler);
  },

  put: function (actionName, id, params, callback, errorHandler) {
    var path = id ? this.memberPath(id) : this.collectionPath();
    if (actionName !== '') path = path + '/' + actionName;
    this.ajax('PUT', path, params, callback, errorHandler);
  },

  delete: function (actionName, id, params, callback, errorHandler) {
    var path = id ? this.memberPath(id) : this.collectionPath();
    if (actionName !== '') path = path + '/' + actionName;
    this.ajax('DELETE', path, params, callback, errorHandler);
  },

  collectionPath: function () {
    var resources = Inflector.pluralize(Inflector.underscore(this.resourceName));
    return this._.pathPrefix() + resources;
  },

  memberPath: function (id) {
    var resources = Inflector.pluralize(Inflector.underscore(this.resourceName));
    return this._.pathPrefix(this.shallow) + resources + '/' + id;
  },

  defaultErrorHandler: function (ex) {
    console.log(ex);
  }
});

var AgentCommonMethods = require('./mixins/agent_common_methods');
_extends(CollectionAgent.prototype, AgentCommonMethods);

// Internal properties of Cape.CollectionAgent
var _Internal = function _Internal(main) {
  this.main = main;
  this.components = [];
};

var AgentCommonInnerMethods = require('./mixins/agent_common_inner_methods');

// Internal methods of Cape.CollectionAgent
_extends(_Internal.prototype, AgentCommonInnerMethods);

module.exports = CollectionAgent;

},{"./mixins/agent_common_inner_methods":7,"./mixins/agent_common_methods":8,"./utilities":15,"inflected":22}],4:[function(require,module,exports){
(function (global){
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var virtualDom = require('virtual-dom');
var Inflector = require('inflected');
var Cape = require('./utilities');

// Cape.Component
//
// public properties:
//   root: the root node which this component is mounted on.
//   virtualForms: an object that keeps the values of all form controls within this component.
// private properties:
//   _: the object that holds internal methods and properties of this class.
var Component = function Component() {
  this.root = undefined;
  this.virtualForms = new Cape.VirtualForms(this);
  this._ = new _Internal(this);
};

_extends(Component.prototype, {
  mount: function (id) {
    if (id === undefined) throw new Error("The first argument is missing.");
    if (typeof id !== 'string') throw new Error("The first argument must be a string.");
    if (this._.mounted) throw new Error("This component has been mounted already.");

    this._.mounted = true;
    this.root = document.getElementById(id);
    this.root.data = this._.getElementData(this.root);

    if (this.init) this.init();else this.refresh();
  },
  unmount: function () {
    if (!this._.mounted) throw new Error("This component has not been mounted yet.");

    this._.mounted = false;

    if (this.beforeUnmount) this.beforeUnmount();
    while (this.root.firstChild) this.root.removeChild(this.root.firstChild);
    if (this.afterUnmount) this.afterUnmount();
  },
  refresh: function () {
    var builder, newTree, patches, tempNode, textareaNodes, i, j, len, form, elements, elem, formName, vform, elemName;

    builder = new global.Cape.MarkupBuilder(this);

    this.virtualForms.prepare();
    if (this._.tree) {
      newTree = builder.markup(this.render);
      patches = virtualDom.diff(this._.tree, newTree);
      this.root = virtualDom.patch(this.root, patches);
      this._.tree = newTree;
    } else {
      this._.tree = builder.markup(this.render);
      tempNode = virtualDom.create(this._.tree);
      this.root.parentNode.replaceChild(tempNode, this.root);
      this.root = tempNode;
    }
    this.virtualForms.apply();
  },
  val: function (arg1, arg2) {
    if (arguments.length === 1) return this.virtualForms.val(arg1);else return this.virtualForms.val(arg1, arg2);
  },
  setValues: function (formName, obj) {
    this.virtualForms.setValues(formName, obj);
  },
  formData: function (formName) {
    return this.virtualForms.formData(formName);
  },
  paramsFor: function (formName, options) {
    return this.virtualForms.paramsFor(formName, options);
  },
  jsonFor: function (formName, options) {
    return this.virtualForms.jsonFor(formName, options);
  },
  checkedOn: function (name) {
    return this.virtualForms.checkedOn(name);
  }
});

// Internal properties of Cape.Component
var _Internal = function _Internal(main) {
  this.main = main;
  this.mounted = false;
};

// Internal methods of Cape.Component
_extends(_Internal.prototype, {
  getElementData: function (element) {
    var data = {},
        camelCaseName;
    [].forEach.call(element.attributes, function (attr) {
      if (/^data-/.test(attr.name)) {
        camelCaseName = attr.name.substr(5).replace(/-(.)/g, function ($0, $1) {
          return $1.toUpperCase();
        });
        data[camelCaseName] = attr.value;
      }
    });
    return data;
  }
});

module.exports = Component;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./utilities":15,"inflected":22,"virtual-dom":36}],5:[function(require,module,exports){
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var Cape = require('./utilities');

// Cape.DataStore
//
// public properties:
//   options: the object that holds option values given to the constructor
// private properties:
//   _: the object that holds internal methods and properties of this class.
var DataStore = function DataStore(options) {
  this.options = options || {};
  this._ = new _Internal(this);
  if (typeof this.init === 'function') this.init();
};

DataStore.create = function (options) {
  if (!this.instance) this.instance = new this(options);
  return this.instance;
};

var PropagatorMethods = require('./mixins/propagator_methods');
_extends(DataStore.prototype, PropagatorMethods);

// Internal properties of Cape.DataStore
var _Internal = function _Internal(main) {
  this.main = main;
  this.components = [];
};

module.exports = DataStore;

},{"./mixins/propagator_methods":10,"./utilities":15}],6:[function(require,module,exports){
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var virtualDom = require('virtual-dom');
var Inflector = require('inflected');
var Cape = require('./utilities');

// Cape.MarkupBuilder
//
// public properties:
//   component: the component that this builder works for.
//   formName: current form name.
//   selectBoxName: current select box name.
//   fieldNamePrefix: current field name prefix.
// private properties:
//   _: the object that holds internal methods and properties of this class.
var MarkupBuilder = function MarkupBuilder(component, options) {
  this._ = new _Internal(this);
  this.component = component;
  if (options) {
    this.formName = options.formName;
    this.selectBoxName = options.selectBoxName;
    this.fieldNamePrefix = options.fieldNamePrefix;
  }
};

_extends(MarkupBuilder.prototype, {
  markup: function (callback) {
    var root = this.component.root,
        formName,
        builder,
        attributes;

    if (typeof callback !== 'function') throw new Error("The first agument must be a function.");
    if (callback.length === 0) throw new Error("Callback requires an argument.");
    if (root.tagName == 'form') formName = root.attributes.name;
    builder = new MarkupBuilder(this.component, { formName: formName });
    callback.call(this.component, builder);

    attributes = {};
    for (var i = root.attributes.length; i--;) attributes[root.attributes[i].nodeName] = root.attributes[i].value;
    return this._.h(root.tagName, attributes, builder._.elements);
  },
  elem: function (tagName) {
    var args, options, content, callback, builder, attributes;

    args = Array.prototype.slice.call(arguments, 1);
    content = this._.extractContent(args);
    options = this._.extractOptions(args);
    callback = this._.extractCallback(args);

    if (callback) {
      builder = new MarkupBuilder(this.component, { formName: this.formName,
        selectBoxName: this.selectBoxName,
        fieldNamePrefix: this.fieldNamePrefix });
      if (callback.length === 0) {
        throw new Error("Callback requires an argument.");
      }
      callback.call(this.component, builder);
      attributes = this._.generateAttributes(options);
      this._.elements.push(this._.h(tagName, attributes, builder._.elements));
    } else {
      content = content || '';
      attributes = this._.generateAttributes(options);
      this._.elements.push(this._.h(tagName, attributes, content));
    }
    return this;
  },
  text: function (content) {
    this._.elements.push(content);
    return this;
  },
  space: function () {
    this._.elements.push(' ');
    return this;
  },
  sp: function () {
    this.space();
    return this;
  },
  formFor: function (name) {
    var args, options, callback, name, builder, attributes;

    args = Array.prototype.slice.call(arguments);
    options = this._.extractOptions(args) || {};
    callback = this._.extractCallback(args);

    if (typeof callback !== 'function') throw new Error("One of arguments must be a function.");
    if (callback.length === 0) throw new Error("Callback requires an argument.");

    builder = new MarkupBuilder(this.component, { formName: name });
    callback.call(this.component, builder);
    options = options || {};
    options.name = name;
    if (options.onsubmit === undefined && this._.eventCallbacks.onsubmit === undefined) {
      options.onsubmit = function (e) {
        return false;
      };
    }
    attributes = this._.generateAttributes(options);
    this._.elements.push(this._.h('form', attributes, builder._.elements));
    return this;
  },
  fieldsFor: function (name) {
    var args, options, callback, prefix, builder;

    args = Array.prototype.slice.call(arguments, 1);
    options = this._.extractOptions(args) || {};
    callback = this._.extractCallback(args);

    if (typeof callback !== 'function') throw new Error("One of arguments must be a function.");
    if (callback.length === 0) throw new Error("Callback requires an argument.");

    if (this.fieldNamePrefix !== undefined) prefix = this.fieldNamePrefix + '/' + name;else prefix = name;
    if (options.index !== undefined) prefix = prefix + '/' + String(options.index);

    builder = new MarkupBuilder(this.component, { formName: this.formName, fieldNamePrefix: prefix });
    callback.call(this.component, builder);
    builder._.elements.forEach(function (elem) {
      this._.elements.push(elem);
    }.bind(this));

    return this;
  },
  labelFor: function (name, content, options) {
    var fieldName;

    options = options || {};
    options.htmlFor = this._.elementIdFor(name);
    this.elem('label', content, options);
    return this;
  },
  hiddenField: function (name, options) {
    options = options || {};
    options.type = 'hidden';
    options.name = name;
    this._.inputField(options);
    return this;
  },
  textField: function (name, options) {
    options = options || {};
    options.type = options.type || 'text';
    options.name = name;
    this._.inputField(options);
    return this;
  },
  passwordField: function (name, options) {
    options = options || {};
    options.type = 'password';
    options.name = name;
    this._.inputField(options);
    return this;
  },
  textareaField: function (attrName, options) {
    var formName, vform, dasherized;

    if (attrName && this.fieldNamePrefix) attrName = this.fieldNamePrefix + '/' + attrName;
    options = options || {};
    options.name = attrName;

    formName = this.formName || '';
    this.component.virtualForms.update(formName, options);

    dasherized = Inflector.dasherize(attrName.replace(/\//g, '_'));
    if (!options.id) {
      if (this.formName) options.id = this.formName + '-field-' + dasherized;else options.id = 'field-' + dasherized;
    }
    this.elem('textarea', '', options);
    return this;
  },
  checkBox: function (attrName, options) {
    var fieldName;

    options = options || {};
    options.type = 'checkbox';
    if (attrName) options.name = attrName;
    if (!options.value) options.value = '1';

    if (options.name && this.fieldNamePrefix) fieldName = this.fieldNamePrefix + '/' + options.name;else fieldName = options.name;

    if (attrName.slice(-2) !== '[]') {
      this._.elements.push(this._.h('input', _extends({}, { name: fieldName, type: 'hidden', value: '0' })));
    }
    this._.inputField(options);
    return this;
  },
  radioButton: function (attrName, value, options) {
    options = options || {};
    options.type = 'radio';
    options.value = value;
    if (attrName) options.name = attrName;
    this._.inputField(options);
    return this;
  },
  selectBox: function (name) {
    var args, options, callback, builder, attributes, dasherized, formName;

    args = Array.prototype.slice.call(arguments, 1);
    options = this._.extractOptions(args) || {};
    callback = this._.extractCallback(args);

    if (typeof callback !== 'function') throw new Error("One of arguments must be a function.");
    if (callback.length === 0) throw new Error("Callback requires an argument.");

    if (name && this.fieldNamePrefix) options.name = this.fieldNamePrefix + '/' + name;else options.name = name;

    options.id = options.id || this._.elementIdFor(name);

    builder = new MarkupBuilder(this.component, { formName: this.formName, selectBoxName: name });
    callback.call(this.component, builder);
    options = options || {};
    attributes = this._.generateAttributes(options);

    formName = this.formName || '';
    this.component.virtualForms.update(formName, { name: name, value: options.value });

    this._.elements.push(this._.h('select', attributes, builder._.elements));
    return this;
  },
  btn: function () {
    var args, options, content, callback;

    args = Array.prototype.slice.call(arguments);
    content = this._.extractContent(args);
    options = this._.extractOptions(args) || {};
    callback = this._.extractCallback(args);

    options.type = options.type || 'button';
    this.elem('button', content, options, callback);
    return this;
  },
  attr: function (name, value) {
    if (typeof name === 'object') _extends(this._.attr, name);else if (typeof name === 'string') this._.attr[name] = value;

    return this;
  },
  class: function (name) {
    if (typeof name === 'object') _extends(this._.classNames, name);else if (typeof name === 'string') this._.classNames[name] = true;
    return this;
  },
  data: function (name, value) {
    if (typeof name === 'object') _extends(this._.data, name);else if (typeof name === 'string') this._.data[name] = value;
    return this;
  },
  css: function (name, value) {
    if (typeof name === 'object') _extends(this._.style, name);else if (typeof name === 'string') this._.style[name] = value;

    return this;
  },
  on: function (eventName, callback) {
    if (typeof eventName === 'string') this._.eventCallbacks['on' + eventName] = callback;else throw new Error("The first agument must be a string.");
  },
  fa: function (iconName, options) {
    options = options || {};
    var htmlClass = options.class || options.className;
    if (htmlClass) {
      htmlClass = htmlClass + ' fa fa-' + iconName;
    } else {
      htmlClass = 'fa fa-' + iconName;
    }
    options.class = htmlClass;
    this.i('', options);
    return this;
  }
});

// Internal properties of Cape.MarkupBuilder
var _Internal = function _Internal(main) {
  this.main = main;
  this.h = virtualDom.h;
  this.elements = [];
  this.classNames = {};
  this.attr = {};
  this.data = {};
  this.style = {};
  this.eventCallbacks = {};
};

// Internal methods of Cape.MarkupBuilder
_extends(_Internal.prototype, {
  inputField: function (options) {
    var attributes, dasherized, formName, vform;

    options = options || {};

    if (options.id === undefined) {
      options.id = this.elementIdFor(options.name);
      if (options.type === 'radio') options.id = options.id + '-' + String(options.value);
    }
    if (options.id === null) delete options.id;
    if (options.name && this.main.fieldNamePrefix) options.name = this.main.fieldNamePrefix + '/' + options.name;

    formName = this.main.formName || '';
    this.main.component.virtualForms.update(formName, options);

    attributes = this.generateAttributes(options);
    this.elements.push(this.h('input', attributes));
    return this;
  },

  elementIdFor: function (name) {
    var dasherized;

    if (this.main.fieldNamePrefix) dasherized = Inflector.dasherize(this.main.fieldNamePrefix.replace(/\//g, '-') + '-' + name);else dasherized = Inflector.dasherize(name);

    if (this.main.formName) return this.main.formName + '-field-' + dasherized;else return 'field-' + dasherized;
  },

  extractContent: function (args) {
    if (typeof args[0] === 'string') return args[0];
  },

  extractOptions: function (args) {
    for (var i = 0; i < args.length; i++) if (typeof args[i] === 'object') return args[i];
  },

  extractCallback: function (args) {
    for (var i = 0; i < args.length; i++) if (typeof args[i] === 'function') return args[i];
  },

  generateAttributes: function (options) {
    var classNames, data;

    options = options || {};
    options = _extends({}, this.attr, options);
    this.attr = {};

    if ('visible' in options && !options['visible']) {
      options['style'] = options['style'] || {};
      options['style']['display'] = 'none';
    }
    if ('class' in options) {
      options['className'] = options['class'];
      delete options['class'];
    }
    if ('for' in options) {
      options['htmlFor'] = options['for'];
      delete options['for'];
    }

    classNames = [];
    for (key in this.classNames) if (this.classNames.hasOwnProperty(key) && this.classNames[key]) classNames.push(key);
    this.classNames = [];

    if (typeof options['className'] === 'object') {
      for (var name in options['className']) {
        if (options['className'][name]) {
          classNames.push(name);
        }
      }
    } else if (typeof options['className'] === 'string') {
      options['className'].split(' ').forEach(function (e) {
        classNames.push(e);
      });
    }

    if (classNames.length) {
      classNames = classNames.filter(function (e, i, self) {
        return self.indexOf(e) === i;
      });
      options['className'] = classNames.join(' ');
    } else {
      delete options['className'];
    }

    if ('data' in options) {
      options['dataset'] = options['data'];
      delete options['data'];
    }
    data = options.dataset || {};
    data = _extends({}, this.data, data);
    this.data = {};
    options.dataset = data;

    if (typeof options.style === 'object') options.style = _extends({}, this.style, options.style);else options.style = this.style;
    this.style = {};

    Cape.merge(options, this.eventCallbacks);
    this.eventCallbacks = {};

    for (var key in options) {
      if (typeof options[key] === 'function') {
        options[key] = options[key].bind(this.main.component);
      }
    }
    return options;
  }
});

var normalElementNames = ['a', 'abbr', 'address', 'article', 'aside', 'audio', 'b', 'bdi', 'bdo', 'blockquote', 'body', 'button', 'canvas', 'caption', 'cite', 'code', 'colgroup', 'datalist', 'dd', 'del', 'details', 'dfn', 'dialog', 'div', 'dl', 'dt', 'em', 'embed', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'html', 'i', 'iframe', 'ins', 'kbd', 'label', 'legend', 'li', 'main', 'map', 'mark', 'menu', 'menuitem', 'meter', 'nav', 'noscript', 'object', 'ol', 'optgroup', 'option', 'output', 'p', 'pre', 'progress', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'script', 'section', 'select', 'small', 'span', 'strong', 'style', 'sub', 'summary', 'sup', 'table', 'tbody', 'td', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'u', 'ul', 'var', 'video'];

for (var i = normalElementNames.length; i--;) {
  var tagName = normalElementNames[i];
  MarkupBuilder.prototype[tagName] = new Function("arg1", "arg2", "this.elem('" + tagName + "', arg1, arg2); return this");
}

var voidElementNames = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'menuitem', 'meta', 'param', 'source', 'track', 'wbr'];

for (var i = voidElementNames.length; i--;) {
  var tagName = voidElementNames[i];
  MarkupBuilder.prototype[tagName] = new Function("options", "this.elem('" + tagName + "', options); return this");
}

var attrNames = ['checked', 'disabled'];

for (var i = attrNames.length; i--;) {
  var attrName = attrNames[i];
  MarkupBuilder.prototype[attrName] = new Function("value", "this.attr('" + attrName + "', value); return this");
}

var eventNames = ['blur', 'focus', 'change', 'select', 'submit', 'reset', 'abort', 'error', 'load', 'unload', 'click', 'dblclick', 'keyup', 'keydown', 'keypress', 'mouseout', 'mouseover', 'mouseup', 'mousedown', 'mousemove'];

for (var i = eventNames.length; i--;) {
  var eventName = eventNames[i];
  MarkupBuilder.prototype['on' + eventName] = new Function("callback", "this.on('" + eventName + "', callback); return this");
}

module.exports = MarkupBuilder;

},{"./utilities":15,"inflected":22,"virtual-dom":36}],7:[function(require,module,exports){
'use strict';

var Inflector = require('inflected');

var AgentCommonInnerMethods = {
  applyAdapter: function () {
    var adapterName, adapter;

    adapterName = this.main.adapter || Cape.defaultAgentAdapter;
    if (typeof adapterName === 'string') {
      adapter = Cape.AgentAdapters[Inflector.camelize(adapterName) + 'Adapter'];
      if (typeof adapter === 'function') adapter.apply(this.main, arguments);
    }
  },

  headers: function () {
    var headers = this.main.headers;
    if (this.main.dataType === undefined) {
      headers['Accept'] = 'application/json, text/plain';
    } else if (this.main.dataType === 'json') {
      headers['Accept'] = 'application/json';
    } else if (this.main.dataType === 'text') {
      headers['Accept'] = 'text/plain';
    } else {
      throw new Error('Unsupported data type: ' + this.main.dataType);
    }
    return headers;
  },

  pathPrefix: function (shallow) {
    var prefix = this.main.basePath || '/';
    if (this.main.nestedIn && !shallow) prefix = prefix + this.main.nestedIn;
    return prefix;
  },

  responseHandler: function () {
    if (this.main.dataType === undefined) {
      return function (response) {
        return response.text();
      };
    } else if (this.main.dataType === 'json') {
      return function (response) {
        return response.json();
      };
    } else if (this.main.dataType === 'text') {
      return function (response) {
        return response.text();
      };
    } else {
      throw new Error('Unsupported data type: ' + this.main.dataType);
    }
  },

  dataHandler: function (data, callback) {
    if (this.main.dataType === undefined) {
      try {
        this.main.data = JSON.parse(data);
      } catch (e) {
        this.main.data = data;
      }
    } else {
      this.main.data = data;
    }

    if (typeof callback === 'function') {
      callback.call(this.main.client, this.main.data);
    }
  }
};

module.exports = AgentCommonInnerMethods;

},{"inflected":22}],8:[function(require,module,exports){
'use strict';

var Inflector = require('inflected');
var checkStatus = require('./check_status');

var AgentCommonMethods = {
  ajax: function (httpMethod, path, params, callback, errorHandler) {
    var self = this,
        isSafeMethod,
        fetchOptions;

    params = params || {};
    errorHandler = errorHandler || this.defaultErrorHandler;

    this._.applyAdapter();

    isSafeMethod = httpMethod === 'GET' || httpMethod === 'HEAD';
    fetchOptions = {
      method: httpMethod,
      headers: this._.headers(),
      credentials: 'same-origin'
    };

    if (isSafeMethod) {
      var pairs = [];
      for (var key in params) {
        pairs.push(encodeURIComponent(key) + "=" + encodeURIComponent(params[key]));
      }
      if (pairs.length) path = path + '?' + pairs.join('&');
    } else {
      fetchOptions.body = JSON.stringify(params);
    }

    fetch(path, fetchOptions).then(checkStatus).then(this._.responseHandler()).then(function (data) {
      self._.dataHandler(data, callback);
      if (self.autoRefresh && !isSafeMethod) self.refresh();
    }).catch(errorHandler);

    return false;
  }
};

module.exports = AgentCommonMethods;

},{"./check_status":9,"inflected":22}],9:[function(require,module,exports){
'use strict';

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    var error = new Error(response.statusText);
    error.response = response;
    throw error;
  }
}

module.exports = checkStatus;

},{}],10:[function(require,module,exports){
'use strict';

var PropagatorMethods = {
  attach: function (component) {
    var target = component;
    for (var i = 0, len = this._.components.length; i < len; i++) {
      if (this._.components[i] === component) return;
    }
    this._.components.push(component);
  },

  detach: function (component) {
    for (var i = 0, len = this._.components.length; i < len; i++) {
      if (this._.components[i] === component) {
        this._.components.splice(i, 1);
        break;
      }
    }
  },

  propagate: function () {
    for (var i = this._.components.length; i--;) this._.components[i].refresh();
  }
};

module.exports = PropagatorMethods;

},{}],11:[function(require,module,exports){
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var Cape = require('./utilities');

// Cape.Partial
//
// public properties:
//   parent: the parent component that contains this partial component.
var Partial = function Partial(parent) {
  this.parent = parent;
  this.virtualForms = parent.virtualForms;
};

_extends(Partial.prototype, {
  refresh: function () {
    this.parent.refresh();
  },

  val: function (arg1, arg2) {
    if (arguments.length === 1) return this.parent.val(arg1);else return this.parent.val(arg1, arg2);
  },

  setValues: function (formName, obj) {
    this.virtualForms.setValues(formName, obj);
  },

  formData: function (formName) {
    return this.virtualForms.formData(formName);
  },

  paramsFor: function (formName, options) {
    return this.virtualForms.paramsFor(formName, options);
  },

  jsonFor: function (formName, options) {
    return this.virtualForms.jsonFor(formName, options);
  },

  checkedOn: function (name) {
    return this.virtualForms.checkedOn(name);
  }
});

module.exports = Partial;

},{"./utilities":15}],12:[function(require,module,exports){
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var Inflector = require('inflected');
var Cape = require('./utilities');
var checkStatus = require('./mixins/check_status');

// Cape.ResourceAgent
//
// public properties:
//   resourceName: the name of resource
//   id: the id of the resource
//   client: the object that utilizes this agent
//   basePath: the string that is added to the request path. Default value is '/'.
//   nestedIn: the string that is inserted between path prefix and the resource
//     name. Default value is ''.
//   shallow: a boolean value that controls whether the agent should omit
//     the `nestedIn` string from the member path. Default is `false`.
//   adapter: the name of adapter (e.g., 'rails'). Default is undefined.
//     Default value can be changed by setting Cape.defaultAgentAdapter property.
//   autoRefresh: a boolean value that controls unsafe Ajax requests trigger
//     this.refresh(). Default is `false`.
//   dataType: the type of data that you're expecting from the server.
//     The value must be 'json', text' or undefined.
//     When the `dataType` option is not defined, the type is detected automatically.
//   singular: a boolean value that specifies if the resource is singular or not.
//     Resources are called 'singular' when they have a URL without ID.
//     Default is `false`.
//   formName: the name of form with which the users edit the properties
//     of the resource. Default is `undefiend`.
//     When the `formName` option is not defined, the name is derived from the
//     `resourceName` property, e.g. `user` if the resource name is `user`.
//   paramName: the name of parameter to be used when request parameter is
//     constructed. Default is `undefiend`.
//     When the `paramName` option is not defined, the name is derived from the
//     `resourceName` property, e.g. `user` if the resource name is `user`.
//   object: the object that represents the resource.
//   data: the response data from the server. This property holds an object
//     if the response data is a valid JSON string. Otherwise, it holds the
//     original string value.
//   errors: the object that holds error messages.
//   headers: the HTTP headers for Ajax requests.
// private properties:
//   _: the object that holds internal methods and properties of this class.
//
// parameters for the constructor
//   client: the component object that use this agent.
//   options: an object that is used to initialize properties. The properties
//     which can be initialized by it are `resourceName`, `basePath`,
//     `nestedIn`, `adapter`, `dataType`, and `singular`.
function ResourceAgent(client, options) {
  var adapterName, adapter;

  options = options || {};

  this._ = new _Internal(this);
  this.resourceName = options.resourceName;
  this.client = client;
  this.id = options.id;
  this.basePath = options.basePath;
  this.nestedIn = options.nestedIn;
  this.shallow = options.shallow || false;
  this.adapter = options.adapter;
  this.autoRefresh = options.autoRefresh || false;
  this.dataType = options.dataType;
  this.singular = options.singular || false;
  this.formName = options.formName;
  this.paramName = options.paramName;

  this.object = undefined;
  this.data = undefined;
  this.errors = {};
  this.headers = { 'Content-Type': 'application/json' };
};

_extends(ResourceAgent.prototype, {
  init: function (afterInitialize, errorHandler) {
    var self = this,
        path;

    if (this.singular) {
      path = this.singularPath();
    } else if (this.id) {
      path = this.memberPath();
    } else {
      path = this.newPath();
    }
    errorHandler = errorHandler || this.defaultErrorHandler;

    this._.applyAdapter();

    fetch(path, {
      headers: this._.headers(),
      credentials: 'same-origin'
    }).then(checkStatus).then(this._.responseHandler()).then(function (data) {
      self._.initialDataHandler(data, afterInitialize);
    }).catch(errorHandler);
  },

  refresh: function () {
    var self = this;
    this.show(function (data) {
      self.data = data;
      self.afterRefresh();
    });
  },

  // Called by the `refresh()` method after it updates the `data` property.
  //
  // Developers may override this method to let the agent do some
  // post-processing jobs.
  afterRefresh: function () {
    this.client.refresh();
  },

  show: function (callback, errorHandler) {
    this.ajax('GET', this.requestPath(), {}, callback, errorHandler);
  },

  create: function (afterCreate, errorHandler) {
    var path = this.singular ? this.singularPath() : this.collectionPath();
    var params = this.client.paramsFor(this.formName || this.resourceName, { as: this.paramName || this.resourceName });
    this.ajax('POST', path, params, afterCreate, errorHandler);
    return false;
  },

  update: function (afterUpdate, errorHandler) {
    var path = this.singular ? this.singularPath() : this.memberPath();
    var params = this.client.paramsFor(this.formName || this.resourceName, { as: this.paramName || this.resourceName });
    this.ajax('PATCH', path, params, afterUpdate, errorHandler);
    return false;
  },

  destroy: function (afterDestroy, errorHandler) {
    var path = this.singular ? this.singularPath() : this.memberPath();
    this.ajax('DELETE', path, {}, afterDestroy, errorHandler);
    return false;
  },

  get: function (actionName, params, callback, errorHandler) {
    var path = this.requestPath();
    if (actionName !== '') path = path + '/' + actionName;
    this.ajax('GET', path, params, callback, errorHandler);
  },

  head: function (actionName, params, callback, errorHandler) {
    var path = this.requestPath();
    if (actionName !== '') path = path + '/' + actionName;
    this.ajax('HEAD', path, params, callback, errorHandler);
  },

  post: function (actionName, params, callback, errorHandler) {
    var path = this.requestPath();
    if (actionName !== '') path = path + '/' + actionName;
    this.ajax('POST', path, params, callback, errorHandler);
  },

  patch: function (actionName, params, callback, errorHandler) {
    var path = this.requestPath();
    if (actionName !== '') path = path + '/' + actionName;
    this.ajax('PATCH', path, params, callback, errorHandler);
  },

  put: function (actionName, params, callback, errorHandler) {
    var path = this.requestPath();
    if (actionName !== '') path = path + '/' + actionName;
    this.ajax('PUT', path, params, callback, errorHandler);
  },

  delete: function (actionName, params, callback, errorHandler) {
    var path = this.requestPath();
    if (actionName !== '') path = path + '/' + actionName;
    this.ajax('DELETE', path, params, callback, errorHandler);
  },

  requestPath: function () {
    if (this.singular) {
      return this.singularPath();
    } else if (this.id === undefined) {
      return this.collectionPath();
    } else {
      return this.memberPath();
    }
  },

  collectionPath: function () {
    var resources = Inflector.pluralize(Inflector.underscore(this.resourceName));
    return this._.pathPrefix() + resources;
  },

  newPath: function () {
    var resources = Inflector.pluralize(Inflector.underscore(this.resourceName));
    return this._.pathPrefix() + resources + '/new';
  },

  memberPath: function () {
    var resources = Inflector.pluralize(Inflector.underscore(this.resourceName));
    return this._.pathPrefix(this.shallow) + resources + '/' + this.id;
  },

  singularPath: function () {
    var resource = Inflector.underscore(this.resourceName);
    return this._.pathPrefix() + resource;
  },

  defaultErrorHandler: function (ex) {
    console.log(ex);
  }
});

var AgentCommonMethods = require('./mixins/agent_common_methods');
_extends(ResourceAgent.prototype, AgentCommonMethods);

// Internal properties of Cape.ResourceAgent
var _Internal = function _Internal(main) {
  this.main = main;
};

var AgentCommonInnerMethods = require('./mixins/agent_common_inner_methods');

// Internal methods of Cape.ResourceAgent
_extends(_Internal.prototype, AgentCommonInnerMethods);

_extends(_Internal.prototype, {
  initialDataHandler: function (data, afterInitialize) {
    var formName = this.main.formName || this.main.resourceName,
        paramName = this.main.paramName || this.main.resourceName;

    try {
      this.main.data = JSON.parse(data);
      this.main.object = this.main.data[paramName] || {};
    } catch (e) {
      console.log("Could not parse the response data as JSON.");
      this.main.data = data;
    }
    if (typeof afterInitialize === 'function') {
      afterInitialize.call(this.main.client, this.main);
    } else if (this.main.object) {
      this.main.client.setValues(formName, this.main.object);
      this.main.client.refresh();
    }
  }
});

module.exports = ResourceAgent;

},{"./mixins/agent_common_inner_methods":7,"./mixins/agent_common_methods":8,"./mixins/check_status":9,"./utilities":15,"inflected":22}],13:[function(require,module,exports){
(function (global){
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var Inflector = require('inflected');
var Cape = require('./utilities');

// Cape.Router
//
// public properties:
//   routes: array of hashes that contains routing information.
//   params: the parameters that are extracted from URL hash fragment.
//   query: the parameters that are extracted from the query part of URL hash fragment.
//   vars: an object which users can store arbitrary data to.
//   flash: an object which users can store arbitrary data to, but is erased after each
//          navigation.
//   namespace: the namespace part of URL hash fragment.
//   resource: the resource part of URL hash fragment.
//   action: the action name of current route.
//   container: the name of container of component.
//   component: the name of component.
// private properties:
//   _: the object that holds internal methods and properties of this class.
var Router = function Router(rootContainer) {
  this._ = new _Internal(this);
  this.rootContainer = rootContainer || window;
  this.routes = [];
  this.params = {};
  this.query = {};
  this.vars = {};
  this.flash = {};
  this.namespace = null;
  this.resource = null;
  this.action = null;
  this.container = null;
  this.component = null;
};

_extends(Router.prototype, {
  draw: function (callback) {
    var mapper;

    if (typeof callback !== 'function') throw new Error("The last argument must be a function.");
    if (callback.length === 0) throw new Error("Callback requires an argument.");

    mapper = new global.Cape.RoutingMapper(this);
    callback(mapper);
  },
  mount: function (elementId) {
    this._.targetElementId = elementId;
  },
  start: function () {
    var self = this,
        callback;

    if (window.addEventListener) window.addEventListener('hashchange', self._.eventListener, false);else if (window.attachEvent) window.attachEvent('onhashchange', self._.eventListener);

    this.currentHash = window.location.href.split('#')[1] || '';
    this.navigate(this.currentHash);
  },
  stop: function () {
    var self = this;

    if (window.removeEventListener) window.removeEventListener('hashchange', self._.eventListener, false);else if (window.detachEvent) window.detachEvent('onhashchange', self._.eventListener);
  },
  routeFor: function (hash) {
    var i, len, route;

    for (i = 0, len = this.routes.length; i < len; i++) {
      route = this.routes[i];
      if (hash.match(route.regexp)) return route;
    }
    throw new Error("No route match. [" + hash + "]");
  },
  navigateTo: function (hash, params, options) {
    var self = this,
        promises,
        promise,
        i,
        len;

    if (params !== undefined) {
      hash = this._.constructHash(params, hash);
    }

    this._.currentHash = hash;
    this._.setHash(hash);

    options = options || {};
    this.flash.notice = options.notice;
    this.flash.alert = options.alert;

    if (this._.beforeNavigationCallbacks.length) {
      promises = [];
      promise = new Promise(function (resolve, reject) {
        resolve(hash);
      });
      promises.push(promise);
      for (i = 0, len = this._.beforeNavigationCallbacks.length; i < len; i++) {
        promise = promise.then(this._.beforeNavigationCallbacks[i]);
        promises.push(promise);
      }
      Promise.all(promises).then(function (results) {
        self._.mountComponent(results.pop());
      }, self._.errorHandler);
    } else {
      self._.mountComponent(hash);
    }
  },
  // Deprecated. Use navigateTo() instead.
  navigate: function (hash, options) {
    this.navigateTo(hash, {}, options);
  },
  redirectTo: function (hash, params, options) {
    var self = this;

    // For backward compatibility, if the second argument has a key 'notice'
    // or 'alert' and the third argument is undefined, the second argument
    // should be treated as options.
    if (typeof params === 'object' && options === undefined) {
      if (params.hasOwnProperty('notice') || params.hasOwnProperty('alert')) {
        options = params;
        params = undefined;
      }
    }

    if (params !== undefined) {
      hash = this._.constructHash(params, hash);
    }

    this._.currentHash = hash;
    this._.setHash(hash);

    options = options || {};
    this.flash.notice = options.notice;
    this.flash.alert = options.alert;
    self._.mountComponent(hash);
  },
  show: function (klass, params) {
    var prop, component;

    this.query = {};
    if (params !== undefined) {
      for (prop in params) {
        this.query[prop] = params[prop];
      }
    }

    component = new klass();
    component.mount(this._.targetElementId);
    this._.mountedComponentClass = klass;
    this._.mountedComponent = component;
  },
  attach: function (listener) {
    if (listener === undefined) throw new Error("Missing listener.");
    if (typeof listener.refresh !== 'function') throw new Error('The listener must have the "refresh" function.');

    for (var i = 0, len = this._.notificationListeners.length; i < len; i++) {
      if (this._.notificationListeners[i] === listener) return;
    }
    this._.notificationListeners.push(listener);
  },
  detach: function (listener) {
    for (var i = 0, len = this._.notificationListeners.length; i < len; i++) {
      if (this._.notificationListeners[i] === listener) {
        this._.notificationListeners.splice(i, 1);
        break;
      }
    }
  },
  beforeNavigation: function (callback) {
    this._.beforeNavigationCallbacks.push(callback);
  },
  errorHandler: function (callback) {
    this._.errorHandler = callback;
  },
  notify: function () {
    var i;

    for (i = this._.notificationListeners.length; i--;) {
      this._.notificationListeners[i].refresh();
    }
  }
});

// Internal properties of Cape.Router
var _Internal = function _Internal(main) {
  var self = this;
  this.main = main;
  this.eventListener = function () {
    var hash = window.location.href.split('#')[1] || '';
    if (hash != self.currentHash) self.main.navigate(hash);
  };
  this.beforeNavigationCallbacks = [];
  this.notificationListeners = [];
  this.currentHash = null;
  this.mountedComponent = null;
  this.targetElementId = null;
};

// Internal methods of Cape.Router
_extends(_Internal.prototype, {
  mountComponent: function (hash) {
    var route, componentClass, component;

    if (typeof hash !== 'string') throw new Error("The first argument must be a string.");

    route = this.main.routeFor(hash);
    this.main.namespace = route.namespace;
    this.main.resource = route.resource;
    this.main.action = route.action;
    this.main.container = route.container;
    this.main.component = route.component;
    this.setParams(route);
    this.setQuery(route);
    componentClass = this.getComponentClassFor(route);

    if (componentClass === this.mountedComponentClass) {
      this.main.notify();
    } else {
      if (this.mountedComponent) this.mountedComponent.unmount();
      this.main.notify();
      component = new componentClass();
      component.mount(this.targetElementId);
      this.mountedComponentClass = componentClass;
      this.mountedComponent = component;
    }

    this.main.flash = {};
  },
  constructHash: function (params, hash) {
    var pairs, prop;

    pairs = [];
    for (prop in params) {
      pairs.push(prop + '=' + params[prop]);
    }
    if (pairs.length > 0) return hash + '?' + pairs.join('&');else return hash;
  },
  setHash: function (hash) {
    window.location.hash = hash;
  },
  setParams: function (route) {
    var md = this.currentHash.match(route.regexp);
    this.main.params = {};
    route.keys.forEach(function (key, i) {
      this.main.params[key] = md[i + 1];
    }.bind(this));
  },
  setQuery: function (route) {
    var queryString, pairs;

    this.main.query = {};
    queryString = this.currentHash.split('?')[1];
    if (queryString === undefined) return;
    pairs = queryString.split('&');
    pairs.forEach(function (pair) {
      var parts = pair.split('=');
      this.main.query[parts[0]] = parts[1] || '';
    }.bind(this));
  },
  getComponentClassFor: function (route) {
    var fragments, obj, i, componentName;

    fragments = [];
    if (route.container) {
      route.container.split('.').forEach(function (part) {
        fragments.push(Inflector.camelize(part));
      });
    }

    obj = this.main.rootContainer;
    for (i = 0; obj && i < fragments.length; i++) {
      if (obj[fragments[i]]) obj = obj[fragments[i]];else obj = null;
    }

    componentName = Inflector.camelize(route.component);
    if (obj && obj[componentName]) return obj[componentName];

    throw new Error("Component class " + fragments.concat([componentName]).join('.') + " is not defined.");
  }
});

module.exports = Router;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./utilities":15,"inflected":22}],14:[function(require,module,exports){
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var Inflector = require('inflected');
var Cape = require('./utilities');

// Cape.RoutingMapper
function RoutingMapper(router, options) {
  this._ = new _Internal(this);
  this.router = router;
  if (options) {
    // The namespace part of URL hash
    this.namespacePath = options.namespacePath;
    this.singular = options.singular;
    this.pathPrefix = options.pathPrefix;
    this.resourcePath = options.resourcePath;
    this.classNamePrefix = options.classNamePrefix;
    this.resourceClassName = options.resourceClassName;
  }
};

_extends(RoutingMapper.prototype, {
  page: function (path, className, constraints, options) {
    var route = {},
        fullClassName,
        fragments,
        resourceNames;

    if (path === undefined) throw new Error("Missing hash pattern.");

    if (className === undefined) {
      if (path.match(/^\w+(\/\w+)*$/)) className = path.replace('/', '.');else throw new Error("Missing class name path.");
    }

    options = options || {};

    if (this.pathPrefix) path = this.pathPrefix + '/' + path;

    route.path = path;
    route.keys = this._.extractKeys(path);
    route.regexp = this._.constructRegexp(path, constraints);

    if (this.classNamePrefix) fullClassName = this.classNamePrefix + '.' + className;else fullClassName = className;

    fragments = fullClassName.split('.');
    route.component = fragments.pop();
    route.container = fragments.length ? fragments.join('.') : null;

    route.namespace = this.namespacePath || null;

    resourceNames = [];
    if (this.resourcePath) resourceNames.push(this.resourcePath);
    if (options.resource) resourceNames.push(options.resource);
    if (resourceNames.length) route.resource = resourceNames.join('/');else route.resource = null;

    route.action = options.action || null;

    this.router.routes.push(route);
  },
  root: function (className) {
    this.page('', className);
  },
  many: function (resourceName) {
    var options, callback, resourcePath;

    options = this._.extractOptions(arguments);
    callback = this._.extractCallback(arguments);
    resourcePath = this._.getResourcePath(options.path || resourceName);

    this._.addPagesForPluralResource(resourceName, resourcePath, options);
    this._.executeCallback(callback, resourceName, resourcePath, false);
  },
  one: function (resourceName) {
    var options, callback, resourcePath;

    options = this._.extractOptions(arguments);
    callback = this._.extractCallback(arguments);
    resourcePath = this._.getResourcePath(options.path || resourceName);

    this._.addPagesForSingularResource(resourceName, resourcePath, options);
    this._.executeCallback(callback, resourceName, resourcePath, true);
  },
  collection: function () {
    var args;

    if (this.resourcePath === undefined || this.singular) throw new Error("The collection method must be called within a plural resource definition.");

    args = Array.prototype.slice.call(arguments, 0);
    args.forEach(function (path) {
      this.page(this.resourcePath + '/' + path, this.resourcePath + '.' + path, {}, { action: path });
    }.bind(this));
  },
  member: function () {
    var args;

    if (this.resourcePath === undefined || this.singular) throw new Error("The member method must be called within a plural resource definition.");

    args = Array.prototype.slice.call(arguments, 0);
    args.forEach(function (path) {
      this.page(this.resourcePath + '/:id/' + path, this.resourcePath + '.' + path, { id: '\\d+' }, {}, { action: path });
    }.bind(this));
  },
  new: function () {
    var args;

    if (this.resourcePath === undefined) throw new Error("The member method must be called within a resource definition.");

    args = Array.prototype.slice.call(arguments, 0);
    args.forEach(function (path) {
      this.page(this.resourcePath + '/new/' + path, this.resourcePath + '.' + path, {}, { action: path });
    }.bind(this));
  },
  view: function () {
    var args;

    if (this.resourcePath === undefined || !this.singular) throw new Error("The view method must be called within a singular resource definition.");

    args = Array.prototype.slice.call(arguments, 0);
    args.forEach(function (path) {
      this.page(this.resourcePath + '/' + path, this.resourcePath + '.' + path, {}, { action: path });
    }.bind(this));
  },
  namespace: function (className) {
    var args, callback, options, namespacePath, path;

    args = Array.prototype.slice.call(arguments, 1);
    callback = args.pop();
    options = args.pop() || {};

    if (typeof callback !== 'function') throw new Error("The last argument must be a function.");
    if (callback.length === 0) throw new Error("Callback requires an argument.");

    path = options.path || className;
    if (this.namespacePath) namespacePath = this.namespacePath + '/' + path;else namespacePath = path;
    if (this.pathPrefix) path = this.pathPrefix + '/' + path;
    if (this.classNamePrefix) className = this.classNamePrefix + '.' + className;

    callback(new RoutingMapper(this.router, {
      namespacePath: namespacePath,
      pathPrefix: path,
      classNamePrefix: className
    }));
  }
});

// Internal properties of Cape.Component
var _Internal = function _Internal(main) {
  this.main = main;
};

// Internal methods of Cape.Component
_extends(_Internal.prototype, {
  extractKeys: function (path) {
    var keys = [],
        md;

    path.split('/').forEach(function (fragment) {
      if (md = fragment.match(/^:(\w+)$/)) keys.push(md[1]);
    });
    return keys;
  },
  constructRegexp: function (path, constraints) {
    var fragments = [],
        md;

    constraints = constraints || {};
    path.split('/').forEach(function (fragment) {
      if (md = fragment.match(/^:(\w+)$/)) {
        if (constraints[md[1]]) fragments.push('(' + constraints[md[1]] + ')');else fragments.push('([^/]+)');
      } else if (fragment.match(/^\w+$/)) {
        fragments.push(fragment);
      }
    });
    return new RegExp('^' + fragments.join('/') + '(?:\\?[\\w-]+(?:=[\\w-]*)?(?:&[\\w-]+(?:=[\\w-]*)?)*)?$');
  },
  extractOptions: function (args) {
    if (typeof args[1] === 'function') return {};else return args[1] || {};
  },
  extractCallback: function (args) {
    if (typeof args[1] === 'function') return args[1];else return args[2];
  },
  filterActions: function (actions, options) {
    var idx;

    options = options || {};
    if (typeof options['only'] === 'string') {
      actions.length = 0;
      actions.push(options['only']);
    }
    if (Array.isArray(options['only'])) {
      actions.length = 0;
      options['only'].forEach(function (name) {
        actions.push(name);
      });
    }
    if (typeof options['except'] === 'string') {
      idx = actions.indexOf(options['except']);
      if (idx !== -1) actions.splice(idx, 1);
    }
    if (Array.isArray(options['except'])) {
      options['except'].forEach(function (name) {
        idx = actions.indexOf(name);
        if (idx !== -1) actions.splice(idx, 1);
      });
    }
  },
  getResourcePath: function (path) {
    if (this.main.resourcePath) {
      if (this.main.singular) {
        path = this.main.resourcePath + '/' + path;
      } else {
        path = this.main.resourcePath + '/:' + Inflector.singularize(this.main.resourcePath) + '_id/' + path;
      }
    }
    return path;
  },
  addPagesForPluralResource: function (resourceName, resourcePath, options) {
    var actions = ['index', 'new', 'show', 'edit'],
        pathName;
    this.filterActions(actions, options);

    options.pathNames = options.pathNames || {};

    if (actions.indexOf('index') != -1) this.main.page(resourcePath, resourceName + '.list', {}, { resource: resourceName, action: 'index' });
    if (actions.indexOf('new') != -1) {
      pathName = options.pathNames.new ? options.pathNames.new : 'new';
      this.main.page(resourcePath + '/' + pathName, resourceName + '.form', {}, { resource: resourceName, action: 'new' });
    }
    if (actions.indexOf('show') != -1) this.main.page(resourcePath + '/:id', resourceName + '.item', { id: '\\d+' }, { resource: resourceName, action: 'show' });
    if (actions.indexOf('edit') != -1) {
      pathName = options.pathNames.edit ? options.pathNames.edit : 'edit';
      this.main.page(resourcePath + '/:id/' + pathName, resourceName + '.form', { id: '\\d+' }, { resource: resourceName, action: 'edit' });
    }
  },
  addPagesForSingularResource: function (resourceName, resourcePath, options) {
    var actions = ['new', 'show', 'edit'],
        pathName;
    this.filterActions(actions, options);

    options.pathNames = options.pathNames || {};

    if (actions.indexOf('show') != -1) this.main.page(resourcePath, resourceName + '.content', {}, { resource: resourceName, action: 'show' });
    if (actions.indexOf('new') != -1) {
      pathName = options.pathNames.new ? options.pathNames.new : 'new';
      this.main.page(resourcePath + '/' + pathName, resourceName + '.form', {}, { resource: resourceName, action: 'new' });
    }
    if (actions.indexOf('edit') != -1) {
      pathName = options.pathNames.edit ? options.pathNames.edit : 'edit';
      this.main.page(resourcePath + '/' + pathName, resourceName + '.form', {}, { resource: resourceName, action: 'edit' });
    }
  },
  executeCallback: function (callback, resourceName, resourcePath, singular) {
    if (typeof callback == 'function') {
      if (callback.length === 0) throw new Error("Callback requires an argument.");
      callback(new RoutingMapper(this.main.router, {
        singular: singular,
        pathPrefix: this.main.pathPrefix,
        resourcePath: resourcePath,
        classNamePrefix: this.main.classNamePrefix,
        resourceClassName: resourceName
      }));
    }
  }
});

module.exports = RoutingMapper;

},{"./utilities":15,"inflected":22}],15:[function(require,module,exports){
(function (global){
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var Cape = {};

// Merge the properties of two or more objects together into the first object.
Cape.extend = function () {
  var i, key;

  for (i = 1; i < arguments.length; i++) for (key in arguments[i]) if (arguments[i].hasOwnProperty(key)) arguments[0][key] = arguments[i][key];
  return arguments[0];
};

// Merge the properties of two or more objects together into the first object recursively.
Cape.deepExtend = function () {
  var i, key;

  for (i = 1; i < arguments.length; i++) for (key in arguments[i]) if (arguments[i].hasOwnProperty(key)) {
    if (typeof arguments[0][key] === 'object' && typeof arguments[i][key] === 'object') global.Cape.deepExtend(arguments[0][key], arguments[i][key]);else arguments[0][key] = arguments[i][key];
  }
  return arguments[0];
};

// Merge (but not override) the properties of two or more objects together
// into the first object
Cape.merge = function () {
  var i, key;

  for (i = 1; i < arguments.length; i++) for (key in arguments[i]) if (!arguments[0].hasOwnProperty(key) && arguments[i].hasOwnProperty(key)) arguments[0][key] = arguments[i][key];
  return arguments[0];
};

Cape.createComponentClass = function (methods) {
  var klass = function () {
    Cape.Component.apply(this, arguments);
    if (typeof methods.constructor === 'function') methods.constructor.apply(this, arguments);
  };
  _extends(klass.prototype, Cape.Component.prototype, methods);
  return klass;
};

Cape.createPartialClass = function (methods) {
  var klass = function () {
    Cape.Partial.apply(this, arguments);
    if (typeof methods.constructor === 'function') methods.constructor.apply(this, arguments);
  };
  _extends(klass.prototype, Cape.Partial.prototype, methods);
  return klass;
};

Cape.createDataStoreClass = function (methods) {
  var klass = function () {
    Cape.DataStore.apply(this, arguments);
    if (typeof methods.constructor === 'function') methods.constructor.apply(this, arguments);
  };
  _extends(klass.prototype, Cape.DataStore.prototype, methods);
  klass.create = Cape.DataStore.create;
  return klass;
};

Cape.createCollectionAgentClass = function (methods) {
  var klass = function () {
    Cape.CollectionAgent.apply(this, arguments);
    if (typeof methods.constructor === 'function') methods.constructor.apply(this, arguments);
    this._.applyAdapter();
  };
  _extends(klass.prototype, Cape.CollectionAgent.prototype, methods);
  return klass;
};

Cape.createResourceAgentClass = function (methods) {
  var klass = function () {
    Cape.ResourceAgent.apply(this, arguments);
    if (typeof methods.constructor === 'function') methods.constructor.apply(this, arguments);
    this._.applyAdapter();
  };
  _extends(klass.prototype, Cape.ResourceAgent.prototype, methods);
  return klass;
};

module.exports = Cape;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],16:[function(require,module,exports){
(function (global){
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var Cape = require('./utilities');

// Cape.VirtualForms
//
// This class is to be used by an instance of Cape.Component internally.
//
// public properties:
//   component: the component whose forms are represented by the instance of this class.
//   items: an object that keeps virtual forms, which keep attribute names and their values
//     to be applied to the component after it gets rendered.
// private properties:
//   _: the object that holds internal methods and properties of this class.
var VirtualForms = function VirtualForms(component) {
  this.component = component;
  this.items = {};
  this._ = new _Internal(this);
};

_extends(VirtualForms.prototype, {
  prepare: function () {
    this._.compile();
    global.Cape.deepExtend(this._.realForms, this.items);
    this._.tempForms = global.Cape.deepExtend({}, this._.realForms);
  },

  apply: function () {
    var forms, i, len, form, formName, tForm, j, elements, elem, elemName, k;

    forms = this.component.root.getElementsByTagName('form');

    for (i = 0, len = forms.length; i < len; i++) {
      form = forms[i];
      formName = form.getAttribute('name') || '';
      tForm = this._.tempForms[formName] || {};

      elements = form.getElementsByTagName('*');
      for (j = 0; j < elements.length; j++) {
        elem = elements[j];
        if (elem.value === undefined || elem.name === undefined) continue;
        if (elem.type === 'hidden') {
          if (elements[j + 1] && elements[j + 1].type === 'checkbox') continue;
        }
        elemName = elem.getAttribute('name');

        if (elem.type === 'checkbox') {
          if (elemName.slice(-2) === '[]' && Array.isArray(tForm[elemName])) {
            elem.checked = false;
            for (k = 0; k < tForm[elemName].length; k++) {
              if (elem.value === tForm[elemName][k]) {
                elem.checked = true;
                break;
              }
            }
          } else {
            elem.checked = tForm[elemName] === true || tForm[elemName] === '1';
          }
        } else if (elem.type === 'radio') {
          elem.checked = elem.value === tForm[elemName];
        } else {
          if (elem.value !== tForm[elemName]) elem.value = tForm[elemName] ? tForm[elemName] : '';
        }
      }
    }

    this.items = {};
    this._.compiled = false;
  },

  update: function (formName, options) {
    var tForm;

    tForm = this._.tempForms[formName];
    if (tForm === undefined) {
      tForm = this._.tempForms[formName] = {};
    }
    if (options.type === 'checkbox') {
      if (tForm[options.name] === undefined) tForm[options.name] = !!options.checked;
    } else if (options.type === 'radio' && options.checked) {
      if (tForm[options.name] === undefined) tForm[options.name] = options.value;
    } else {
      if (options.value) {
        if (tForm[options.name] === undefined) tForm[options.name] = options.value;
      }
    }
  },

  val: function (arg1, arg2) {
    var key1, key2, value;

    if (typeof arg1 === 'object') {
      for (key1 in arg1) {
        if (arg1.hasOwnProperty(key1)) {
          value = arg1[key1];
          if (typeof value === 'object') {
            for (key2 in value) {
              if (value.hasOwnProperty(key2)) {
                this._.setValue(key1 + '.' + key2, value[key2]);
              }
            }
          } else {
            this._.setValue(key1, value);
          }
        }
      }
    } else {
      if (arguments.length === 1) return this._.getValue(arg1);else return this._.setValue(arg1, arg2);
    }
  },

  setValues: function (formName, obj) {
    var key;

    if (typeof formName !== 'string') throw new Error("The first argument must be a string.");

    if (typeof obj !== 'object') throw new Error("The second argument must be an object.");

    if (!this.items[formName]) this.items[formName] = {};
    this._.setValuesOfNestedFields(formName, null, obj);
  },

  formData: function (formName) {
    var form, data, name, segments, lastSegment, obj;

    this._.compile();
    if (formName === undefined) formName = '';
    form = this._.realForms[formName] || {};

    data = {};

    for (name in form) {
      segments = name.split('/');
      lastSegment = segments.pop();
      obj = data;
      segments.forEach(function (segment) {
        if (!obj[segment]) obj[segment] = {};
        obj = obj[segment];
      });
      if (lastSegment.slice(-2) === '[]') {
        lastSegment = lastSegment.slice(0, -2);
      }
      obj[lastSegment] = form[name];
    }

    return data;
  },

  paramsFor: function (formName, options) {
    var paramName, params;

    options = options || {};
    paramName = options.as || formName;
    params = {};
    params[paramName] = this.formData(formName);
    return params;
  },

  jsonFor: function (formName, options) {
    var paramName, obj, params;

    options = options || {};
    paramName = options.as || formName;

    obj = this.formData(formName);
    obj = this._.object2array(obj);

    params = {};
    params[paramName] = obj;
    return JSON.stringify(params);
  },

  checkedOn: function (name) {
    var names, formName, attrName, forms, elements, cb, value;

    names = this._.getNames(name);
    formName = names[0];
    attrName = names[1];

    forms = this.component.root.getElementsByTagName('form');

    for (var i = 0; i < forms.length; i++) {
      elements = forms[i].getElementsByTagName('input');
      for (var j = 0; j < elements.length; j++) {
        if (elements[j].name === attrName && elements[j].type === 'checkbox') {
          cb = elements[j];
        }
      }
    }

    if (cb === undefined) return undefined;

    value = this._.getValue(name);

    return value === '1' || value === true;
  }
});

// Internal properties of Cape.VirtualForms
var _Internal = function _Internal(main) {
  this.main = main;
  this.realForms = {};
  this.tempForms = {};
  this.compiled = false;
};

// Internal methods of Cape.VirtualForms
_extends(_Internal.prototype, {
  getValue: function (name) {
    var names, formName, attrName, form, _form;

    names = this.getNames(name);
    formName = names[0];
    attrName = names[1];

    if (formName in this.main.items) {
      if (attrName in this.main.items[formName]) {
        return this.main.items[formName][attrName];
      }
    }
    if (!this.compiled) this.compile();

    if (formName in this.realForms) {
      if (attrName in this.realForms[formName]) {
        return this.realForms[formName][attrName];
      }
    }
    return '';
  },

  setValue: function (name, value) {
    var names, formName, attrName, origValue;

    names = this.getNames(name);
    formName = names[0];
    attrName = names[1];
    origValue = this.getValue(name);

    if (!this.main.items[formName]) this.main.items[formName] = {};
    this.main.items[formName][attrName] = value;

    return origValue;
  },

  setValuesOfNestedFields: function (formName, prefix, obj) {
    var attrName, key, self;

    for (key in obj) {
      attrName = prefix ? prefix + '/' + key : key;
      if (key.slice(-2) === '[]') {
        if (Array.isArray(obj[key])) {
          this.main.items[formName][attrName] = obj[key];
        }
      } else {
        if (Array.isArray(obj[key])) {
          self = this;
          obj[key].forEach(function (element, index) {
            self.setValuesOfNestedFields(formName, attrName + '/' + index, element);
          });
        } else if (typeof obj[key] === 'object') {
          this.setValuesOfNestedFields(formName, attrName, obj[key]);
        } else {
          this.main.items[formName][attrName] = obj[key];
        }
      }
    }
  },

  compile: function () {
    var forms, elements, i, j, elem, segments, lastSegment, obj, o, name;

    this.realForms = {};
    forms = this.main.component.root.getElementsByTagName('form');
    for (i = 0; i < forms.length; i++) {
      elements = forms[i].getElementsByTagName('*');
      obj = {};
      for (j = 0; j < elements.length; j++) {
        elem = elements[j];
        if (elem.name && elem.value !== undefined && !elem.disabled) {
          if (elem.type === 'checkbox') {
            if (elem.name.slice(-2) === '[]') {
              if (!Array.isArray(obj[elem.name])) obj[elem.name] = [];
              if (elem.checked) obj[elem.name].push(elem.value);
            } else {
              if (elem.checked) obj[elem.name] = elem.value;
            }
          } else if (elem.type === 'radio') {
            if (elem.checked) obj[elem.name] = elem.value;
          } else {
            obj[elem.name] = elem.value;
          }
        }
      }
      if (forms[i].getAttribute('name')) {
        this.realForms[forms[i].getAttribute('name')] = obj;
      } else {
        this.realForms[''] = obj;
      }
    }
    this.compiled = true;
  },

  getNames: function (name) {
    if (typeof name === 'string' && name.indexOf('.') >= 0) {
      return name.split('.', 2);
    } else {
      return ['', name];
    }
  },

  object2array: function (obj) {
    var isArray = true,
        _obj,
        key,
        ary = [];

    _obj = Cape.deepExtend({}, obj);
    for (key in _obj) {
      if (key.length === 0 || key.match(/\D/)) {
        isArray = false;
        if (typeof obj[key] === 'object') obj[key] = this.object2array(_obj[key]);
      } else {
        if (typeof obj[key] === 'object') ary.push(this.object2array(_obj[key]));else ary.push(obj[key]);
      }
    }

    if (isArray) return ary;else return obj;
  }
});

module.exports = VirtualForms;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./utilities":15}],17:[function(require,module,exports){
/*!
 * Cross-Browser Split 1.1.1
 * Copyright 2007-2012 Steven Levithan <stevenlevithan.com>
 * Available under the MIT License
 * ECMAScript compliant, uniform cross-browser split method
 */

/**
 * Splits a string into an array of strings using a regex or string separator. Matches of the
 * separator are not included in the result array. However, if `separator` is a regex that contains
 * capturing groups, backreferences are spliced into the result each time `separator` is matched.
 * Fixes browser bugs compared to the native `String.prototype.split` and can be used reliably
 * cross-browser.
 * @param {String} str String to split.
 * @param {RegExp|String} separator Regex or string to use for separating the string.
 * @param {Number} [limit] Maximum number of items to include in the result array.
 * @returns {Array} Array of substrings.
 * @example
 *
 * // Basic use
 * split('a b c d', ' ');
 * // -> ['a', 'b', 'c', 'd']
 *
 * // With limit
 * split('a b c d', ' ', 2);
 * // -> ['a', 'b']
 *
 * // Backreferences in result array
 * split('..word1 word2..', /([a-z]+)(\d+)/i);
 * // -> ['..', 'word', '1', ' ', 'word', '2', '..']
 */
module.exports = (function split(undef) {

  var nativeSplit = String.prototype.split,
    compliantExecNpcg = /()??/.exec("")[1] === undef,
    // NPCG: nonparticipating capturing group
    self;

  self = function(str, separator, limit) {
    // If `separator` is not a regex, use `nativeSplit`
    if (Object.prototype.toString.call(separator) !== "[object RegExp]") {
      return nativeSplit.call(str, separator, limit);
    }
    var output = [],
      flags = (separator.ignoreCase ? "i" : "") + (separator.multiline ? "m" : "") + (separator.extended ? "x" : "") + // Proposed for ES6
      (separator.sticky ? "y" : ""),
      // Firefox 3+
      lastLastIndex = 0,
      // Make `global` and avoid `lastIndex` issues by working with a copy
      separator = new RegExp(separator.source, flags + "g"),
      separator2, match, lastIndex, lastLength;
    str += ""; // Type-convert
    if (!compliantExecNpcg) {
      // Doesn't need flags gy, but they don't hurt
      separator2 = new RegExp("^" + separator.source + "$(?!\\s)", flags);
    }
    /* Values for `limit`, per the spec:
     * If undefined: 4294967295 // Math.pow(2, 32) - 1
     * If 0, Infinity, or NaN: 0
     * If positive number: limit = Math.floor(limit); if (limit > 4294967295) limit -= 4294967296;
     * If negative number: 4294967296 - Math.floor(Math.abs(limit))
     * If other: Type-convert, then use the above rules
     */
    limit = limit === undef ? -1 >>> 0 : // Math.pow(2, 32) - 1
    limit >>> 0; // ToUint32(limit)
    while (match = separator.exec(str)) {
      // `separator.lastIndex` is not reliable cross-browser
      lastIndex = match.index + match[0].length;
      if (lastIndex > lastLastIndex) {
        output.push(str.slice(lastLastIndex, match.index));
        // Fix browsers whose `exec` methods don't consistently return `undefined` for
        // nonparticipating capturing groups
        if (!compliantExecNpcg && match.length > 1) {
          match[0].replace(separator2, function() {
            for (var i = 1; i < arguments.length - 2; i++) {
              if (arguments[i] === undef) {
                match[i] = undef;
              }
            }
          });
        }
        if (match.length > 1 && match.index < str.length) {
          Array.prototype.push.apply(output, match.slice(1));
        }
        lastLength = match[0].length;
        lastLastIndex = lastIndex;
        if (output.length >= limit) {
          break;
        }
      }
      if (separator.lastIndex === match.index) {
        separator.lastIndex++; // Avoid an infinite loop
      }
    }
    if (lastLastIndex === str.length) {
      if (lastLength || !separator.test("")) {
        output.push("");
      }
    } else {
      output.push(str.slice(lastLastIndex));
    }
    return output.length > limit ? output.slice(0, limit) : output;
  };

  return self;
})();

},{}],18:[function(require,module,exports){
'use strict';

var OneVersionConstraint = require('individual/one-version');

var MY_VERSION = '7';
OneVersionConstraint('ev-store', MY_VERSION);

var hashKey = '__EV_STORE_KEY@' + MY_VERSION;

module.exports = EvStore;

function EvStore(elem) {
    var hash = elem[hashKey];

    if (!hash) {
        hash = elem[hashKey] = {};
    }

    return hash;
}

},{"individual/one-version":21}],19:[function(require,module,exports){
(function (global){
var topLevel = typeof global !== 'undefined' ? global :
    typeof window !== 'undefined' ? window : {}
var minDoc = require('min-document');

if (typeof document !== 'undefined') {
    module.exports = document;
} else {
    var doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'];

    if (!doccy) {
        doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'] = minDoc;
    }

    module.exports = doccy;
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"min-document":61}],20:[function(require,module,exports){
(function (global){
'use strict';

/*global window, global*/

var root = typeof window !== 'undefined' ?
    window : typeof global !== 'undefined' ?
    global : {};

module.exports = Individual;

function Individual(key, value) {
    if (key in root) {
        return root[key];
    }

    root[key] = value;

    return value;
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],21:[function(require,module,exports){
'use strict';

var Individual = require('./index.js');

module.exports = OneVersion;

function OneVersion(moduleName, version, defaultValue) {
    var key = '__INDIVIDUAL_ONE_VERSION_' + moduleName;
    var enforceKey = key + '_ENFORCE_SINGLETON';

    var versionValue = Individual(enforceKey, version);

    if (versionValue !== version) {
        throw new Error('Can only have one copy of ' +
            moduleName + '.\n' +
            'You already have version ' + versionValue +
            ' installed.\n' +
            'This means you cannot install version ' + version);
    }

    return Individual(key, defaultValue);
}

},{"./index.js":20}],22:[function(require,module,exports){
"use strict";

module.exports = require('./lib/Inflector');

},{"./lib/Inflector":24}],23:[function(require,module,exports){
(function (process,global){
'use strict';

var hasProp = require('./hasProp');
var remove  = require('./remove');
var icPart  = require('./icPart');

function Inflections() {
  this.plurals = [];
  this.singulars = [];
  this.uncountables = [];
  this.humans = [];
  this.acronyms = {};
  this.acronymRegex = /(?=a)b/;
}

Inflections.getInstance = function(locale) {
  var storage = typeof process !== 'undefined' ? process : global;
  storage.__Inflector_Inflections = storage.__Inflector_Inflections || {};
  storage.__Inflector_Inflections[locale] = storage.__Inflector_Inflections[locale] || new Inflections();

  return storage.__Inflector_Inflections[locale];
};

Inflections.prototype.acronym = function(word) {
  this.acronyms[word.toLowerCase()] = word;

  var values = [];

  for (var key in this.acronyms) {
    if (hasProp(this.acronyms, key)) {
      values.push(this.acronyms[key]);
    }
  }

  this.acronymRegex = new RegExp(values.join('|'));
};

Inflections.prototype.plural = function(rule, replacement) {
  if (typeof rule === 'string') {
    remove(this.uncountables, rule);
  }

  remove(this.uncountables, replacement);
  this.plurals.unshift([rule, replacement]);
};

Inflections.prototype.singular = function(rule, replacement) {
  if (typeof rule === 'string') {
    remove(this.uncountables, rule);
  }

  remove(this.uncountables, replacement);
  this.singulars.unshift([rule, replacement]);
};

Inflections.prototype.irregular = function(singular, plural) {
  remove(this.uncountables, singular);
  remove(this.uncountables, plural);

  var s0 = singular[0];
  var sRest = singular.substr(1);

  var p0 = plural[0];
  var pRest = plural.substr(1);

  if (s0.toUpperCase() === p0.toUpperCase()) {
    this.plural(new RegExp('(' + s0 + ')' + sRest + '$', 'i'), '$1' + pRest);
    this.plural(new RegExp('(' + p0 + ')' + pRest + '$', 'i'), '$1' + pRest);

    this.singular(new RegExp('(' + s0 + ')' + sRest + '$', 'i'), '$1' + sRest);
    this.singular(new RegExp('(' + p0 + ')' + pRest + '$', 'i'), '$1' + sRest);
  } else {
    var sRestIC = icPart(sRest);
    var pRestIC = icPart(pRest);

    this.plural(new RegExp(s0.toUpperCase() + sRestIC + '$'), p0.toUpperCase() + pRest);
    this.plural(new RegExp(s0.toLowerCase() + sRestIC + '$'), p0.toLowerCase() + pRest);
    this.plural(new RegExp(p0.toUpperCase() + pRestIC + '$'), p0.toUpperCase() + pRest);
    this.plural(new RegExp(p0.toLowerCase() + pRestIC + '$'), p0.toLowerCase() + pRest);

    this.singular(new RegExp(s0.toUpperCase() + sRestIC + '$'), s0.toUpperCase() + sRest);
    this.singular(new RegExp(s0.toLowerCase() + sRestIC + '$'), s0.toLowerCase() + sRest);
    this.singular(new RegExp(p0.toUpperCase() + pRestIC + '$'), s0.toUpperCase() + sRest);
    this.singular(new RegExp(p0.toLowerCase() + pRestIC + '$'), s0.toLowerCase() + sRest);
  }
};

Inflections.prototype.uncountable = function() {
  var words = Array.prototype.slice.call(arguments, 0);
  this.uncountables = this.uncountables.concat(words);
};

Inflections.prototype.human = function(rule, replacement) {
  this.humans.unshift([rule, replacement]);
};

Inflections.prototype.clear = function(scope) {
  scope = scope || 'all';

  if (scope === 'all') {
    this.plurals = [];
    this.singulars = [];
    this.uncountables = [];
    this.humans = [];
  } else {
    this[scope] = [];
  }
};

module.exports = Inflections;

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./hasProp":28,"./icPart":29,"./remove":31,"_process":62}],24:[function(require,module,exports){
'use strict';

var Inflections     = require('./Inflections');
var Transliterator  = require('./Transliterator');
var Methods         = require('./Methods');
var defaults        = require('./defaults');
var isFunc          = require('./isFunc');

var Inflector = Methods;

Inflector.inflections = function(locale, fn) {
  if (isFunc(locale)) {
    fn = locale;
    locale = null;
  }

  locale = locale || 'en';

  if (fn) {
    fn(Inflections.getInstance(locale));
  } else {
    return Inflections.getInstance(locale);
  }
};

Inflector.transliterations = function(locale, fn) {
  if (isFunc(locale)) {
    fn = locale;
    locale = null;
  }

  locale = locale || 'en';

  if (fn) {
    fn(Transliterator.getInstance(locale));
  } else {
    return Transliterator.getInstance(locale);
  }
}

for (var locale in defaults) {
  Inflector.inflections(locale, defaults[locale]);
}

module.exports = Inflector;

},{"./Inflections":23,"./Methods":25,"./Transliterator":26,"./defaults":27,"./isFunc":30}],25:[function(require,module,exports){
'use strict';

var Methods = {
  pluralize: function(word, locale) {
    locale = locale || 'en';

    return this._applyInflections(word, this.inflections(locale).plurals);
  },

  singularize: function(word, locale) {
    locale = locale || 'en';

    return this._applyInflections(word, this.inflections(locale).singulars);
  },

  camelize: function(term, uppercaseFirstLetter) {
    if (uppercaseFirstLetter === null || uppercaseFirstLetter === undefined) {
      uppercaseFirstLetter = true;
    }

    var result = '' + term, self = this;

    if (uppercaseFirstLetter) {
      result = result.replace(/^[a-z\d]*/, function(a) {
        return self.inflections().acronyms[a] || self.capitalize(a);
      });
    } else {
      result = result.replace(new RegExp('^(?:' + this.inflections().acronymRegex.source + '(?=\\b|[A-Z_])|\\w)'), function(a) {
        return a.toLowerCase();
      });
    }

    result = result.replace(/(?:_|(\/))([a-z\d]*)/gi, function(match, a, b, idx, string) {
      a || (a = '');
      return '' + a + (self.inflections().acronyms[b] || self.capitalize(b));
    });

    return result;
  },

  underscore: function(camelCasedWord) {
    var result = '' + camelCasedWord;

    result = result.replace(new RegExp('(?:([A-Za-z\\d])|^)(' + this.inflections().acronymRegex.source + ')(?=\\b|[^a-z])', 'g'), function(match, $1, $2) {
      return '' + ($1 || '') + ($1 ? '_' : '') + $2.toLowerCase();
    });

    result = result.replace(/([A-Z\d]+)([A-Z][a-z])/g, '$1_$2');
    result = result.replace(/([a-z\d])([A-Z])/g, '$1_$2');
    result = result.replace(/-/g, '_');

    return result.toLowerCase();
  },

  humanize: function(lowerCaseAndUnderscoredWord, options) {
    var result = '' + lowerCaseAndUnderscoredWord;
    var humans = this.inflections().humans;
    var human, rule, replacement;
    var self = this;

    options = options || {};

    if (options.capitalize === null || options.capitalize === undefined) {
      options.capitalize = true;
    }

    for (var i = 0, ii = humans.length; i < ii; i++) {
      human = humans[i];
      rule = human[0];
      replacement = human[1];

      if (rule.test && rule.test(result) || result.indexOf(rule) > -1) {
        result = result.replace(rule, replacement);
        break;
      }
    }

    result = result.replace(/_id$/, '');
    result = result.replace(/_/g, ' ');

    result = result.replace(/([a-z\d]*)/gi, function(match) {
      return self.inflections().acronyms[match] || match.toLowerCase();
    });

    if (options.capitalize) {
      result = result.replace(/^\w/, function(match) {
        return match.toUpperCase();
      });
    }

    return result;
  },

  capitalize: function(str) {
    var result = str === null || str === undefined ? '' : String(str);
    return result.charAt(0).toUpperCase() + result.slice(1);
  },

  titleize: function(word) {
    return this.humanize(this.underscore(word)).replace(/(^|[\s¿\/]+)([a-z])/g, function(match, boundary, letter, idx, string) {
      return match.replace(letter, letter.toUpperCase());
    });
  },

  tableize: function(className) {
    return this.pluralize(this.underscore(className));
  },

  classify: function(tableName) {
    return this.camelize(this.singularize(tableName.replace(/.*\./g, '')));
  },

  dasherize: function(underscoredWord) {
    return underscoredWord.replace(/_/g, '-');
  },

  foreignKey: function(className, separateWithUnderscore) {
    if (separateWithUnderscore === null || separateWithUnderscore === undefined) {
      separateWithUnderscore = true;
    }

    return this.underscore(className) + (separateWithUnderscore ? '_id' : 'id');
  },

  ordinal: function(number) {
    var absNumber = Math.abs(Number(number));
    var mod100 = absNumber % 100;

    if (mod100 === 11 || mod100 === 12 || mod100 === 13) {
      return 'th';
    } else {
      switch (absNumber % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
      }
    }
  },

  ordinalize: function(number) {
    return '' + number + this.ordinal(number);
  },

  transliterate: function(string, options) {
    options = options || {};

    var locale      = options.locale || 'en';
    var replacement = options.replacement || '?';

    return this.transliterations(locale).transliterate(string, replacement);
  },

  parameterize: function(string, options) {
    options = options || {};

    if (options.separator === undefined) {
      options.separator = '-';
    }

    if (options.separator === null) {
      options.separator = '';
    }

    // replace accented chars with their ascii equivalents
    var result = this.transliterate(string, options);

    result = result.replace(/[^a-z0-9\-_]+/ig, options.separator);

    if (options.separator.length) {
      var separatorRegex = new RegExp(options.separator);

      // no more than one of the separator in a row
      result = result.replace(new RegExp(separatorRegex.source + '{2,}'), options.separator);

      // remove leading/trailing separator
      result = result.replace(new RegExp('^' + separatorRegex.source + '|' + separatorRegex.source + '$', 'i'), '');
    }

    return result.toLowerCase();
  },

  _applyInflections: function(word, rules) {
    var result = '' + word, rule, regex, replacement;

    if (result.length === 0) {
      return result;
    } else {
      var match = result.toLowerCase().match(/\b\w+$/);

      if (match && this.inflections().uncountables.indexOf(match[0]) > -1) {
        return result;
      } else {
        for (var i = 0, ii = rules.length; i < ii; i++) {
          rule = rules[i];

          regex = rule[0];
          replacement = rule[1];

          if (result.match(regex)) {
            result = result.replace(regex, replacement);
            break;
          }
        }

        return result;
      }
    }
  }
};

module.exports = Methods;

},{}],26:[function(require,module,exports){
(function (process,global){
'use strict';

var DEFAULT_APPROXIMATIONS = {
  'À': 'A',   'Á': 'A',   'Â': 'A',   'Ã': 'A',   'Ä': 'A',   'Å': 'A',   'Æ': 'AE',
  'Ç': 'C',   'È': 'E',   'É': 'E',   'Ê': 'E',   'Ë': 'E',   'Ì': 'I',   'Í': 'I',
  'Î': 'I',   'Ï': 'I',   'Ð': 'D',   'Ñ': 'N',   'Ò': 'O',   'Ó': 'O',   'Ô': 'O',
  'Õ': 'O',   'Ö': 'O',   '×': 'x',   'Ø': 'O',   'Ù': 'U',   'Ú': 'U',   'Û': 'U',
  'Ü': 'U',   'Ý': 'Y',   'Þ': 'Th',  'ß': 'ss',  'à': 'a',   'á': 'a',   'â': 'a',
  'ã': 'a',   'ä': 'a',   'å': 'a',   'æ': 'ae',  'ç': 'c',   'è': 'e',   'é': 'e',
  'ê': 'e',   'ë': 'e',   'ì': 'i',   'í': 'i',   'î': 'i',   'ï': 'i',   'ð': 'd',
  'ñ': 'n',   'ò': 'o',   'ó': 'o',   'ô': 'o',   'õ': 'o',   'ö': 'o',   'ø': 'o',
  'ù': 'u',   'ú': 'u',   'û': 'u',   'ü': 'u',   'ý': 'y',   'þ': 'th',  'ÿ': 'y',
  'Ā': 'A',   'ā': 'a',   'Ă': 'A',   'ă': 'a',   'Ą': 'A',   'ą': 'a',   'Ć': 'C',
  'ć': 'c',   'Ĉ': 'C',   'ĉ': 'c',   'Ċ': 'C',   'ċ': 'c',   'Č': 'C',   'č': 'c',
  'Ď': 'D',   'ď': 'd',   'Đ': 'D',   'đ': 'd',   'Ē': 'E',   'ē': 'e',   'Ĕ': 'E',
  'ĕ': 'e',   'Ė': 'E',   'ė': 'e',   'Ę': 'E',   'ę': 'e',   'Ě': 'E',   'ě': 'e',
  'Ĝ': 'G',   'ĝ': 'g',   'Ğ': 'G',   'ğ': 'g',   'Ġ': 'G',   'ġ': 'g',   'Ģ': 'G',
  'ģ': 'g',   'Ĥ': 'H',   'ĥ': 'h',   'Ħ': 'H',   'ħ': 'h',   'Ĩ': 'I',   'ĩ': 'i',
  'Ī': 'I',   'ī': 'i',   'Ĭ': 'I',   'ĭ': 'i',   'Į': 'I',   'į': 'i',   'İ': 'I',
  'ı': 'i',   'Ĳ': 'IJ',  'ĳ': 'ij',  'Ĵ': 'J',   'ĵ': 'j',   'Ķ': 'K',   'ķ': 'k',
  'ĸ': 'k',   'Ĺ': 'L',   'ĺ': 'l',   'Ļ': 'L',   'ļ': 'l',   'Ľ': 'L',   'ľ': 'l',
  'Ŀ': 'L',   'ŀ': 'l',   'Ł': 'L',   'ł': 'l',   'Ń': 'N',   'ń': 'n',   'Ņ': 'N',
  'ņ': 'n',   'Ň': 'N',   'ň': 'n',   'ŉ': '\'n', 'Ŋ': 'NG',  'ŋ': 'ng',
  'Ō': 'O',   'ō': 'o',   'Ŏ': 'O',   'ŏ': 'o',   'Ő': 'O',   'ő': 'o',   'Œ': 'OE',
  'œ': 'oe',  'Ŕ': 'R',   'ŕ': 'r',   'Ŗ': 'R',   'ŗ': 'r',   'Ř': 'R',   'ř': 'r',
  'Ś': 'S',   'ś': 's',   'Ŝ': 'S',   'ŝ': 's',   'Ş': 'S',   'ş': 's',   'Š': 'S',
  'š': 's',   'Ţ': 'T',   'ţ': 't',   'Ť': 'T',   'ť': 't',   'Ŧ': 'T',   'ŧ': 't',
  'Ũ': 'U',   'ũ': 'u',   'Ū': 'U',   'ū': 'u',   'Ŭ': 'U',   'ŭ': 'u',   'Ů': 'U',
  'ů': 'u',   'Ű': 'U',   'ű': 'u',   'Ų': 'U',   'ų': 'u',   'Ŵ': 'W',   'ŵ': 'w',
  'Ŷ': 'Y',   'ŷ': 'y',   'Ÿ': 'Y',   'Ź': 'Z',   'ź': 'z',   'Ż': 'Z',   'ż': 'z',
  'Ž': 'Z',   'ž': 'z'
};

var DEFAULT_REPLACEMENT_CHAR = '?';

function Transliterator() {
  this.approximations = {};

  for (var c in DEFAULT_APPROXIMATIONS) {
    this.approximate(c, DEFAULT_APPROXIMATIONS[c]);
  }
}

Transliterator.getInstance = function(locale) {
  var storage = typeof process !== 'undefined' ? process : global;
  storage.__Inflector_Transliterator = storage.__Inflector_Transliterator || {};
  storage.__Inflector_Transliterator[locale] = storage.__Inflector_Transliterator[locale] || new Transliterator();

  return storage.__Inflector_Transliterator[locale];
};

Transliterator.prototype.approximate = function(string, replacement) {
  this.approximations[string] = replacement;
};

Transliterator.prototype.transliterate = function(string, replacement) {
  var self = this;

  return string.replace(/[^\u0000-\u007f]/g, function(c) {
    return self.approximations[c] || replacement || DEFAULT_REPLACEMENT_CHAR;
  });
};

module.exports = Transliterator;

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"_process":62}],27:[function(require,module,exports){
'use strict';

function enDefaults(inflect) {
  inflect.plural(/$/, 's');
  inflect.plural(/s$/i, 's');
  inflect.plural(/^(ax|test)is$/i, '$1es');
  inflect.plural(/(octop|vir)us$/i, '$1i');
  inflect.plural(/(octop|vir)i$/i, '$1i');
  inflect.plural(/(alias|status)$/i, '$1es');
  inflect.plural(/(bu)s$/i, '$1ses');
  inflect.plural(/(buffal|tomat)o$/i, '$1oes');
  inflect.plural(/([ti])um$/i, '$1a');
  inflect.plural(/([ti])a$/i, '$1a');
  inflect.plural(/sis$/i, 'ses');
  inflect.plural(/(?:([^f])fe|([lr])f)$/i, '$1$2ves');
  inflect.plural(/(hive)$/i, '$1s');
  inflect.plural(/([^aeiouy]|qu)y$/i, '$1ies');
  inflect.plural(/(x|ch|ss|sh)$/i, '$1es');
  inflect.plural(/(matr|vert|ind)(?:ix|ex)$/i, '$1ices');
  inflect.plural(/^(m|l)ouse$/i, '$1ice');
  inflect.plural(/^(m|l)ice$/i, '$1ice');
  inflect.plural(/^(ox)$/i, '$1en');
  inflect.plural(/^(oxen)$/i, '$1');
  inflect.plural(/(quiz)$/i, '$1zes');

  inflect.singular(/s$/i, '');
  inflect.singular(/(ss)$/i, '$1');
  inflect.singular(/(n)ews$/i, '$1ews');
  inflect.singular(/([ti])a$/i, '$1um');
  inflect.singular(/((a)naly|(b)a|(d)iagno|(p)arenthe|(p)rogno|(s)ynop|(t)he)(sis|ses)$/i, '$1sis');
  inflect.singular(/(^analy)(sis|ses)$/i, '$1sis');
  inflect.singular(/([^f])ves$/i, '$1fe');
  inflect.singular(/(hive)s$/i, '$1');
  inflect.singular(/(tive)s$/i, '$1');
  inflect.singular(/([lr])ves$/i, '$1f');
  inflect.singular(/([^aeiouy]|qu)ies$/i, '$1y');
  inflect.singular(/(s)eries$/i, '$1eries');
  inflect.singular(/(m)ovies$/i, '$1ovie');
  inflect.singular(/(x|ch|ss|sh)es$/i, '$1');
  inflect.singular(/^(m|l)ice$/i, '$1ouse');
  inflect.singular(/(bus)(es)?$/i, '$1');
  inflect.singular(/(o)es$/i, '$1');
  inflect.singular(/(shoe)s$/i, '$1');
  inflect.singular(/(cris|test)(is|es)$/i, '$1is');
  inflect.singular(/^(a)x[ie]s$/i, '$1xis');
  inflect.singular(/(octop|vir)(us|i)$/i, '$1us');
  inflect.singular(/(alias|status)(es)?$/i, '$1');
  inflect.singular(/^(ox)en/i, '$1');
  inflect.singular(/(vert|ind)ices$/i, '$1ex');
  inflect.singular(/(matr)ices$/i, '$1ix');
  inflect.singular(/(quiz)zes$/i, '$1');
  inflect.singular(/(database)s$/i, '$1');

  inflect.irregular('person', 'people');
  inflect.irregular('man', 'men');
  inflect.irregular('child', 'children');
  inflect.irregular('sex', 'sexes');
  inflect.irregular('move', 'moves');
  inflect.irregular('zombie', 'zombies');

  inflect.uncountable('equipment', 'information', 'rice', 'money', 'species', 'series', 'fish', 'sheep', 'jeans', 'police');
}

module.exports = {
  en: enDefaults
};

},{}],28:[function(require,module,exports){
'use strict';

var hasOwnProp = Object.prototype.hasOwnProperty;

function hasProp(obj, key) {
  return hasOwnProp.call(obj, key);
}

module.exports = hasProp;

},{}],29:[function(require,module,exports){
'use strict';

function icPart(str) {
  return str.split('').map(function(c) { return '(?:' + [c.toUpperCase(), c.toLowerCase()].join('|') + ')'; }).join('')
}

module.exports = icPart;

},{}],30:[function(require,module,exports){
'use strict';

var toString = Object.prototype.toString;

function isFunc(obj) {
  return toString.call(obj) === '[object Function]';
}

module.exports = isFunc;

},{}],31:[function(require,module,exports){
'use strict';

var splice = Array.prototype.splice;

function remove(arr, elem) {
  for (var i = arr.length - 1; i >= 0; i--) {
    if (arr[i] === elem) {
       splice.call(arr, i, 1);
    }
  }
}

module.exports = remove;

},{}],32:[function(require,module,exports){
"use strict";

module.exports = function isObject(x) {
	return typeof x === "object" && x !== null;
};

},{}],33:[function(require,module,exports){
var createElement = require("./vdom/create-element.js")

module.exports = createElement

},{"./vdom/create-element.js":39}],34:[function(require,module,exports){
var diff = require("./vtree/diff.js")

module.exports = diff

},{"./vtree/diff.js":59}],35:[function(require,module,exports){
var h = require("./virtual-hyperscript/index.js")

module.exports = h

},{"./virtual-hyperscript/index.js":46}],36:[function(require,module,exports){
var diff = require("./diff.js")
var patch = require("./patch.js")
var h = require("./h.js")
var create = require("./create-element.js")
var VNode = require('./vnode/vnode.js')
var VText = require('./vnode/vtext.js')

module.exports = {
    diff: diff,
    patch: patch,
    h: h,
    create: create,
    VNode: VNode,
    VText: VText
}

},{"./create-element.js":33,"./diff.js":34,"./h.js":35,"./patch.js":37,"./vnode/vnode.js":55,"./vnode/vtext.js":57}],37:[function(require,module,exports){
var patch = require("./vdom/patch.js")

module.exports = patch

},{"./vdom/patch.js":42}],38:[function(require,module,exports){
var isObject = require("is-object")
var isHook = require("../vnode/is-vhook.js")

module.exports = applyProperties

function applyProperties(node, props, previous) {
    for (var propName in props) {
        var propValue = props[propName]

        if (propValue === undefined) {
            removeProperty(node, propName, propValue, previous);
        } else if (isHook(propValue)) {
            removeProperty(node, propName, propValue, previous)
            if (propValue.hook) {
                propValue.hook(node,
                    propName,
                    previous ? previous[propName] : undefined)
            }
        } else {
            if (isObject(propValue)) {
                patchObject(node, props, previous, propName, propValue);
            } else {
                node[propName] = propValue
            }
        }
    }
}

function removeProperty(node, propName, propValue, previous) {
    if (previous) {
        var previousValue = previous[propName]

        if (!isHook(previousValue)) {
            if (propName === "attributes") {
                for (var attrName in previousValue) {
                    node.removeAttribute(attrName)
                }
            } else if (propName === "style") {
                for (var i in previousValue) {
                    node.style[i] = ""
                }
            } else if (typeof previousValue === "string") {
                node[propName] = ""
            } else {
                node[propName] = null
            }
        } else if (previousValue.unhook) {
            previousValue.unhook(node, propName, propValue)
        }
    }
}

function patchObject(node, props, previous, propName, propValue) {
    var previousValue = previous ? previous[propName] : undefined

    // Set attributes
    if (propName === "attributes") {
        for (var attrName in propValue) {
            var attrValue = propValue[attrName]

            if (attrValue === undefined) {
                node.removeAttribute(attrName)
            } else {
                node.setAttribute(attrName, attrValue)
            }
        }

        return
    }

    if(previousValue && isObject(previousValue) &&
        getPrototype(previousValue) !== getPrototype(propValue)) {
        node[propName] = propValue
        return
    }

    if (!isObject(node[propName])) {
        node[propName] = {}
    }

    var replacer = propName === "style" ? "" : undefined

    for (var k in propValue) {
        var value = propValue[k]
        node[propName][k] = (value === undefined) ? replacer : value
    }
}

function getPrototype(value) {
    if (Object.getPrototypeOf) {
        return Object.getPrototypeOf(value)
    } else if (value.__proto__) {
        return value.__proto__
    } else if (value.constructor) {
        return value.constructor.prototype
    }
}

},{"../vnode/is-vhook.js":50,"is-object":32}],39:[function(require,module,exports){
var document = require("global/document")

var applyProperties = require("./apply-properties")

var isVNode = require("../vnode/is-vnode.js")
var isVText = require("../vnode/is-vtext.js")
var isWidget = require("../vnode/is-widget.js")
var handleThunk = require("../vnode/handle-thunk.js")

module.exports = createElement

function createElement(vnode, opts) {
    var doc = opts ? opts.document || document : document
    var warn = opts ? opts.warn : null

    vnode = handleThunk(vnode).a

    if (isWidget(vnode)) {
        return vnode.init()
    } else if (isVText(vnode)) {
        return doc.createTextNode(vnode.text)
    } else if (!isVNode(vnode)) {
        if (warn) {
            warn("Item is not a valid virtual dom node", vnode)
        }
        return null
    }

    var node = (vnode.namespace === null) ?
        doc.createElement(vnode.tagName) :
        doc.createElementNS(vnode.namespace, vnode.tagName)

    var props = vnode.properties
    applyProperties(node, props)

    var children = vnode.children

    for (var i = 0; i < children.length; i++) {
        var childNode = createElement(children[i], opts)
        if (childNode) {
            node.appendChild(childNode)
        }
    }

    return node
}

},{"../vnode/handle-thunk.js":48,"../vnode/is-vnode.js":51,"../vnode/is-vtext.js":52,"../vnode/is-widget.js":53,"./apply-properties":38,"global/document":19}],40:[function(require,module,exports){
// Maps a virtual DOM tree onto a real DOM tree in an efficient manner.
// We don't want to read all of the DOM nodes in the tree so we use
// the in-order tree indexing to eliminate recursion down certain branches.
// We only recurse into a DOM node if we know that it contains a child of
// interest.

var noChild = {}

module.exports = domIndex

function domIndex(rootNode, tree, indices, nodes) {
    if (!indices || indices.length === 0) {
        return {}
    } else {
        indices.sort(ascending)
        return recurse(rootNode, tree, indices, nodes, 0)
    }
}

function recurse(rootNode, tree, indices, nodes, rootIndex) {
    nodes = nodes || {}


    if (rootNode) {
        if (indexInRange(indices, rootIndex, rootIndex)) {
            nodes[rootIndex] = rootNode
        }

        var vChildren = tree.children

        if (vChildren) {

            var childNodes = rootNode.childNodes

            for (var i = 0; i < tree.children.length; i++) {
                rootIndex += 1

                var vChild = vChildren[i] || noChild
                var nextIndex = rootIndex + (vChild.count || 0)

                // skip recursion down the tree if there are no nodes down here
                if (indexInRange(indices, rootIndex, nextIndex)) {
                    recurse(childNodes[i], vChild, indices, nodes, rootIndex)
                }

                rootIndex = nextIndex
            }
        }
    }

    return nodes
}

// Binary search for an index in the interval [left, right]
function indexInRange(indices, left, right) {
    if (indices.length === 0) {
        return false
    }

    var minIndex = 0
    var maxIndex = indices.length - 1
    var currentIndex
    var currentItem

    while (minIndex <= maxIndex) {
        currentIndex = ((maxIndex + minIndex) / 2) >> 0
        currentItem = indices[currentIndex]

        if (minIndex === maxIndex) {
            return currentItem >= left && currentItem <= right
        } else if (currentItem < left) {
            minIndex = currentIndex + 1
        } else  if (currentItem > right) {
            maxIndex = currentIndex - 1
        } else {
            return true
        }
    }

    return false;
}

function ascending(a, b) {
    return a > b ? 1 : -1
}

},{}],41:[function(require,module,exports){
var applyProperties = require("./apply-properties")

var isWidget = require("../vnode/is-widget.js")
var VPatch = require("../vnode/vpatch.js")

var updateWidget = require("./update-widget")

module.exports = applyPatch

function applyPatch(vpatch, domNode, renderOptions) {
    var type = vpatch.type
    var vNode = vpatch.vNode
    var patch = vpatch.patch

    switch (type) {
        case VPatch.REMOVE:
            return removeNode(domNode, vNode)
        case VPatch.INSERT:
            return insertNode(domNode, patch, renderOptions)
        case VPatch.VTEXT:
            return stringPatch(domNode, vNode, patch, renderOptions)
        case VPatch.WIDGET:
            return widgetPatch(domNode, vNode, patch, renderOptions)
        case VPatch.VNODE:
            return vNodePatch(domNode, vNode, patch, renderOptions)
        case VPatch.ORDER:
            reorderChildren(domNode, patch)
            return domNode
        case VPatch.PROPS:
            applyProperties(domNode, patch, vNode.properties)
            return domNode
        case VPatch.THUNK:
            return replaceRoot(domNode,
                renderOptions.patch(domNode, patch, renderOptions))
        default:
            return domNode
    }
}

function removeNode(domNode, vNode) {
    var parentNode = domNode.parentNode

    if (parentNode) {
        parentNode.removeChild(domNode)
    }

    destroyWidget(domNode, vNode);

    return null
}

function insertNode(parentNode, vNode, renderOptions) {
    var newNode = renderOptions.render(vNode, renderOptions)

    if (parentNode) {
        parentNode.appendChild(newNode)
    }

    return parentNode
}

function stringPatch(domNode, leftVNode, vText, renderOptions) {
    var newNode

    if (domNode.nodeType === 3) {
        domNode.replaceData(0, domNode.length, vText.text)
        newNode = domNode
    } else {
        var parentNode = domNode.parentNode
        newNode = renderOptions.render(vText, renderOptions)

        if (parentNode && newNode !== domNode) {
            parentNode.replaceChild(newNode, domNode)
        }
    }

    return newNode
}

function widgetPatch(domNode, leftVNode, widget, renderOptions) {
    var updating = updateWidget(leftVNode, widget)
    var newNode

    if (updating) {
        newNode = widget.update(leftVNode, domNode) || domNode
    } else {
        newNode = renderOptions.render(widget, renderOptions)
    }

    var parentNode = domNode.parentNode

    if (parentNode && newNode !== domNode) {
        parentNode.replaceChild(newNode, domNode)
    }

    if (!updating) {
        destroyWidget(domNode, leftVNode)
    }

    return newNode
}

function vNodePatch(domNode, leftVNode, vNode, renderOptions) {
    var parentNode = domNode.parentNode
    var newNode = renderOptions.render(vNode, renderOptions)

    if (parentNode && newNode !== domNode) {
        parentNode.replaceChild(newNode, domNode)
    }

    return newNode
}

function destroyWidget(domNode, w) {
    if (typeof w.destroy === "function" && isWidget(w)) {
        w.destroy(domNode)
    }
}

function reorderChildren(domNode, moves) {
    var childNodes = domNode.childNodes
    var keyMap = {}
    var node
    var remove
    var insert

    for (var i = 0; i < moves.removes.length; i++) {
        remove = moves.removes[i]
        node = childNodes[remove.from]
        if (remove.key) {
            keyMap[remove.key] = node
        }
        domNode.removeChild(node)
    }

    var length = childNodes.length
    for (var j = 0; j < moves.inserts.length; j++) {
        insert = moves.inserts[j]
        node = keyMap[insert.key]
        // this is the weirdest bug i've ever seen in webkit
        domNode.insertBefore(node, insert.to >= length++ ? null : childNodes[insert.to])
    }
}

function replaceRoot(oldRoot, newRoot) {
    if (oldRoot && newRoot && oldRoot !== newRoot && oldRoot.parentNode) {
        oldRoot.parentNode.replaceChild(newRoot, oldRoot)
    }

    return newRoot;
}

},{"../vnode/is-widget.js":53,"../vnode/vpatch.js":56,"./apply-properties":38,"./update-widget":43}],42:[function(require,module,exports){
var document = require("global/document")
var isArray = require("x-is-array")

var render = require("./create-element")
var domIndex = require("./dom-index")
var patchOp = require("./patch-op")
module.exports = patch

function patch(rootNode, patches, renderOptions) {
    renderOptions = renderOptions || {}
    renderOptions.patch = renderOptions.patch && renderOptions.patch !== patch
        ? renderOptions.patch
        : patchRecursive
    renderOptions.render = renderOptions.render || render

    return renderOptions.patch(rootNode, patches, renderOptions)
}

function patchRecursive(rootNode, patches, renderOptions) {
    var indices = patchIndices(patches)

    if (indices.length === 0) {
        return rootNode
    }

    var index = domIndex(rootNode, patches.a, indices)
    var ownerDocument = rootNode.ownerDocument

    if (!renderOptions.document && ownerDocument !== document) {
        renderOptions.document = ownerDocument
    }

    for (var i = 0; i < indices.length; i++) {
        var nodeIndex = indices[i]
        rootNode = applyPatch(rootNode,
            index[nodeIndex],
            patches[nodeIndex],
            renderOptions)
    }

    return rootNode
}

function applyPatch(rootNode, domNode, patchList, renderOptions) {
    if (!domNode) {
        return rootNode
    }

    var newNode

    if (isArray(patchList)) {
        for (var i = 0; i < patchList.length; i++) {
            newNode = patchOp(patchList[i], domNode, renderOptions)

            if (domNode === rootNode) {
                rootNode = newNode
            }
        }
    } else {
        newNode = patchOp(patchList, domNode, renderOptions)

        if (domNode === rootNode) {
            rootNode = newNode
        }
    }

    return rootNode
}

function patchIndices(patches) {
    var indices = []

    for (var key in patches) {
        if (key !== "a") {
            indices.push(Number(key))
        }
    }

    return indices
}

},{"./create-element":39,"./dom-index":40,"./patch-op":41,"global/document":19,"x-is-array":60}],43:[function(require,module,exports){
var isWidget = require("../vnode/is-widget.js")

module.exports = updateWidget

function updateWidget(a, b) {
    if (isWidget(a) && isWidget(b)) {
        if ("name" in a && "name" in b) {
            return a.id === b.id
        } else {
            return a.init === b.init
        }
    }

    return false
}

},{"../vnode/is-widget.js":53}],44:[function(require,module,exports){
'use strict';

var EvStore = require('ev-store');

module.exports = EvHook;

function EvHook(value) {
    if (!(this instanceof EvHook)) {
        return new EvHook(value);
    }

    this.value = value;
}

EvHook.prototype.hook = function (node, propertyName) {
    var es = EvStore(node);
    var propName = propertyName.substr(3);

    es[propName] = this.value;
};

EvHook.prototype.unhook = function(node, propertyName) {
    var es = EvStore(node);
    var propName = propertyName.substr(3);

    es[propName] = undefined;
};

},{"ev-store":18}],45:[function(require,module,exports){
'use strict';

module.exports = SoftSetHook;

function SoftSetHook(value) {
    if (!(this instanceof SoftSetHook)) {
        return new SoftSetHook(value);
    }

    this.value = value;
}

SoftSetHook.prototype.hook = function (node, propertyName) {
    if (node[propertyName] !== this.value) {
        node[propertyName] = this.value;
    }
};

},{}],46:[function(require,module,exports){
'use strict';

var isArray = require('x-is-array');

var VNode = require('../vnode/vnode.js');
var VText = require('../vnode/vtext.js');
var isVNode = require('../vnode/is-vnode');
var isVText = require('../vnode/is-vtext');
var isWidget = require('../vnode/is-widget');
var isHook = require('../vnode/is-vhook');
var isVThunk = require('../vnode/is-thunk');

var parseTag = require('./parse-tag.js');
var softSetHook = require('./hooks/soft-set-hook.js');
var evHook = require('./hooks/ev-hook.js');

module.exports = h;

function h(tagName, properties, children) {
    var childNodes = [];
    var tag, props, key, namespace;

    if (!children && isChildren(properties)) {
        children = properties;
        props = {};
    }

    props = props || properties || {};
    tag = parseTag(tagName, props);

    // support keys
    if (props.hasOwnProperty('key')) {
        key = props.key;
        props.key = undefined;
    }

    // support namespace
    if (props.hasOwnProperty('namespace')) {
        namespace = props.namespace;
        props.namespace = undefined;
    }

    // fix cursor bug
    if (tag === 'INPUT' &&
        !namespace &&
        props.hasOwnProperty('value') &&
        props.value !== undefined &&
        !isHook(props.value)
    ) {
        props.value = softSetHook(props.value);
    }

    transformProperties(props);

    if (children !== undefined && children !== null) {
        addChild(children, childNodes, tag, props);
    }


    return new VNode(tag, props, childNodes, key, namespace);
}

function addChild(c, childNodes, tag, props) {
    if (typeof c === 'string') {
        childNodes.push(new VText(c));
    } else if (typeof c === 'number') {
        childNodes.push(new VText(String(c)));
    } else if (isChild(c)) {
        childNodes.push(c);
    } else if (isArray(c)) {
        for (var i = 0; i < c.length; i++) {
            addChild(c[i], childNodes, tag, props);
        }
    } else if (c === null || c === undefined) {
        return;
    } else {
        throw UnexpectedVirtualElement({
            foreignObject: c,
            parentVnode: {
                tagName: tag,
                properties: props
            }
        });
    }
}

function transformProperties(props) {
    for (var propName in props) {
        if (props.hasOwnProperty(propName)) {
            var value = props[propName];

            if (isHook(value)) {
                continue;
            }

            if (propName.substr(0, 3) === 'ev-') {
                // add ev-foo support
                props[propName] = evHook(value);
            }
        }
    }
}

function isChild(x) {
    return isVNode(x) || isVText(x) || isWidget(x) || isVThunk(x);
}

function isChildren(x) {
    return typeof x === 'string' || isArray(x) || isChild(x);
}

function UnexpectedVirtualElement(data) {
    var err = new Error();

    err.type = 'virtual-hyperscript.unexpected.virtual-element';
    err.message = 'Unexpected virtual child passed to h().\n' +
        'Expected a VNode / Vthunk / VWidget / string but:\n' +
        'got:\n' +
        errorString(data.foreignObject) +
        '.\n' +
        'The parent vnode is:\n' +
        errorString(data.parentVnode)
        '\n' +
        'Suggested fix: change your `h(..., [ ... ])` callsite.';
    err.foreignObject = data.foreignObject;
    err.parentVnode = data.parentVnode;

    return err;
}

function errorString(obj) {
    try {
        return JSON.stringify(obj, null, '    ');
    } catch (e) {
        return String(obj);
    }
}

},{"../vnode/is-thunk":49,"../vnode/is-vhook":50,"../vnode/is-vnode":51,"../vnode/is-vtext":52,"../vnode/is-widget":53,"../vnode/vnode.js":55,"../vnode/vtext.js":57,"./hooks/ev-hook.js":44,"./hooks/soft-set-hook.js":45,"./parse-tag.js":47,"x-is-array":60}],47:[function(require,module,exports){
'use strict';

var split = require('browser-split');

var classIdSplit = /([\.#]?[a-zA-Z0-9\u007F-\uFFFF_:-]+)/;
var notClassId = /^\.|#/;

module.exports = parseTag;

function parseTag(tag, props) {
    if (!tag) {
        return 'DIV';
    }

    var noId = !(props.hasOwnProperty('id'));

    var tagParts = split(tag, classIdSplit);
    var tagName = null;

    if (notClassId.test(tagParts[1])) {
        tagName = 'DIV';
    }

    var classes, part, type, i;

    for (i = 0; i < tagParts.length; i++) {
        part = tagParts[i];

        if (!part) {
            continue;
        }

        type = part.charAt(0);

        if (!tagName) {
            tagName = part;
        } else if (type === '.') {
            classes = classes || [];
            classes.push(part.substring(1, part.length));
        } else if (type === '#' && noId) {
            props.id = part.substring(1, part.length);
        }
    }

    if (classes) {
        if (props.className) {
            classes.push(props.className);
        }

        props.className = classes.join(' ');
    }

    return props.namespace ? tagName : tagName.toUpperCase();
}

},{"browser-split":17}],48:[function(require,module,exports){
var isVNode = require("./is-vnode")
var isVText = require("./is-vtext")
var isWidget = require("./is-widget")
var isThunk = require("./is-thunk")

module.exports = handleThunk

function handleThunk(a, b) {
    var renderedA = a
    var renderedB = b

    if (isThunk(b)) {
        renderedB = renderThunk(b, a)
    }

    if (isThunk(a)) {
        renderedA = renderThunk(a, null)
    }

    return {
        a: renderedA,
        b: renderedB
    }
}

function renderThunk(thunk, previous) {
    var renderedThunk = thunk.vnode

    if (!renderedThunk) {
        renderedThunk = thunk.vnode = thunk.render(previous)
    }

    if (!(isVNode(renderedThunk) ||
            isVText(renderedThunk) ||
            isWidget(renderedThunk))) {
        throw new Error("thunk did not return a valid node");
    }

    return renderedThunk
}

},{"./is-thunk":49,"./is-vnode":51,"./is-vtext":52,"./is-widget":53}],49:[function(require,module,exports){
module.exports = isThunk

function isThunk(t) {
    return t && t.type === "Thunk"
}

},{}],50:[function(require,module,exports){
module.exports = isHook

function isHook(hook) {
    return hook &&
      (typeof hook.hook === "function" && !hook.hasOwnProperty("hook") ||
       typeof hook.unhook === "function" && !hook.hasOwnProperty("unhook"))
}

},{}],51:[function(require,module,exports){
var version = require("./version")

module.exports = isVirtualNode

function isVirtualNode(x) {
    return x && x.type === "VirtualNode" && x.version === version
}

},{"./version":54}],52:[function(require,module,exports){
var version = require("./version")

module.exports = isVirtualText

function isVirtualText(x) {
    return x && x.type === "VirtualText" && x.version === version
}

},{"./version":54}],53:[function(require,module,exports){
module.exports = isWidget

function isWidget(w) {
    return w && w.type === "Widget"
}

},{}],54:[function(require,module,exports){
module.exports = "2"

},{}],55:[function(require,module,exports){
var version = require("./version")
var isVNode = require("./is-vnode")
var isWidget = require("./is-widget")
var isThunk = require("./is-thunk")
var isVHook = require("./is-vhook")

module.exports = VirtualNode

var noProperties = {}
var noChildren = []

function VirtualNode(tagName, properties, children, key, namespace) {
    this.tagName = tagName
    this.properties = properties || noProperties
    this.children = children || noChildren
    this.key = key != null ? String(key) : undefined
    this.namespace = (typeof namespace === "string") ? namespace : null

    var count = (children && children.length) || 0
    var descendants = 0
    var hasWidgets = false
    var hasThunks = false
    var descendantHooks = false
    var hooks

    for (var propName in properties) {
        if (properties.hasOwnProperty(propName)) {
            var property = properties[propName]
            if (isVHook(property) && property.unhook) {
                if (!hooks) {
                    hooks = {}
                }

                hooks[propName] = property
            }
        }
    }

    for (var i = 0; i < count; i++) {
        var child = children[i]
        if (isVNode(child)) {
            descendants += child.count || 0

            if (!hasWidgets && child.hasWidgets) {
                hasWidgets = true
            }

            if (!hasThunks && child.hasThunks) {
                hasThunks = true
            }

            if (!descendantHooks && (child.hooks || child.descendantHooks)) {
                descendantHooks = true
            }
        } else if (!hasWidgets && isWidget(child)) {
            if (typeof child.destroy === "function") {
                hasWidgets = true
            }
        } else if (!hasThunks && isThunk(child)) {
            hasThunks = true;
        }
    }

    this.count = count + descendants
    this.hasWidgets = hasWidgets
    this.hasThunks = hasThunks
    this.hooks = hooks
    this.descendantHooks = descendantHooks
}

VirtualNode.prototype.version = version
VirtualNode.prototype.type = "VirtualNode"

},{"./is-thunk":49,"./is-vhook":50,"./is-vnode":51,"./is-widget":53,"./version":54}],56:[function(require,module,exports){
var version = require("./version")

VirtualPatch.NONE = 0
VirtualPatch.VTEXT = 1
VirtualPatch.VNODE = 2
VirtualPatch.WIDGET = 3
VirtualPatch.PROPS = 4
VirtualPatch.ORDER = 5
VirtualPatch.INSERT = 6
VirtualPatch.REMOVE = 7
VirtualPatch.THUNK = 8

module.exports = VirtualPatch

function VirtualPatch(type, vNode, patch) {
    this.type = Number(type)
    this.vNode = vNode
    this.patch = patch
}

VirtualPatch.prototype.version = version
VirtualPatch.prototype.type = "VirtualPatch"

},{"./version":54}],57:[function(require,module,exports){
var version = require("./version")

module.exports = VirtualText

function VirtualText(text) {
    this.text = String(text)
}

VirtualText.prototype.version = version
VirtualText.prototype.type = "VirtualText"

},{"./version":54}],58:[function(require,module,exports){
var isObject = require("is-object")
var isHook = require("../vnode/is-vhook")

module.exports = diffProps

function diffProps(a, b) {
    var diff

    for (var aKey in a) {
        if (!(aKey in b)) {
            diff = diff || {}
            diff[aKey] = undefined
        }

        var aValue = a[aKey]
        var bValue = b[aKey]

        if (aValue === bValue) {
            continue
        } else if (isObject(aValue) && isObject(bValue)) {
            if (getPrototype(bValue) !== getPrototype(aValue)) {
                diff = diff || {}
                diff[aKey] = bValue
            } else if (isHook(bValue)) {
                 diff = diff || {}
                 diff[aKey] = bValue
            } else {
                var objectDiff = diffProps(aValue, bValue)
                if (objectDiff) {
                    diff = diff || {}
                    diff[aKey] = objectDiff
                }
            }
        } else {
            diff = diff || {}
            diff[aKey] = bValue
        }
    }

    for (var bKey in b) {
        if (!(bKey in a)) {
            diff = diff || {}
            diff[bKey] = b[bKey]
        }
    }

    return diff
}

function getPrototype(value) {
  if (Object.getPrototypeOf) {
    return Object.getPrototypeOf(value)
  } else if (value.__proto__) {
    return value.__proto__
  } else if (value.constructor) {
    return value.constructor.prototype
  }
}

},{"../vnode/is-vhook":50,"is-object":32}],59:[function(require,module,exports){
var isArray = require("x-is-array")

var VPatch = require("../vnode/vpatch")
var isVNode = require("../vnode/is-vnode")
var isVText = require("../vnode/is-vtext")
var isWidget = require("../vnode/is-widget")
var isThunk = require("../vnode/is-thunk")
var handleThunk = require("../vnode/handle-thunk")

var diffProps = require("./diff-props")

module.exports = diff

function diff(a, b) {
    var patch = { a: a }
    walk(a, b, patch, 0)
    return patch
}

function walk(a, b, patch, index) {
    if (a === b) {
        return
    }

    var apply = patch[index]
    var applyClear = false

    if (isThunk(a) || isThunk(b)) {
        thunks(a, b, patch, index)
    } else if (b == null) {

        // If a is a widget we will add a remove patch for it
        // Otherwise any child widgets/hooks must be destroyed.
        // This prevents adding two remove patches for a widget.
        if (!isWidget(a)) {
            clearState(a, patch, index)
            apply = patch[index]
        }

        apply = appendPatch(apply, new VPatch(VPatch.REMOVE, a, b))
    } else if (isVNode(b)) {
        if (isVNode(a)) {
            if (a.tagName === b.tagName &&
                a.namespace === b.namespace &&
                a.key === b.key) {
                var propsPatch = diffProps(a.properties, b.properties)
                if (propsPatch) {
                    apply = appendPatch(apply,
                        new VPatch(VPatch.PROPS, a, propsPatch))
                }
                apply = diffChildren(a, b, patch, apply, index)
            } else {
                apply = appendPatch(apply, new VPatch(VPatch.VNODE, a, b))
                applyClear = true
            }
        } else {
            apply = appendPatch(apply, new VPatch(VPatch.VNODE, a, b))
            applyClear = true
        }
    } else if (isVText(b)) {
        if (!isVText(a)) {
            apply = appendPatch(apply, new VPatch(VPatch.VTEXT, a, b))
            applyClear = true
        } else if (a.text !== b.text) {
            apply = appendPatch(apply, new VPatch(VPatch.VTEXT, a, b))
        }
    } else if (isWidget(b)) {
        if (!isWidget(a)) {
            applyClear = true
        }

        apply = appendPatch(apply, new VPatch(VPatch.WIDGET, a, b))
    }

    if (apply) {
        patch[index] = apply
    }

    if (applyClear) {
        clearState(a, patch, index)
    }
}

function diffChildren(a, b, patch, apply, index) {
    var aChildren = a.children
    var orderedSet = reorder(aChildren, b.children)
    var bChildren = orderedSet.children

    var aLen = aChildren.length
    var bLen = bChildren.length
    var len = aLen > bLen ? aLen : bLen

    for (var i = 0; i < len; i++) {
        var leftNode = aChildren[i]
        var rightNode = bChildren[i]
        index += 1

        if (!leftNode) {
            if (rightNode) {
                // Excess nodes in b need to be added
                apply = appendPatch(apply,
                    new VPatch(VPatch.INSERT, null, rightNode))
            }
        } else {
            walk(leftNode, rightNode, patch, index)
        }

        if (isVNode(leftNode) && leftNode.count) {
            index += leftNode.count
        }
    }

    if (orderedSet.moves) {
        // Reorder nodes last
        apply = appendPatch(apply, new VPatch(
            VPatch.ORDER,
            a,
            orderedSet.moves
        ))
    }

    return apply
}

function clearState(vNode, patch, index) {
    // TODO: Make this a single walk, not two
    unhook(vNode, patch, index)
    destroyWidgets(vNode, patch, index)
}

// Patch records for all destroyed widgets must be added because we need
// a DOM node reference for the destroy function
function destroyWidgets(vNode, patch, index) {
    if (isWidget(vNode)) {
        if (typeof vNode.destroy === "function") {
            patch[index] = appendPatch(
                patch[index],
                new VPatch(VPatch.REMOVE, vNode, null)
            )
        }
    } else if (isVNode(vNode) && (vNode.hasWidgets || vNode.hasThunks)) {
        var children = vNode.children
        var len = children.length
        for (var i = 0; i < len; i++) {
            var child = children[i]
            index += 1

            destroyWidgets(child, patch, index)

            if (isVNode(child) && child.count) {
                index += child.count
            }
        }
    } else if (isThunk(vNode)) {
        thunks(vNode, null, patch, index)
    }
}

// Create a sub-patch for thunks
function thunks(a, b, patch, index) {
    var nodes = handleThunk(a, b)
    var thunkPatch = diff(nodes.a, nodes.b)
    if (hasPatches(thunkPatch)) {
        patch[index] = new VPatch(VPatch.THUNK, null, thunkPatch)
    }
}

function hasPatches(patch) {
    for (var index in patch) {
        if (index !== "a") {
            return true
        }
    }

    return false
}

// Execute hooks when two nodes are identical
function unhook(vNode, patch, index) {
    if (isVNode(vNode)) {
        if (vNode.hooks) {
            patch[index] = appendPatch(
                patch[index],
                new VPatch(
                    VPatch.PROPS,
                    vNode,
                    undefinedKeys(vNode.hooks)
                )
            )
        }

        if (vNode.descendantHooks || vNode.hasThunks) {
            var children = vNode.children
            var len = children.length
            for (var i = 0; i < len; i++) {
                var child = children[i]
                index += 1

                unhook(child, patch, index)

                if (isVNode(child) && child.count) {
                    index += child.count
                }
            }
        }
    } else if (isThunk(vNode)) {
        thunks(vNode, null, patch, index)
    }
}

function undefinedKeys(obj) {
    var result = {}

    for (var key in obj) {
        result[key] = undefined
    }

    return result
}

// List diff, naive left to right reordering
function reorder(aChildren, bChildren) {
    // O(M) time, O(M) memory
    var bChildIndex = keyIndex(bChildren)
    var bKeys = bChildIndex.keys
    var bFree = bChildIndex.free

    if (bFree.length === bChildren.length) {
        return {
            children: bChildren,
            moves: null
        }
    }

    // O(N) time, O(N) memory
    var aChildIndex = keyIndex(aChildren)
    var aKeys = aChildIndex.keys
    var aFree = aChildIndex.free

    if (aFree.length === aChildren.length) {
        return {
            children: bChildren,
            moves: null
        }
    }

    // O(MAX(N, M)) memory
    var newChildren = []

    var freeIndex = 0
    var freeCount = bFree.length
    var deletedItems = 0

    // Iterate through a and match a node in b
    // O(N) time,
    for (var i = 0 ; i < aChildren.length; i++) {
        var aItem = aChildren[i]
        var itemIndex

        if (aItem.key) {
            if (bKeys.hasOwnProperty(aItem.key)) {
                // Match up the old keys
                itemIndex = bKeys[aItem.key]
                newChildren.push(bChildren[itemIndex])

            } else {
                // Remove old keyed items
                itemIndex = i - deletedItems++
                newChildren.push(null)
            }
        } else {
            // Match the item in a with the next free item in b
            if (freeIndex < freeCount) {
                itemIndex = bFree[freeIndex++]
                newChildren.push(bChildren[itemIndex])
            } else {
                // There are no free items in b to match with
                // the free items in a, so the extra free nodes
                // are deleted.
                itemIndex = i - deletedItems++
                newChildren.push(null)
            }
        }
    }

    var lastFreeIndex = freeIndex >= bFree.length ?
        bChildren.length :
        bFree[freeIndex]

    // Iterate through b and append any new keys
    // O(M) time
    for (var j = 0; j < bChildren.length; j++) {
        var newItem = bChildren[j]

        if (newItem.key) {
            if (!aKeys.hasOwnProperty(newItem.key)) {
                // Add any new keyed items
                // We are adding new items to the end and then sorting them
                // in place. In future we should insert new items in place.
                newChildren.push(newItem)
            }
        } else if (j >= lastFreeIndex) {
            // Add any leftover non-keyed items
            newChildren.push(newItem)
        }
    }

    var simulate = newChildren.slice()
    var simulateIndex = 0
    var removes = []
    var inserts = []
    var simulateItem

    for (var k = 0; k < bChildren.length;) {
        var wantedItem = bChildren[k]
        simulateItem = simulate[simulateIndex]

        // remove items
        while (simulateItem === null && simulate.length) {
            removes.push(remove(simulate, simulateIndex, null))
            simulateItem = simulate[simulateIndex]
        }

        if (!simulateItem || simulateItem.key !== wantedItem.key) {
            // if we need a key in this position...
            if (wantedItem.key) {
                if (simulateItem && simulateItem.key) {
                    // if an insert doesn't put this key in place, it needs to move
                    if (bKeys[simulateItem.key] !== k + 1) {
                        removes.push(remove(simulate, simulateIndex, simulateItem.key))
                        simulateItem = simulate[simulateIndex]
                        // if the remove didn't put the wanted item in place, we need to insert it
                        if (!simulateItem || simulateItem.key !== wantedItem.key) {
                            inserts.push({key: wantedItem.key, to: k})
                        }
                        // items are matching, so skip ahead
                        else {
                            simulateIndex++
                        }
                    }
                    else {
                        inserts.push({key: wantedItem.key, to: k})
                    }
                }
                else {
                    inserts.push({key: wantedItem.key, to: k})
                }
                k++
            }
            // a key in simulate has no matching wanted key, remove it
            else if (simulateItem && simulateItem.key) {
                removes.push(remove(simulate, simulateIndex, simulateItem.key))
            }
        }
        else {
            simulateIndex++
            k++
        }
    }

    // remove all the remaining nodes from simulate
    while(simulateIndex < simulate.length) {
        simulateItem = simulate[simulateIndex]
        removes.push(remove(simulate, simulateIndex, simulateItem && simulateItem.key))
    }

    // If the only moves we have are deletes then we can just
    // let the delete patch remove these items.
    if (removes.length === deletedItems && !inserts.length) {
        return {
            children: newChildren,
            moves: null
        }
    }

    return {
        children: newChildren,
        moves: {
            removes: removes,
            inserts: inserts
        }
    }
}

function remove(arr, index, key) {
    arr.splice(index, 1)

    return {
        from: index,
        key: key
    }
}

function keyIndex(children) {
    var keys = {}
    var free = []
    var length = children.length

    for (var i = 0; i < length; i++) {
        var child = children[i]

        if (child.key) {
            keys[child.key] = i
        } else {
            free.push(i)
        }
    }

    return {
        keys: keys,     // A hash of key name to index
        free: free      // An array of unkeyed item indices
    }
}

function appendPatch(apply, patch) {
    if (apply) {
        if (isArray(apply)) {
            apply.push(patch)
        } else {
            apply = [apply, patch]
        }

        return apply
    } else {
        return patch
    }
}

},{"../vnode/handle-thunk":48,"../vnode/is-thunk":49,"../vnode/is-vnode":51,"../vnode/is-vtext":52,"../vnode/is-widget":53,"../vnode/vpatch":56,"./diff-props":58,"x-is-array":60}],60:[function(require,module,exports){
var nativeIsArray = Array.isArray
var toString = Object.prototype.toString

module.exports = nativeIsArray || isArray

function isArray(obj) {
    return toString.call(obj) === "[object Array]"
}

},{}],61:[function(require,module,exports){

},{}],62:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = setTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    clearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        setTimeout(drainQueue, 0);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}]},{},[1])(1)
});