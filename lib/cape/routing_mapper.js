var Inflector = require('inflected');
var Cape = require('./utilities');

// Cape.RoutingMapper
function RoutingMapper(router, options) {
  this._ = new _Internal(this);
  this.router = router;
  if (options) {
    this.namespaceName = options.namespace;
    this.singular = options.singular;
    this.path = options.path;
    this.resourceName = options.resourceName;
    this.collectionName = options.collectionName;
    this.moduleName = options.module;
  }
};

Cape.extend(RoutingMapper.prototype, {
  match: function(path, componentName, constraints) {
    var route = {}, names;
    if (this.namespaceName) path = this.namespaceName + '/' + path;
    route.path = path;
    route.keys = this._.extractKeys(path);
    route.regexp = this._.constructRegexp(path, constraints);
    names = componentName.split(/#/);
    route.params = {};
    if (this.moduleName)
      route.params.collection = this.moduleName + '/' + names[0];
    else if (this.namespaceName)
      route.params.collection = this.namespaceName + '/' + names[0];
    else
      route.params.collection = names[0];
    route.params.action = names[1];
    this.router.routes.push(route);
  },
  resources: function(resourceName, options, callback) {
    var actions, path, pathName, mapper;

    options = options || {};
    options.pathNames = options.pathNames || {};

    actions = [ 'index', 'new', 'show', 'edit' ];
    this._.filterActions(actions, options);

    path = options.path || resourceName;
    if (this.path) {
      if (this.singular === true) {
        path = this.path + '/' + path
      }
      else {
        path = this.path + '/:' +
          Inflector.singularize(this.collectionName) + '_id/' + path
      }
    }

    if (actions.indexOf('index') != -1)
      this.match(path, resourceName + '#index');
    if (actions.indexOf('new') != -1) {
      pathName = options.pathNames.new ? options.pathNames.new : 'new';
      this.match(path + '/' + pathName, resourceName + '#new');
    }
    if (actions.indexOf('show') != -1)
      this.match(path + '/:id', resourceName + '#show',
        { id: '\\d+' });
    if (actions.indexOf('edit') != -1) {
      pathName = options.pathNames.edit ? options.pathNames.edit : 'edit';
      this.match(path + '/:id/' + pathName, resourceName + '#edit',
        { id: '\\d+' });
    }

    if (typeof callback == 'function') {
      if (callback.length === 0)
        throw new Error("Callback requires an argument.");
      mapper = new RoutingMapper(this.router,
        { path: path, resourceName: resourceName, collectionName: resourceName });
      callback(mapper);
    }
  },
  resource: function(resourceName, options, callback) {
    var actions, path, pathName, collectionName, mapper;

    options = options || {};
    options.pathNames = options.pathNames || {};

    actions = [ 'new', 'show', 'edit' ];
    this._.filterActions(actions, options);

    path = options.path || resourceName;
    if (this.path) {
      if (this.singular === true) {
        path = this.path + '/' + path
      }
      else {
        path = this.path + '/:' +
          Inflector.singularize(this.collectionName) + '_id/' + path
      }
    }

    collectionName = Inflector.pluralize(resourceName);

    if (actions.indexOf('show') != -1)
      this.match(path, collectionName + '#show');
    if (actions.indexOf('new') != -1) {
      pathName = options.pathNames.new ? options.pathNames.new : 'new';
      this.match(path + '/' + pathName, collectionName + '#new');
    }
    if (actions.indexOf('edit') != -1) {
      pathName = options.pathNames.edit ? options.pathNames.edit : 'edit';
      this.match(path + '/' + pathName, collectionName + '#edit');
    }

    if (typeof callback == 'function') {
      if (callback.length === 0)
        throw new Error("Callback requires an argument.");
      mapper = new RoutingMapper(this.router,
        { singular: true, path: path, resourceName: resourceName,
          collectionName: resourceName });
      callback(mapper);
    }
  },
  get: function() {
    var args, options;

    args = Array.prototype.slice.call(arguments, 0);
    if (typeof args[args.length - 1] === 'object')
      options = args.pop();
    else
      options = {}

    if (options.on === 'member') {
      args.forEach(function(actionName) {
        this.match(this.path + '/:id/' + actionName,
          this.resourceName + '#' + actionName, { id: '\\d+' });
      }.bind(this))
    }
    else if (options.on === 'new') {
      args.forEach(function(actionName) {
        this.match(this.path + '/new/' + actionName,
          this.resourceName + '#' + actionName);
      }.bind(this))
    }
    else {
      args.forEach(function(actionName) {
        this.match(this.path + '/' + actionName,
          this.resourceName + '#' + actionName);
      }.bind(this))
    }
  },
  namespace: function(path) {
    var args, callback, options, mapper;

    args = Array.prototype.slice.call(arguments, 1);
    callback = args.pop();
    options = args.pop() || {};
    if (typeof callback !== 'function')
      throw new Error("The last argument must be a function.");
    if (callback.length === 0)
      throw new Error("Callback requires an argument.");

    mapper = new RoutingMapper(this.router,
      { namespace: path, module: options.module });
    callback(mapper);
  }
})

// Internal properties of Cape.Component
var _Internal = function _Internal(main) {
  this.main = main;
}

// Internal methods of Cape.Component
Cape.extend(_Internal.prototype, {
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

module.exports = RoutingMapper;
