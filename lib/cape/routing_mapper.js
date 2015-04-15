(function(global) {
  "use strict";

  // Cape.RoutingMapper
  function RoutingMapper(router) {
    this._ = new _Internal(this);
    this.router = router;
  };

  $.extend(RoutingMapper.prototype, {
    hash: function(path, componentName, constraints) {
      var route = {}, names;
      route.path = path;
      route.keys = this._.extractKeys(path);
      route.regexp = this._.constructRegexp(path, constraints);
      names = componentName.split(/#/);
      route.params = {};
      route.params.collection = names[0];
      route.params.action = names[1];
      this.router.routes.push(route)
    }
  })

  // Internal properties of Cape.Component
  var _Internal = function _Internal(main) {
    this.main = main;
  }

  // Internal methods of Cape.Component
  $.extend(_Internal.prototype, {
    extractKeys: function(path) {
      var keys = [], md;

      path.split('/').forEach(function(fragment) {
        if (md = fragment.match(/^:(\w+)$/)) keys.push(md[1]);
      })
      return keys;
    },
    constructRegexp: function(path, constraints) {
      var fragments = [], md;

      constraints = constraints || {};
      path.split('/').forEach(function(fragment) {
        if (md = fragment.match(/^:(\w+)$/)) {
          if (constraints[md[1]])
            fragments.push('(' + constraints[md[1]] + ')')
          else
            fragments.push('([^/]+)');
        }
        else if (fragment.match(/^\w+$/)) {
          fragments.push(fragment);
        }
      })
      return new RegExp('^' + fragments.join('/') + '$');
    }
  })

  if (!global.Cape) {
    var Cape = {};
    if ("process" in global) module.exports = Cape;
    global.Cape = Cape;
  }
  global.Cape.RoutingMapper = RoutingMapper;
})((this || 0).self || window);
