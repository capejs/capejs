'use strict'

let Inflector = require('inflected')
let Cape = require('./utilities')
let checkStatus = require('./mixins/check_status')

// Cape.ResourceAgent
//
// public properties:
//   resourceName: the name of resource
//   id: the id of the resource
//   client: the object that utilizes this agent
//   basePath: the string that is added to the request path. Default value is '/'.
//   nestedIn: the string that is inserted between path prefix and the resource
//     name. Default value is ''.
//   shallow: a boolean value that controls whether the agent should omit
//     the `nestedIn` string from the member path. Default is `false`.
//   adapter: the name of adapter (e.g., 'rails'). Default is undefined.
//     Default value can be changed by setting Cape.defaultAgentAdapter property.
//   autoRefresh: a boolean value that controls unsafe Ajax requests trigger
//     this.refresh(). Default is `false`.
//   dataType: the type of data that you're expecting from the server.
//     The value must be 'json', text' or undefined.
//     When the `dataType` option is not defined, the type is detected automatically.
//   singular: a boolean value that specifies if the resource is singular or not.
//     Resources are called 'singular' when they have a URL without ID.
//     Default is `false`.
//   formName: the name of form with which the users edit the properties
//     of the resource. Default is `undefiend`.
//     When the `formName` option is not defined, the name is derived from the
//     `resourceName` property, e.g. `user` if the resource name is `user`.
//   paramName: the name of parameter to be used when request parameter is
//     constructed. Default is `undefiend`.
//     When the `paramName` option is not defined, the name is derived from the
//     `resourceName` property, e.g. `user` if the resource name is `user`.
//   object: the object that represents the resource.
//   data: the response data from the server. This property holds an object
//     if the response data is a valid JSON string. Otherwise, it holds the
//     original string value.
//   errors: the object that holds error messages.
//   headers: the HTTP headers for Ajax requests.
// private properties:
//   _: the object that holds internal methods and properties of this class.
//
// parameters for the constructor
//   client: the component object that use this agent.
//   options: an object that is used to initialize properties. The properties
//     which can be initialized by it are `resourceName`, `basePath`,
//     `nestedIn`, `adapter`, `dataType`, and `singular`.
class ResourceAgent {
  constructor(client, options) {
    let adapterName, adapter

    options = options || {}

    this._ = new _Internal(this)
    this.resourceName = options.resourceName
    this.client = client
    this.id = options.id
    this.basePath = options.basePath
    this.nestedIn = options.nestedIn
    this.shallow = options.shallow || false
    this.adapter = options.adapter
    this.autoRefresh = options.autoRefresh || false
    this.dataType = options.dataType
    this.singular = options.singular || false
    this.formName = options.formName
    this.paramName = options.paramName

    this.object = undefined
    this.data = undefined
    this.errors = {}
    this.headers = { 'Content-Type': 'application/json' }
  }

  init(afterInitialize, errorHandler) {
    let self = this, path

    if (this.singular) {
      path = this.singularPath()
    }
    else if (this.id) {
      path = this.memberPath()
    }
    else {
      path = this.newPath()
    }
    errorHandler = errorHandler || this.defaultErrorHandler

    this._.applyAdapter()

    fetch(path, {
      headers: this._.headers(),
      credentials: 'same-origin'
    })
    .then(checkStatus)
    .then(this._.responseHandler())
    .then(function(data) { self._.initialDataHandler(data, afterInitialize); })
    .catch(errorHandler)
  }

  refresh() {
    let self = this
    this.show(function(data) {
      self.data = data
      self.afterRefresh()
    })
  }

  // Called by the `refresh()` method after it updates the `data` property.
  //
  // Developers may override this method to let the agent do some
  // post-processing jobs.
  afterRefresh() {
    this.client.refresh()
  }

  show(callback, errorHandler) {
    this.ajax('GET', this.requestPath(), {}, callback, errorHandler)
  }

  create(afterCreate, errorHandler) {
    let path = this.singular ? this.singularPath() : this.collectionPath()
    let params = this.client.paramsFor(
      this.formName || this.resourceName,
      { as: this.paramName || this.resourceName }
    )
    this.ajax('POST', path, params, afterCreate, errorHandler)
    return false
  }

  update(afterUpdate, errorHandler) {
    let path = this.singular ? this.singularPath() : this.memberPath()
    let params = this.client.paramsFor(
      this.formName || this.resourceName,
      { as: this.paramName || this.resourceName }
    )
    this.ajax('PATCH', path, params, afterUpdate, errorHandler)
    return false
  }

  destroy(afterDestroy, errorHandler) {
    let path = this.singular ? this.singularPath() : this.memberPath()
    this.ajax('DELETE', path, {}, afterDestroy, errorHandler)
    return false
  }

  get(actionName, params, callback, errorHandler) {
    this._.http_request('GET', actionName, params, callback, errorHandler)
  }

  head(actionName, params, callback, errorHandler) {
    this._.http_request('HEAD', actionName, params, callback, errorHandler)
  }

  post(actionName, params, callback, errorHandler) {
    this._.http_request('POST', actionName, params, callback, errorHandler)
  }

  patch(actionName, params, callback, errorHandler) {
    this._.http_request('PATCH', actionName, params, callback, errorHandler)
  }

  put(actionName, params, callback, errorHandler) {
    this._.http_request('PUT', actionName, params, callback, errorHandler)
  }

  delete(actionName, params, callback, errorHandler) {
    this._.http_request('DELETE', actionName, params, callback, errorHandler)
  }

  requestPath() {
    if (this.singular) {
      return this.singularPath()
    }
    else if (this.id === undefined) {
      return this.collectionPath()
    }
    else {
      return this.memberPath()
    }
  }

  collectionPath() {
    let resources = Inflector.pluralize(Inflector.underscore(this.resourceName))
    return this._.pathPrefix() + resources
  }

  newPath() {
    let resources = Inflector.pluralize(Inflector.underscore(this.resourceName))
    return this._.pathPrefix() + resources + '/new'
  }

  memberPath() {
    let resources = Inflector.pluralize(Inflector.underscore(this.resourceName))
    return this._.pathPrefix(this.shallow) + resources + '/' + this.id
  }

  singularPath() {
    let resource = Inflector.underscore(this.resourceName)
    return this._.pathPrefix() + resource
  }

  defaultErrorHandler(ex) {
    console.log(ex)
  }
}

Object.assign(ResourceAgent.prototype, require('./mixins/agent_common_methods'))

// Internal class of Cape.ResourceAgent
class _Internal {
  constructor(main) {
    this.main = main
  }

  http_request(verb, actionName, params, callback, errorHandler) {
    let path = this.main.requestPath()
    if (actionName !== '') path = path + '/' + actionName
    this.main.ajax(verb, path, params, callback, errorHandler)
  }

  initialDataHandler(data, afterInitialize) {
    let formName = this.main.formName || this.main.resourceName,
        paramName = this.main.paramName || this.main.resourceName

    try {
      this.main.data = JSON.parse(data)
      this.main.object = this.main.data[paramName] || {}
    }
    catch (e) {
      console.log("Could not parse the response data as JSON.")
      this.main.data = data
    }
    if (typeof afterInitialize === 'function') {
      afterInitialize.call(this.main.client, this.main)
    }
    else if (this.main.object) {
      this.main.client.setValues(formName, this.main.object)
      this.main.client.refresh()
    }
  }
}

Object.assign(_Internal.prototype, require('./mixins/agent_common_inner_methods'))

module.exports = ResourceAgent
