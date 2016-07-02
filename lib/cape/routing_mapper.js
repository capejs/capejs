'use strict'

let Inflector = require('inflected')
let Cape = require('./utilities')

// Cape.RoutingMapper
class RoutingMapper {
  constructor(router, options) {
    this._ = new _Internal(this)
    this.router = router
    if (options) {
      // The namespace part of URL hash
      this.namespacePath = options.namespacePath
      this.singular = options.singular
      this.pathPrefix = options.pathPrefix
      this.resourcePath = options.resourcePath
      this.classNamePrefix = options.classNamePrefix
      this.resourceClassName = options.resourceClassName
    }
  }

  page(path, className, constraints, options) {
    if (path === undefined) throw new Error("Missing hash pattern.")

    if (className === undefined) {
      if (path.match(/^\w+(\/\w+)*$/)) className = path.replace('/', '.')
      else throw new Error("Missing class name path.")
    }

    if (this.pathPrefix) path = this.pathPrefix + '/' + path

    this._constructRouteForPage(path, className, constraints, options)
  }

  _constructRouteForPage(path, className, constraints, options) {
    options = options || {}

    let route = {}

    route.path = path
    route.keys = this._.extractKeys(path)
    route.regexp = this._.constructRegexp(path, constraints)
    route.namespace = this.namespacePath || null
    route.action = options.action || null
    this._setComponentAndContainer(route, path, className, constraints)
    this._setResource(route, options)

    this.router.routes.push(route)
  }

  _setComponentAndContainer(route, path, className, constraints) {
    let fullClassName
    if (this.classNamePrefix)
      fullClassName = this.classNamePrefix + '.' + className
    else
      fullClassName = className

    let fragments = fullClassName.split('.')
    route.component = fragments.pop()
    route.container = fragments.length ? fragments.join('.') : null
  }

  _setResource(route, options) {
    let resourceNames = []
    if (this.resourcePath) resourceNames.push(this.resourcePath)
    if (options.resource) resourceNames.push(options.resource)
    if (resourceNames.length) route.resource = resourceNames.join('/')
    else route.resource = null
  }

  root(className) {
    this.page('', className)
  }

  many(resourceName) {
    this._many_or_one(resourceName, arguments, false)
  }

  one(resourceName) {
    this._many_or_one(resourceName, arguments, true)
  }

  _many_or_one(resourceName, args, singular) {
    let options = this._.extractOptions(args)
    let callback = this._.extractCallback(args)
    let resourcePath = this._.getResourcePath(options.path || resourceName)

    if (singular)
      this._.addPagesForSingularResource(resourceName, resourcePath, options)
    else
      this._.addPagesForPluralResource(resourceName, resourcePath, options)

    this._.executeCallback(callback, resourceName, resourcePath, singular)
  }

  collection() {
    let args

    if (this.resourcePath === undefined || this.singular)
      throw new Error("The collection method must be called within a plural resource definition.")

    args = Array.prototype.slice.call(arguments, 0)
    args.forEach(function(path) {
      this.page(this.resourcePath + '/' + path,
        this.resourcePath + '.' + path, {}, { action: path })
    }.bind(this))
  }

  member() {
    let args

    if (this.resourcePath === undefined || this.singular)
      throw new Error("The member method must be called within a plural resource definition.")

    args = Array.prototype.slice.call(arguments, 0)
    args.forEach(function(path) {
      this.page(this.resourcePath + '/:id/' + path,
        this.resourcePath + '.' + path, { id: '\\d+' }, {}, { action: path })
    }.bind(this))
  }

  new() {
    let args

    if (this.resourcePath === undefined)
      throw new Error("The member method must be called within a resource definition.")

    args = Array.prototype.slice.call(arguments, 0)
    args.forEach(function(path) {
      this.page(this.resourcePath + '/new/' + path,
        this.resourcePath + '.' + path, {}, { action: path })
    }.bind(this))
  }

  view() {
    let args

    if (this.resourcePath === undefined || !this.singular)
      throw new Error("The view method must be called within a singular resource definition.")

    args = Array.prototype.slice.call(arguments, 0)
    args.forEach(function(path) {
      this.page(this.resourcePath + '/' + path,
        this.resourcePath + '.' + path, {}, { action: path })
    }.bind(this))
  }

  namespace(className) {
    let args, callback, options, namespacePath, path

    args = Array.prototype.slice.call(arguments, 1)
    callback = args.pop()
    options = args.pop() || {}

    if (typeof callback !== 'function')
      throw new Error("The last argument must be a function.")
    if (callback.length === 0)
      throw new Error("Callback requires an argument.")

