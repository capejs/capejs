var Inflector = require('inflected');
var Cape = require('./utilities');

// Cape.RoutingMapper
function RoutingMapper(router, options) {
  this._ = new _Internal(this);
  this.router = router;
  if (options) {
    // The namespace part of URL hash
    this.namespacePath = options.namespacePath;
    this.singular = options.singular;
    this.pathPrefix = options.pathPrefix;
    this.resourcePath = options.resourcePath;
    this.classNamePrefix = options.classNamePrefix;
    this.resourceClassName = options.resourceClassName;
  }
};

Cape.extend(RoutingMapper.prototype, {
  page: function(path, className, constraints, options) {
    var route = {}, fullClassName, fragments, resourceNames;

    options = options || {};

    if (this.pathPrefix) path = this.pathPrefix + '/' + path;

    route.path = path;
    route.keys = this._.extractKeys(path);
    route.regexp = this._.constructRegexp(path, constraints);

    if (this.classNamePrefix)
      fullClassName = this.classNamePrefix + '.' + className;
    else
      fullClassName = className;

    fragments = fullClassName.split('.');
    route.component = fragments.pop();
    route.container = fragments.length ? fragments.join('.') : null;

    route.namespace = this.namespacePath || null;

    resourceNames = [];
    if (this.resourcePath) resourceNames.push(this.resourcePath);
    if (options.resource) resourceNames.push(options.resource);
    if (resourceNames.length) route.resource = resourceNames.join('/');
    else route.resource = null;

    route.action = options.action || null;

    this.router.routes.push(route);
  },
  root: function(className) {
    this.page('', className);
  },
  many: function(resourceName) {
    var options, callback, resourcePath;

    options = this._.extractOptions(arguments);
    callback = this._.extractCallback(arguments);
    resourcePath = this._.getResourcePath(options.path || resourceName);

    this._.addPagesForPluralResource(resourceName, resourcePath, options);
    this._.executeCallback(callback, resourceName, resourcePath, false);
  },
  one: function(resourceName) {
    var options, callback, resourcePath;

    options = this._.extractOptions(arguments);
    callback = this._.extractCallback(arguments);
    resourcePath = this._.getResourcePath(options.path || resourceName);

    this._.addPagesForSingularResource(resourceName, resourcePath, options);
    this._.executeCallback(callback, resourceName, resourcePath, true);
  },
  collection: function() {
    var args;

    if (this.resourcePath === undefined || this.singular)
      throw new Error("The collection method must be called within a plural resource definition.")

    args = Array.prototype.slice.call(arguments, 0);
    args.forEach(function(path) {
      this.page(this.resourcePath + '/' + path,
        this.resourcePath + '.' + path, {}, { action: path });
    }.bind(this))
  },
  member: function() {
    var args;

    if (this.resourcePath === undefined || this.singular)
      throw new Error("The member method must be called within a plural resource definition.")

    args = Array.prototype.slice.call(arguments, 0);
    args.forEach(function(path) {
      this.page(this.resourcePath + '/:id/' + path,
        this.resourcePath + '.' + path, { id: '\\d+' }, {}, { action: path });
    }.bind(this))
  },
  new: function() {
    var args;

    if (this.resourcePath === undefined)
      throw new Error("The member method must be called within a resource definition.")

    args = Array.prototype.slice.call(arguments, 0);
    args.forEach(function(path) {
      this.page(this.resourcePath + '/new/' + path,
        this.resourcePath + '.' + path, {}, { action: path });
    }.bind(this))
  },
  view: function() {
    var args;

    if (this.resourcePath === undefined || !this.singular)
      throw new Error("The view method must be called within a singular resource definition.")

    args = Array.prototype.slice.call(arguments, 0);
    args.forEach(function(path) {
      this.page(this.resourcePath + '/' + path,
        this.resourcePath + '.' + path, {}, { action: path });
    }.bind(this))
  },
  namespace: function(className) {
    var args, callback, options, namespacePath, path;

    args = Array.prototype.slice.call(arguments, 1);
    callback = args.pop();
    options = args.pop() || {};

    if (typeof callback !== 'function')
      throw new Error("The last argument must be a function.");
    if (callback.length === 0)
      throw new Error("Callback requires an argument.");

    path = options.path || className;
    if (this.namespacePath) namespacePath = this.namespacePath + '/' + path;
    else namespacePath = path;
    if (this.pathPrefix) path = this.pathPrefix + '/' + path;
    if (this.classNamePrefix) className = this.classNamePrefix + '.' + className;

    callback(
      new RoutingMapper(this.router, {
        namespacePath: namespacePath,
        pathPrefix: path,
        classNamePrefix: className
      })
    );
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
  extractOptions: function(arguments) {
    if (typeof arguments[1] === 'function') return {}
    else return arguments[1] || {}
  },
  extractCallback: function(arguments) {
    if (typeof arguments[1] === 'function') return arguments[1]
    else return arguments[2]
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
  },
  addPagesForPluralResource: function(resourceName, resourcePath, options) {
    var actions = [ 'index', 'new', 'show', 'edit' ];
    this.filterActions(actions, options);

    options.pathNames = options.pathNames || {};

    if (actions.indexOf('index') != -1)
      this.main.page(resourcePath, resourceName + '.list', {},
        { resource: resourceName, action: 'index' });
    if (actions.indexOf('new') != -1) {
      pathName = options.pathNames.new ? options.pathNames.new : 'new';
      this.main.page(resourcePath + '/' + pathName, resourceName + '.form', {},
        { resource: resourceName, action: 'new' });
    }
    if (actions.indexOf('show') != -1)
      this.main.page(resourcePath + '/:id', resourceName + '.item', { id: '\\d+' },
        { resource: resourceName, action: 'show' });
    if (actions.indexOf('edit') != -1) {
      pathName = options.pathNames.edit ? options.pathNames.edit : 'edit';
      this.main.page(resourcePath + '/:id/' + pathName, resourceName + '.form',
        { id: '\\d+' }, { resource: resourceName, action: 'edit' });
    }
  },
  addPagesForSingularResource: function(resourceName, resourcePath, options) {
    var actions = [ 'new', 'show', 'edit' ];
    this.filterActions(actions, options);

    options.pathNames = options.pathNames || {};

    if (actions.indexOf('show') != -1)
      this.main.page(resourcePath, resourceName + '.content', {},
        { resource: resourceName, action: 'show' });
    if (actions.indexOf('new') != -1) {
      pathName = options.pathNames.new ? options.pathNames.new : 'new';
      this.main.page(resourcePath + '/' + pathName, resourceName + '.form', {},
        { resource: resourceName, action: 'new' });
    }
    if (actions.indexOf('edit') != -1) {
      pathName = options.pathNames.edit ? options.pathNames.edit : 'edit';
      this.main.page(resourcePath + '/' + pathName, resourceName + '.form', {},
        { resource: resourceName, action: 'edit' });
    }
  },
  executeCallback: function(callback, resourceName, resourcePath, singular) {
    if (typeof callback == 'function') {
      if (callback.length === 0)
        throw new Error("Callback requires an argument.");
      callback(
        new RoutingMapper(this.main.router, {
          singular: singular,
          pathPrefix: this.main.pathPrefix,
          resourcePath: resourcePath,
          classNamePrefix: this.main.classNamePrefix,
          resourceClassName: resourceName
        })
      );
    }
  }
})

module.exports = RoutingMapper;
