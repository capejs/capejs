(function() {
  "use strict";

  if (!window) return;

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

  $.extend(Router.prototype, {
    draw: function(callback) {
      var mapper;

      if (typeof callback !== 'function')
        throw new Error("The last argument must be a function.");
      if (callback.length === 0)
        throw new Error("Callback requires an argument.");

      mapper = new window.Cape.RoutingMapper(this);
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
      else
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
      var i, len, route, md, componentClassName, componentClass, component;

      this.hash = hash;
      for (i = 0, len = this._.beforeActionCallbacks.length; i < len; i++) {
        this._.beforeActionCallbacks[i].call(this);
      }

      this._.setHash(this.hash);

      route = this.routeFor(this.hash);
      md = hash.match(route.regexp);
      this.params = $.extend({}, route.params);
      route.keys.forEach(function(key, j) {
        this.params[key] = md[j + 1];
      }.bind(this));

      componentClassName =
        Inflector.camelize(route.params.collection.replace(/\//g, '_')) +
        Inflector.camelize(route.params.action);
      componentClass = window[componentClassName];
      if (!componentClass)
        throw new Error("Class not found.[" + collection + action + "]");

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
          this._components.splice(i, 1);
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
  $.extend(_Internal.prototype, {
    notify: function() {
      var i;

      for (i = this.components.length; i--;) {
        this.components[i].refresh();
      }
    },
    setHash: function(hash) {
      window.location.hash = hash;
    }
  });

  if (!window.Cape) {
    var Cape = {};
    window.Cape = Cape;
  }
  if (!window.CapeJS) {
    window.CapeJS = window.Cape;
  }
  window.Cape.Router = Router;

})((this || 0).self || window);
