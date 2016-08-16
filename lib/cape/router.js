'use strict'

let Inflector = require('inflected')
let Cape = require('./utilities')

// Cape.Router
//
// public properties:
//   routes: array of hashes that contains routing information.
//   params: the parameters that are extracted from URL hash fragment.
//   query: the parameters that are extracted from the query part of URL hash fragment.
//   vars: an object which users can store arbitrary data to.
//   flash: an object which users can store arbitrary data to, but is erased after each
//          navigation.
//   namespace: the namespace part of URL hash fragment.
//   resource: the resource part of URL hash fragment.
//   action: the action name of current route.
//   container: the name of container of component.
//   component: the name of component.
// private properties:
//   _: the object that holds internal methods and properties of this class.
class Router {
  constructor(rootContainer) {
    this._ = new _Internal(this)
    this.rootContainer = rootContainer || window
    this.routes = []
    this.params = {}
    this.query = {}
    this.vars = {}
    this.flash = {}
    this.namespace = null
    this.resource = null
    this.action = null
    this.container = null
    this.component = null
  }

  draw(callback) {
    if (typeof callback !== 'function')
      throw new Error("The last argument must be a function.")
    if (callback.length === 0)
      throw new Error("Callback requires an argument.")

    let mapper = new global.Cape.RoutingMapper(this)
    callback(mapper)
  }

  mount(elementId) {
    this._.targetElementId = elementId
  }

  start() {
    if (window.addEventListener)
      window.addEventListener('hashchange', this._.eventListener, false)
    else if (window.attachEvent)
      window.attachEvent('onhashchange', this._.eventListener)

    this._.currentHash = window.location.href.split('#')[1] || ''
    this.navigate(this._.currentHash)
  }

  stop() {
    if (window.removeEventListener)
      window.removeEventListener('hashchange', this._.eventListener, false)
    else if (window.detachEvent)
      window.detachEvent('onhashchange', this._.eventListener)
  }

  routeFor(hash) {
    let i, len, route

    for (i = 0, len = this.routes.length; i < len; i++) {
      route = this.routes[i]
      if (hash.match(route.regexp)) return route
    }
    throw new Error("No route match. [" + hash + "]")
  }

  navigateTo(hash, params, options) {
    if (params !== undefined) {
      hash = this._.constructHash(params, hash)
    }

    this._.currentHash = hash
    this._.setHash(hash)

    options = options || {}
    this.flash.notice = options.notice
    this.flash.alert = options.alert

    if (this._.beforeNavigationCallbacks.length) {
      let promises = []
      let promise = new Promise((resolve, reject) => resolve(hash))
      promises.push(promise)

      let i, len
      for (i = 0, len = this._.beforeNavigationCallbacks.length; i < len; i++) {
        promise = promise.then(this._.beforeNavigationCallbacks[i])
        promises.push(promise)
      }
      Promise.all(promises).then((results) => {
        this._.mountComponent(results.pop())
      }, this._.errorHandler)
    }
    else {
      this._.mountComponent(hash)
    }
  }

  // Deprecated. Use navigateTo() instead.
  navigate(hash, options) {
    this.navigateTo(hash, {}, options)
  }

  redirectTo(hash, params, options) {
    // For backward compatibility, if the second argument has a key 'notice'
    // or 'alert' and the third argument is undefined, the second argument
    // should be treated as options.
    if (typeof params === 'object' && options === undefined) {
      if (params.hasOwnProperty('notice') || params.hasOwnProperty('alert')) {
        options = params
        params = undefined
      }
    }

    if (params !== undefined) {
      hash = this._.constructHash(params, hash)
    }

    this._.currentHash = hash
    this._.setHash(hash)

    options = options || {}
    this.flash.notice = options.notice
    this.flash.alert = options.alert
    this._.mountComponent(hash)
  }

