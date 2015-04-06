(function() {
  "use strict;"

  if (!window) return;

  var Router = function Router() {
    this.handlers = [];
    this.currentHash = null;
  };

  $.extend(Router.prototype, {
    route: function(callback) {
      this.handlers.push(callback);
    },
    off: function(callback) {}, // Not yet implemented.
    hash: function(hash) {
      window.location.hash = hash;
      this.trigger();
    },
    trigger: function() {
      var hash, i;
      if (!this.handlers) return;

      hash = window.location.href.split('#')[1] || '';
      if (hash != this.currentHash) {
        for (i = 0; i < this.handlers.length; i++)
          this.handlers[i].apply(this, hash.split('/'));
        this.currentHash = hash;
      }
    }
  });

  function trigger() {
    window.CapeJS.router.trigger()
  }

  if (!window.CapeJS) window.CapeJS = {};
  window.CapeJS.router = new Router();

  if (window.addEventListener)
    window.addEventListener('hashchange', trigger, false)
  else
    window.attachEvent('onhashchange', trigger)
})();