    path = options.path || className
    if (this.namespacePath) namespacePath = this.namespacePath + '/' + path
    else namespacePath = path
    if (this.pathPrefix) path = this.pathPrefix + '/' + path
    if (this.classNamePrefix) className = this.classNamePrefix + '.' + className

    callback(
      new RoutingMapper(this.router, {
        namespacePath: namespacePath,
        pathPrefix: path,
        classNamePrefix: className
      })
    )
  }
}

// Internal properties of Cape.Component
class _Internal {
  constructor(main) {
    this.main = main
  }

  extractKeys(path) {
    let keys = [], md

    path.split('/').forEach(function(fragment) {
      md = fragment.match(/^:(\w+)$/)
      if (md) keys.push(md[1])
    })
    return keys
  }

  constructRegexp(path, constraints) {
    let fragments = [], md

    constraints = constraints || {}
    path.split('/').forEach(function(fragment) {
      md = fragment.match(/^:(\w+)$/)
      if (md) {
        if (constraints[md[1]])
          fragments.push('(' + constraints[md[1]] + ')')
        else
          fragments.push('([^/]+)')
      }
      else if (fragment.match(/^\w+$/)) {
        fragments.push(fragment)
      }
    })
    return new RegExp('^' + fragments.join('/') +
      '(?:\\?[\\w-]+(?:=[\\w-]*)?(?:&[\\w-]+(?:=[\\w-]*)?)*)?$')
  }

  extractOptions(args) {
    if (typeof args[1] === 'function') return {}
    else return args[1] || {}
  }

  extractCallback(args) {
    if (typeof args[1] === 'function') return args[1]
    else return args[2]
  }

  filterActions(actions, options) {
    let idx

    options = options || {}
    if (typeof options['only'] === 'string') {
      actions.length = 0
      actions.push(options['only'])
    }
    if (Array.isArray(options['only'])) {
      actions.length = 0
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

  getResourcePath(path) {
    if (this.main.resourcePath) {
      if (this.main.singular) {
        path = this.main.resourcePath + '/' + path
      }
      else {
        path = this.main.resourcePath
          + '/:' + Inflector.singularize(this.main.resourcePath) + '_id/' + path
      }
    }
    return path
  }

  addPagesForPluralResource(resourceName, resourcePath, options) {
    let actions = [ 'index', 'new', 'show', 'edit' ], pathName
    this.filterActions(actions, options)

    options.pathNames = options.pathNames || {}

    if (actions.indexOf('index') !== -1)
      this.main.page(resourcePath, resourceName + '.list', {},
        { resource: resourceName, action: 'index' })
    if (actions.indexOf('new') !== -1) {
      pathName = options.pathNames.new ? options.pathNames.new : 'new'
      this.main.page(resourcePath + '/' + pathName, resourceName + '.form', {},
        { resource: resourceName, action: 'new' })
    }
    if (actions.indexOf('show') !== -1)
      this.main.page(resourcePath + '/:id', resourceName + '.item', { id: '\\d+' },
        { resource: resourceName, action: 'show' })
    if (actions.indexOf('edit') !== -1) {
      pathName = options.pathNames.edit ? options.pathNames.edit : 'edit'
      this.main.page(resourcePath + '/:id/' + pathName, resourceName + '.form',
        { id: '\\d+' }, { resource: resourceName, action: 'edit' })
    }
  }

  addPagesForSingularResource(resourceName, resourcePath, options) {
    let actions = [ 'new', 'show', 'edit' ], pathName
    this.filterActions(actions, options)

    options.pathNames = options.pathNames || {}

    if (actions.indexOf('show') !== -1)
      this.main.page(resourcePath, resourceName + '.content', {},
        { resource: resourceName, action: 'show' })
    if (actions.indexOf('new') !== -1) {
      pathName = options.pathNames.new ? options.pathNames.new : 'new'
      this.main.page(resourcePath + '/' + pathName, resourceName + '.form', {},
        { resource: resourceName, action: 'new' })
    }
    if (actions.indexOf('edit') !== -1) {
      pathName = options.pathNames.edit ? options.pathNames.edit : 'edit'
      this.main.page(resourcePath + '/' + pathName, resourceName + '.form', {},
        { resource: resourceName, action: 'edit' })
    }
  }

  executeCallback(callback, resourceName, resourcePath, singular) {
    if (typeof callback === 'function') {
      if (callback.length === 0)
        throw new Error("Callback requires an argument.")
      return callback(
        new RoutingMapper(this.main.router, {
          singular: singular,
          pathPrefix: this.main.pathPrefix,
          resourcePath: resourcePath,
          classNamePrefix: this.main.classNamePrefix,
          resourceClassName: resourceName
        })
      )
    }
  }
}

module.exports = RoutingMapper