  show(klass, params) {
    this.query = {}
    if (params !== undefined) {
      for (let prop in params) {
        if ({}.hasOwnProperty.call(params, prop)) {
          this.query[prop] = params[prop]
        }
      }
    }

    let component = new klass()
    component.mount(this._.targetElementId)
    this._.mountedComponentClass = klass
    this._.mountedComponent = component
  }

  attach(listener) {
    if (listener === undefined) throw new Error("Missing listener.")
    if (typeof listener.refresh !== 'function')
      throw new Error('The listener must have the "refresh" function.')

    for (let i = 0, len = this._.notificationListeners.length; i < len; i++) {
      if (this._.notificationListeners[i] === listener) return
    }
    this._.notificationListeners.push(listener)
  }

  detach(listener) {
    for (let i = 0, len = this._.notificationListeners.length; i < len; i++) {
      if (this._.notificationListeners[i] === listener) {
        this._.notificationListeners.splice(i, 1)
        break
      }
    }
  }

  beforeNavigation(callback) {
    this._.beforeNavigationCallbacks.push(callback)
  }

  errorHandler(callback) {
    this._.errorHandler = callback
  }

  notify() {
    for (let i = this._.notificationListeners.length; i--;) {
      this._.notificationListeners[i].refresh()
    }
  }
}

// Internal class of Cape.Router
class _Internal {
  constructor(main) {
    this.main = main
    this.eventListener = () => {
      let hash = window.location.href.split('#')[1] || ''
      if (hash !== this.currentHash) this.main.navigate(hash)
    }
    this.beforeNavigationCallbacks = []
    this.notificationListeners = []
    this.currentHash = null
    this.mountedComponent = null
    this.targetElementId = null
  }

  mountComponent(hash) {
    if (typeof hash !== 'string')
      throw new Error("The first argument must be a string.")

    let route = this.main.routeFor(hash)
    this.main.namespace = route.namespace
    this.main.resource = route.resource
    this.main.action = route.action
    this.main.container = route.container
    this.main.component = route.component
    this.setParams(route)
    this.setQuery(route)
    let componentClass = this.getComponentClassFor(route)

    if (componentClass === this.mountedComponentClass) {
      this.main.notify()
    }
    else {
      if (this.mountedComponent) this.mountedComponent.unmount()
      this.main.notify()
      let component = new componentClass
      component.mount(this.targetElementId)
      this.mountedComponentClass = componentClass
      this.mountedComponent = component
    }

    this.main.flash = {}
  }

  constructHash(params, hash) {
    let pairs = []
    for (let prop in params) {
      if ({}.hasOwnProperty.call(params, prop)) {
        pairs.push(prop + '=' + params[prop])
      }
    }
    if (pairs.length > 0)
      return hash + '?' + pairs.join('&')
    else
      return hash
  }

  setHash(hash) {
    window.location.hash = hash
  }

  setParams(route) {
    let md = this.currentHash.match(route.regexp)
    this.main.params = {}
    route.keys.forEach((key, i) => {
      this.main.params[key] = md[i + 1]
    })
  }

  setQuery(route) {
    this.main.query = {}
    let queryString = this.currentHash.split('?')[1]
    if (queryString === undefined) return
    let pairs = queryString.split('&')
    pairs.forEach(pair => {
      let parts = pair.split('=')
      this.main.query[parts[0]] = parts[1] || ''
    })
  }

  getComponentClassFor(route) {
    let fragments = []
    if (route.container) {
      route.container.split('.').forEach(part => {
        fragments.push(Inflector.camelize(part))
      })
    }

    let obj = this.main.rootContainer
    for (let i = 0; obj && i < fragments.length; i++) {
      if (obj[fragments[i]]) obj = obj[fragments[i]]
      else obj = null
    }

    let componentName = Inflector.camelize(route.component)
    if (obj && obj[componentName]) return obj[componentName]

    throw new Error(
      "Component class "
        + fragments.concat([componentName]).join('.')
        + " is not defined."
    )
  }
}

module.exports = Router
