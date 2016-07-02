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

    let registrar = new _PageRegistrar(this, resourceName, resourcePath, options)
    if (singular)
      registrar.addPagesForSingularResource()
    else
      registrar.addPagesForPluralResource()

    this._.executeCallback(callback, resourceName, resourcePath, singular)
  }

  collection() {
    let args

    if (this.resourcePath === undefined || this.singular)
      throw new Error("The collection method must be called within a plural resource definition.")

    args = Array.prototype.slice.call(arguments, 0)
    args.forEach(path => {
      this.page(this.resourcePath + '/' + path,
        this.resourcePath + '.' + path, {}, { action: path })
    })
  }

  member() {
    if (this.resourcePath === undefined || this.singular)
      throw new Error("The member method must be called within a plural resource definition.")

    this._defineRoutesForPaths(arguments, '/:id/')
  }

  new() {
    if (this.resourcePath === undefined)
      throw new Error("The member method must be called within a resource definition.")

    this._defineRoutesForPaths(arguments, '/new/')
  }

  view() {
    if (this.resourcePath === undefined || !this.singular)
      throw new Error("The view method must be called within a singular resource definition.")

    this._defineRoutesForPaths(arguments, '/')
  }

  _defineRoutesForPaths(args, connector) {
    let paths = Array.prototype.slice.call(args, 0)

    let constraints = {}
    if (connector === '/:id/') constraints.id = '\\d+'

    paths.forEach(path => {
      this.page(this.resourcePath + connector + path,
        this.resourcePath + '.' + path, constraints, { action: path })
    })
  }

  namespace(className) {
    let args = Array.prototype.slice.call(arguments, 1)
    let callback = args.pop()
    let options = args.pop() || {}

    if (typeof callback !== 'function')
      throw new Error("The last argument must be a function.")
    if (callback.length === 0)
      throw new Error("Callback requires an argument.")

    let path = options.path || className

    callback(
      new RoutingMapper(this.router, {
        namespacePath: this.namespacePath ? this.namespacePath + '/' + path : path,
        pathPrefix: this.pathPrefix ? this.pathPrefix + '/' + path : path,
        classNamePrefix: this.classNamePrefix ?
          this.classNamePrefix + '.' + className : className
      })
    )
  }
}

// Internal class of Cape.Component
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

// Internal class of Cape.Component
class _PageRegistrar {
  constructor(main, resourceName, resourcePath, options) {
    this.main = main
    this.resourceName = resourceName
    this.resourcePath = resourcePath
    this.options = options || {}
  }

  addPagesForPluralResource() {
    let actions = [ 'index', 'new', 'show', 'edit' ]

    this._filterActions(actions)

    this.options.pathNames = this.options.pathNames || {}

    if (actions.indexOf('index') !== -1)
      this.main.page(this.resourcePath, this.resourceName + '.list', {},
        { resource: this.resourceName, action: 'index' })

    this._addSingularFormPage(actions, 'new')

    if (actions.indexOf('show') !== -1)
      this.main.page(this.resourcePath + '/:id', this.resourceName + '.item', { id: '\\d+' },
        { resource: this.resourceName, action: 'show' })

    if (actions.indexOf('edit') !== -1) {
      let pathName = this.options.pathNames.edit ? this.options.pathNames.edit : 'edit'
      this.main.page(this.resourcePath + '/:id/' + pathName, this.resourceName + '.form',
        { id: '\\d+' }, { resource: this.resourceName, action: 'edit' })
    }
  }

  addPagesForSingularResource() {
    let actions = [ 'new', 'show', 'edit' ], pathName

    this._filterActions(actions)

    this.options.pathNames = this.options.pathNames || {}

    if (actions.indexOf('show') !== -1)
      this.main.page(this.resourcePath, this.resourceName + '.content', {},
        { resource: this.resourceName, action: 'show' })

    this._addSingularFormPage(actions, 'new')
    this._addSingularFormPage(actions, 'edit')
  }

  _addSingularFormPage(actions, actionName) {
    if (actions.indexOf(actionName) !== -1) {
      let pathName = this.options.pathNames[actionName] ?
        this.options.pathNames[actionName] : actionName
      this.main.page(this.resourcePath + '/' + pathName,
        this.resourceName + '.form', {},
        { resource: this.resourceName, action: actionName })
    }
  }

  _filterActions(actions) {
    this._keepActions(actions)
    this._excludeActions(actions)
  }

  _keepActions(actions) {
    if (typeof this.options['only'] === 'string') {
      actions.length = 0
      actions.push(this.options['only'])
    }

    if (Array.isArray(this.options['only'])) {
      actions.length = 0
      this.options['only'].forEach(function(name) { actions.push(name) })
    }
  }

  _excludeActions(actions) {
    let idx

    if (typeof this.options['except'] === 'string') {
      idx = actions.indexOf(this.options['except'])
      if (idx !== -1) actions.splice(idx, 1)
    }

    if (Array.isArray(this.options['except'])) {
      this.options['except'].forEach(function(name) {
        idx = actions.indexOf(name)
        if (idx !== -1) actions.splice(idx, 1)
      })
    }
  }
}

module.exports = RoutingMapper
