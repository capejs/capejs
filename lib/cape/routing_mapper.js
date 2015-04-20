var Inflector = require('inflected');
var Cape = require('./utilities');

// Cape.RoutingMapper
function RoutingMapper(router, options) {
  this._ = new _Internal(this);
  this.router = router;
  if (options) {
    this.singular = options.singular;
    this.pathPrefix = options.pathPrefix;
    this.resourcePath = options.resourcePath;
    this.classNamePrefix = options.classNamePrefix;
    this.resourceClassName = options.resourceClassName;
  }
};

Cape.extend(RoutingMapper.prototype, {
  match: function(path, className, constraints) {
    var route = {}, fullClassName, fragments;

    if (this.pathPrefix) path = this.pathPrefix + '/' + path;

    className = className.replace('#', '/'); // For backward compatibitily.
    if (this.classNamePrefix)
      fullClassName = this.classNamePrefix + '/' + className;
    else
      fullClassName = className;

    route.path = path;
    route.keys = this._.extractKeys(path);
    route.regexp = this._.constructRegexp(path, constraints);
    route.componentClassName = fullClassName;
    route.namespace = this.classNamePrefix;
    route.component = className;

    this.router.routes.push(route);
  },
  root: function(className) {
    this.match('', className);
  },
  resources: function(resourceName, options, callback) {
    var actions, path, resourcePath, classNamePrefix, pathName, mapper;

    if (typeof options === 'function') {
      callback = options;
      options = {}
    }
    else {
      options = options || {};
    }

    options.pathNames = options.pathNames || {};

    actions = [ 'index', 'new', 'show', 'edit' ];
    this._.filterActions(actions, options);

    path = options.path || resourceName;
    resourcePath = this._.getResourcePath(path);

    classNamePrefix = resourceName;
    if (this.classNamePrefix)
      classNamePrefix = this.classNamePrefix + '/' + classNamePrefix;

    if (actions.indexOf('index') != -1)
      this.match(resourcePath, resourceName + '/index');
    if (actions.indexOf('new') != -1) {
      pathName = options.pathNames.new ? options.pathNames.new : 'new';
      this.match(resourcePath + '/' + pathName, resourceName + '/new');
    }
    if (actions.indexOf('show') != -1)
      this.match(resourcePath + '/:id', resourceName + '/show', { id: '\\d+' });
    if (actions.indexOf('edit') != -1) {
      pathName = options.pathNames.edit ? options.pathNames.edit : 'edit';
      this.match(resourcePath + '/:id/' + pathName, resourceName + '/edit',
        { id: '\\d+' });
    }

    if (typeof callback == 'function') {
      if (callback.length === 0)
        throw new Error("Callback requires an argument.");
      mapper = new RoutingMapper(this.router,
        { pathPrefix: this.pathPrefix,
          resourcePath: resourcePath,
          classNamePrefix: this.classNamePrefix,
          resourceClassName: resourceName });
      callback(mapper);
    }
  },
  resource: function(resourceName, options, callback) {
    var actions, path, resourcePath, pathName, resourceClassName,
      mapper;

    if (typeof options === 'function') {
      callback = options;
      options = {}
    }
    else {
      options = options || {};
    }

    options.pathNames = options.pathNames || {};

    actions = [ 'new', 'show', 'edit' ];
    this._.filterActions(actions, options);

    path = options.path || resourceName;
    resourcePath = this._.getResourcePath(path);

    resourceClassName = Inflector.pluralize(resourceName);
    classNamePrefix = resourceClassName;
    if (this.classNamePrefix)
      classNamePrefix = this.classNamePrefix + '/' + classNamePrefix

    if (actions.indexOf('show') != -1)
      this.match(resourcePath, resourceClassName + '/show');
    if (actions.indexOf('new') != -1) {
      pathName = options.pathNames.new ? options.pathNames.new : 'new';
      this.match(resourcePath + '/' + pathName, resourceClassName + '/new');
    }
    if (actions.indexOf('edit') != -1) {
      pathName = options.pathNames.edit ? options.pathNames.edit : 'edit';
      this.match(resourcePath + '/' + pathName, resourceClassName + '/edit');
    }

    if (typeof callback == 'function') {
      if (callback.length === 0)
        throw new Error("Callback requires an argument.");
      mapper = new RoutingMapper(this.router,
        { singular: true,
          pathPrefix: this.pathPrefix,
          resourcePath: resourcePath,
          classNamePrefix: classNamePrefix,
          resourceClassName: resourceClassName });
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
        this.match(this.resourcePath + '/:id/' + actionName,
          this.resourceClassName + '/' + actionName, { id: '\\d+' });
      }.bind(this))
    }
    else if (options.on === 'new') {
      args.forEach(function(actionName) {
        this.match(this.resourcePath + '/new/' + actionName,
          this.resourceClassName + '/' + actionName);
      }.bind(this))
    }
    else {
      args.forEach(function(actionName) {
        this.match(this.resourcePath + '/' + actionName,
          this.resourceClassName + '/' + actionName);
      }.bind(this))
    }
  },
  namespace: function(className) {
    var args, callback, options, path, mapper;

    args = Array.prototype.slice.call(arguments, 1);
    callback = args.pop();
    options = args.pop() || {};
    if (typeof callback !== 'function')
      throw new Error("The last argument must be a function.");
    if (callback.length === 0)
      throw new Error("Callback requires an argument.");

    path = options.path || className;
    if (this.pathPrefix) path = this.pathPrefix + '/' + path;
    if (this.classNamePrefix) className = this.classNamePrefix + '/' + className;

    mapper = new RoutingMapper(this.router,
      { pathPrefix: path, classNamePrefix: className });
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
  },
  getResourcePath: function(path) {
    if (this.main.resourcePath) {
      if (this.main.singular) {
        path = this.main.resourcePath + '/' + path;
      }
      else {
        path = this.main.resourcePath
          + '/:' + Inflector.singularize(this.main.resourcePath) + '_id/' + path;
      }
    }
    return path
  }
})

module.exports = RoutingMapper;
