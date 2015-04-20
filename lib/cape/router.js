var Inflector = require('inflected');
var Cape = require('./utilities');

// Cape.Router
//
// public properties:
//   routes: array of hashes that contains routing information.
//   params: the parameters that are extracted from URL hash fragment.
// private properties:
//   _: the object that holds internal methods and properties of this class.
var Router = function Router() {
  this._ = new _Internal(this);
  this.routes = [];
  this.params = {};
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

    callback = function() {
      var hash = window.location.href.split('#')[1] || '';
      self.navigate(hash);
    };
    if (window.addEventListener)
      window.addEventListener('hashchange', callback, false);
    else if (window.attachEvent)
      window.attachEvent('onhashchange', callback);

    this.hash = window.location.href.split('#')[1] || '';
    this.navigate(this.hash);
  },
  routeFor: function(hash) {
    var i, len, route;

    for (i = 0, len = this.routes.length; i < len; i++) {
      route = this.routes[i];
      if (hash.match(route.regexp)) return route;
    }
    throw new Error("No route match. [" + hash + "]");
  },
  navigate: function(hash) {
    var route, componentClass, component;

    this.hash = hash;
    this._.executeBeforeActionCallbacks();
    this._.setHash(this.hash);
    route = this.routeFor(this.hash);
    this._.setParams(route);
    componentClass = this._.getComponentClassFor(route);

    if (componentClass === this._.mountedComponentClass) {
      this._.notify();
    }
    else {
      if (this._.mountedComponent) this._.mountedComponent.unmount();
      this._.notify();
      component = new componentClass;
      component.mount(this._.targetElementId);
      this._.mountedComponentClass = componentClass;
      this._.mountedComponent = component;
    }
  },
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
  beforeAction: function(callback) {
    this._.beforeActionCallbacks.push(callback);
  }
});

// Internal properties of Cape.Router
var _Internal = function _Internal(main) {
  this.main = main;
  this.beforeActionCallbacks = [];
  this.components = [];
  this.hash = null;
  this.currentHash = null;
  this.mountedComponent = null;
  this.targetElementId = null;
}

// Internal methods of Cape.Router
Cape.extend(_Internal.prototype, {
  executeBeforeActionCallbacks: function() {
    for (var i = 0, len = this.beforeActionCallbacks.length; i < len; i++) {
      this.beforeActionCallbacks[i].call(this.main);
    }
  },
  setHash: function(hash) {
    window.location.hash = hash;
  },
  setParams: function(route) {
    var md = this.main.hash.match(route.regexp);
    this.main.params = {};
    route.keys.forEach(function(key, i) {
      this.main.params[key] = md[i + 1];
    }.bind(this));
  },
  getComponentClassFor: function(route) {
    var fragments, i, camelized, componentName, obj, componentClassName;

    fragments = route.componentClassName.split('/');
    componentName = Inflector.camelize(fragments.pop());

    obj = window;
    for (i = 0; i < fragments.length; i++) {
      camelized = Inflector.camelize(fragments[i]);
      if (obj[camelized]) {
        obj = obj[camelized];
      }
      else {
        obj = null;
        break;
      }
    }

    if (obj && obj[componentName]) return obj[componentName];

    // Old convension
    componentClassName = Inflector.camelize(
      route.componentClassName.replace(/\//g, '_'));
    if (window[componentClassName]) return window[componentClassName];

    throw new Error(
      "Component class not found for " + route.componentClassName);
  },
  notify: function() {
    var i;

    for (i = this.components.length; i--;) {
      this.components[i].refresh();
    }
  }
});

module.exports = Router;
