(function() {
  "use strict;"

  if (!window) return;

  var Router = function Router() {
    this.handlers = [];
    this.currentHash = null;
    this.params = {};
  };

  $.extend(Router.prototype, {
    route: function(callback) {
      this.handlers.push(callback);
    },
    off: function(callback) {}, // Not yet implemented.
    visit: function(hash) {
      window.location.hash = hash;
      this.trigger();
    },
    trigger: function() {
      var hash, i;

      hash = window.location.href.split('#')[1] || '';
      if (hash != this.currentHash) {
        this.refresh();
        for (i = 0; i < this.handlers.length; i++)
          this.handlers[i].call(this, this.params);
        this.currentHash = hash;
      }
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
    window.CapeJS.router.trigger()
  }

  if (!window.CapeJS) window.CapeJS = {};
  window.CapeJS.router = new Router();
  window.CapeJS.visit = function(hash) { window.CapeJS.router.visit(hash) }

  if (window.addEventListener)
    window.addEventListener('hashchange', trigger, false)
  else
    window.attachEvent('onhashchange', trigger)
})();
