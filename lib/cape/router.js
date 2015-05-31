"use strict";

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

Cape.extend(Router.prototype, {
  draw: function(callback) {
    var mapper;

    if (typeof callback !== 'function')
      throw new Error("The last argument must be a function.");
    if (callback.length === 0)
      throw new Error("Callback requires an argument.");

    mapper = new global.Cape.RoutingMapper(this);
    callback(mapper);
  },
  mount: function(elementId) {
    this._.targetElementId = elementId;
  },
  start: function() {
    var self = this, callback;

    if (window.addEventListener)
      window.addEventListener('hashchange', self._.eventListener, false);
    else if (window.attachEvent)
      window.attachEvent('onhashchange', self._.eventListener);

    this.currentHash = window.location.href.split('#')[1] || '';
    this.navigate(this.currentHash);
  },
  stop: function() {
    var self = this;

    if (window.removeEventListener)
      window.removeEventListener('hashchange', self._.eventListener, false);
    else if (window.detachEvent)
      window.detachEvent('onhashchange', self._.eventListener);
  },
  routeFor: function(hash) {
    var i, len, route;

    for (i = 0, len = this.routes.length; i < len; i++) {
      route = this.routes[i];
      if (hash.match(route.regexp)) return route;
    }
    throw new Error("No route match. [" + hash + "]");
  },
  navigate: function(hash, options) {
    var self = this, promises, promise, i, len;

    this._.currentHash = hash;
    this._.setHash(hash);

    options = options || {};
    this.flash.notice = options.notice;
    this.flash.alert = options.alert;

    if (this._.beforeNavigationCallbacks.length) {
      promises = [];
      promise = new Promise(function(resolve, reject) { resolve(hash) });
      promises.push(promise);
      for (i = 0, len = this._.beforeNavigationCallbacks.length; i < len; i++) {
        promise = promise.then(this._.beforeNavigationCallbacks[i]);
        promises.push(promise)
      }
      Promise.all(promises).then(function(results) {
        self._.mountComponent(results.pop())
      }, self._.errorHandler);
    }
    else {
      self._.mountComponent(hash);
    }
  },
  redirectTo: function(hash, options) {
    var self = this, promises, promise, i, len;

    this._.currentHash = hash;
    this._.setHash(hash);

    options = options || {};
    this.flash.notice = options.notice;
    this.flash.alert = options.alert;
    self._.mountComponent(hash);
  },
  show: function(klass) {
    var component = new klass();
    component.mount(this._.targetElementId);
    this._.mountedComponentClass = klass;
    this._.mountedComponent = component;
  },
  attach: function(component) {
    var target = component;
    for (var i = 0, len = this._.attachedComponents.length; i < len; i++) {
      if (this._.attachedComponents[i] === component) return;
    }
    this._.attachedComponents.push(component);
  },
  detach: function(component) {
    for (var i = 0, len = this._.attachedComponents.length; i < len; i++) {
      if (this._.attachedComponents[i] === component) {
        this._.attachedComponents.splice(i, 1);
        break;
      }
    }
  },
  beforeNavigation: function(callback) {
    this._.beforeNavigationCallbacks.push(callback);
  },
  errorHandler: function(callback) {
    this._.errorHandler = callback;
  },
  notify: function() {
    var i;

    for (i = this._.attachedComponents.length; i--;) {
      this._.attachedComponents[i].refresh();
    }
  }
});

// Internal properties of Cape.Router
var _Internal = function _Internal(main) {
  var self = this;
  this.main = main;
  this.eventListener = function() {
    var hash = window.location.href.split('#')[1] || '';
    if (hash != self.currentHash) self.main.navigate(hash);
  };
  this.beforeNavigationCallbacks = [];
  this.attachedComponents = [];
  this.currentHash = null;
  this.mountedComponent = null;
  this.targetElementId = null;
}

// Internal methods of Cape.Router
Cape.extend(_Internal.prototype, {
  mountComponent: function(hash) {
    var route, componentClass, component;

    if (typeof hash !== 'string')
      throw new Error("The first argument must be a string.");

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
    }
    else {
      if (this.mountedComponent) this.mountedComponent.unmount();
      this.main.notify();
      component = new componentClass;
      component.mount(this.targetElementId);
      this.mountedComponentClass = componentClass;
      this.mountedComponent = component;
    }

    this.main.flash = {};
  },
  setHash: function(hash) {
    window.location.hash = hash;
  },
  setParams: function(route) {
    var md = this.currentHash.match(route.regexp);
    this.main.params = {};
    route.keys.forEach(function(key, i) {
      this.main.params[key] = md[i + 1];
    }.bind(this));
  },
  setQuery: function(route) {
    var queryString, pairs;

    this.main.query = {};
    queryString = this.currentHash.split('?')[1];
    if (queryString === undefined) return;
    pairs = queryString.split('&');
    pairs.forEach(function(pair) {
      var parts = pair.split('=');
      this.main.query[parts[0]] = parts[1] || '';
    }.bind(this))
  },
  getComponentClassFor: function(route) {
    var fragments, obj, i, componentName;

    fragments = [];
    if (route.container) {
      route.container.split('.').forEach(function(part) {
        fragments.push(Inflector.camelize(part));
      })
    }

    obj = this.main.rootContainer;
    for (i = 0; obj && i < fragments.length; i++) {
      if (obj[fragments[i]]) obj = obj[fragments[i]];
      else obj = null;
    }

    componentName = Inflector.camelize(route.component);
    if (obj && obj[componentName]) return obj[componentName];

    throw new Error(
      "Component class "
        + fragments.concat([componentName]).join('.')
        + " is not defined."
    );
  }
});

module.exports = Router;
