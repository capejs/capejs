(function() {
  "use strict";

  if (!window) return;

  // Cape.Router
  //
  // public properties:
  //   params: the parameters that are extracted from URL hash fragment.
  // private properties:
  //   _: the object that holds internal methods and properties of this class.
  var Router = function Router() {
    this._ = new _Internal(this);
    this.params = {};
    this._.refreshParams();
  };

  $.extend(Router.prototype, {
    attach: function(component) {
      var target = component;
      for (var i = 0, len = this._.components.length; i < len; i++) {
        if (this._.components[i] === component) return;
      }
      this._.components.push(component);
      this._.refreshParams();
    },
    detach: function(component) {
      for (var i = 0, len = this._.components.length; i < len; i++) {
        if (this._.components[i] === component) {
          this._components.splice(i, 1);
          break;
        }
      }
    },
    trigger: function(eventType) {
      var hash;

      hash = window.location.href.split('#')[1] || '';
      if (hash !== this._.currentHash) {
        this._.currentHash = hash;
        this._.refreshParams();
        for (var i = this._.components.length; i--;)
          this._.components[i].refresh(this.params);
      }
    },
    navigate: function(hash) {
      window.location.hash = hash;
      this.trigger();
    },
  });

  // Internal properties of Cape.Router
  var _Internal = function _Internal(main) {
    this.main = main;
    this.components = [];
    this.currentHash = null;
  }

  // Internal methods of Cape.Router
  $.extend(_Internal.prototype, {
    refreshParams: function() {
      var hash, ary;

      hash = window.location.href.split('#')[1] || '';
      ary = hash.split('/');
      this.main.params.collection = ary[0];
      this.main.params.id = ary[1];
      this.main.params.action = ary[2];
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
  window.Cape.router = new Router();
  window.Cape.navigate = function(hash) { window.Cape.router.navigate(hash) }

  function trigger() { window.Cape.router.trigger() }

  if (window.addEventListener)
    window.addEventListener('hashchange', trigger, false)
  else
    window.attachEvent('onhashchange', trigger)
})((this || 0).self || window);
