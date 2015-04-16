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
      var callback = function() { window.router.trigger() };
      if (window.addEventListener)
        window.addEventListener('hashchange', callback, false);
      else
        window.attachEvent('onhashchange', callback);
    },
    trigger: function(caller) {
      var hash, i;

      hash = window.location.href.split('#')[1] || '';

      if (hash !== this._.currentHash) {
        this._.currentHash = hash;
        this.exec(hash);
        for (i = this._.components.length; i--;) {
          if (this._.components[i] !== caller)
            this._.components[i].refresh();
        }
      }
    },
    exec: function(hash) {
      var i, len, route, md, collection, action, mod, component;

      for (i = 0, len = this.routes.length; i < len; i++) {
        route = this.routes[i];
        if (md = hash.match(route.regexp)) {
          this.params = $.extend({}, route.params);
          route.keys.forEach(function(key, j) {
            this.params[key] = md[j + 1];
          }.bind(this));
          collection = Inflector.camelize(route.params.collection);
          action = Inflector.camelize(route.params.action);
          if (window[collection + action]) {
            if (this._.mountedComponent) this._.mountedComponent.unmount();
            component = new window[collection + action];
            component.mount(this._.targetElementId);
            this._.mountedComponent = component;
            return
          }
          else {
            throw new Error("Class not found.[" + collection + action + "]");
          }
        }
      }
      throw new Error("No route match. [" + hash + "]");
    },
    navigate: function(hash) {
      window.location.hash = hash;
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
    }
  });

  // Internal properties of Cape.Router
  var _Internal = function _Internal(main) {
    this.main = main;
    this.components = [];
    this.currentHash = null;
    this.mountedComponent = null;
    this.targetElementId = null;
  }

  // Internal methods of Cape.Router
  $.extend(_Internal.prototype, {});

  if (!window.Cape) {
    var Cape = {};
    window.Cape = Cape;
  }
  if (!window.CapeJS) {
    window.CapeJS = window.Cape;
  }
  window.Cape.Router = Router;

})((this || 0).self || window);
