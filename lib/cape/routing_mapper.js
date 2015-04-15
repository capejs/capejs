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
    },
    resources: function(resourceName, options) {
      var actions, path, pathName;

      options = options || {};
      options.pathNames = options.pathNames || {};

      actions = [ 'index', 'new', 'show', 'edit' ];
      this._.filterActions(actions, options);

      path = options.path || resourceName;

      if (actions.indexOf('index') != -1)
        this.hash(path, resourceName + '#index');
      if (actions.indexOf('new') != -1) {
        pathName = options.pathNames.new ? options.pathNames.new : 'new';
        this.hash(path + '/' + pathName, resourceName + '#new');
      }
      if (actions.indexOf('show') != -1)
        this.hash(path + '/:id', resourceName + '#show',
          { id: '\\d+' });
      if (actions.indexOf('edit') != -1) {
        pathName = options.pathNames.edit ? options.pathNames.edit : 'edit';
        this.hash(path + '/:id/' + pathName, resourceName + '#edit',
          { id: '\\d+' });
      }
    },
    resource: function(resourceName, options) {
      var actions, path, pathName, collectionName;

      options = options || {};
      options.pathNames = options.pathNames || {};

      actions = [ 'new', 'show', 'edit' ];
      this._.filterActions(actions, options);

      path = options.path || resourceName;
      collectionName = Inflector.pluralize(resourceName);

      if (actions.indexOf('show') != -1)
        this.hash(path, collectionName + '#show');
      if (actions.indexOf('new') != -1) {
        pathName = options.pathNames.new ? options.pathNames.new : 'new';
        this.hash(path + '/' + pathName, collectionName + '#new');
      }
      if (actions.indexOf('edit') != -1) {
        pathName = options.pathNames.edit ? options.pathNames.edit : 'edit';
        this.hash(path + '/' + pathName, collectionName + '#edit');
      }
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
    },
    filterActions: function(actions, options) {
      var idx;

      options = options || {};
      if (typeof options['only'] === 'string') {
        actions.length = 0;
        actions.push(options['only'])
      }
      if (Array.isArray(options['only'])) {
        actions.length = 0;
        options['only'].forEach(function(name) { actions.push(name) })
      }
      if (typeof options['except'] === 'string') {
        idx = actions.indexOf(options['except'])
        if (idx !== -1) actions.splice(idx, 1)
      }
      if (Array.isArray(options['except'])) {
        options['except'].forEach(function(name) {
          idx = actions.indexOf(name)
          if (idx !== -1) actions.splice(idx, 1)
        })
      }
    }
  })

  if (!global.Cape) {
    var Cape = {};
    if ("process" in global) module.exports = Cape;
    global.Cape = Cape;
  }
  global.Cape.RoutingMapper = RoutingMapper;
})((this || 0).self || window);
