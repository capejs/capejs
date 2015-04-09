(function() {
  "use strict";

  if (!window) return;

  var Router = function Router() {
    this.components = [];
    this.currentHash = null;
    this.params = {};
    this.refresh();
  };

  $.extend(Router.prototype, {
    attach: function(component) {
      var target = component;
      for (var i = 0, len = this.components.length; i < len; i++) {
        if (this.components[i] === component) return;
      }
      this.components.push(component);
      this.refresh();
    },
    detach: function(component) {
      for (var i = 0, len = this.components.length; i < len; i++) {
        if (this.components[i] === component) {
          this.handlers.splice(i, 1);
          break;
        }
      }
    },
    trigger: function(eventType) {
      var hash;

      hash = window.location.href.split('#')[1] || '';
      if (hash !== this.currentHash) {
        this.currentHash = hash;
        this.refresh();
        for (var i = this.components.length; i--;)
          this.components[i].refresh(this.params);
      }
    },
    navigate: function(hash) {
      window.location.hash = hash;
      this.trigger();
    },
    refresh: function() {
      var hash, ary;

      hash = window.location.href.split('#')[1] || '';
      ary = hash.split('/');
      this.params.collection = ary[0];
      this.params.id = ary[1];
      this.params.action = ary[2];
    }
  });

  function trigger() {
    window.Cape.router.trigger()
  }

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

  if (window.addEventListener)
    window.addEventListener('hashchange', trigger, false)
  else
    window.attachEvent('onhashchange', trigger)
})((this || 0).self || window);
