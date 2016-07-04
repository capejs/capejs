'use strict'

var Inflector = require('inflected')
var checkStatus = require('./check_status')

let AgentCommonMethods = {
  ajax: function(httpMethod, path, params, callback, errorHandler) {
    params = params || {}
    errorHandler = errorHandler || this.defaultErrorHandler

    this._.applyAdapter()

    let isSafeMethod = (httpMethod === 'GET' || httpMethod === 'HEAD')
    let fetchOptions = {
      method: httpMethod,
      headers: this._.headers(),
      credentials: 'same-origin'
    }

    if (isSafeMethod) {
      let pairs = []
      for (var key in params) {
        pairs.push(encodeURIComponent(key) + "=" +
          encodeURIComponent(params[key]))
      }
      if (pairs.length) path = path + '?' + pairs.join('&')
    }
    else {
      fetchOptions.body = JSON.stringify(params)
    }

    fetch(path, fetchOptions)
      .then(checkStatus)
      .then(this._.responseHandler())
      .then((data) => {
        this._.dataHandler(data, callback)
        if (this.autoRefresh && !isSafeMethod) this.refresh()
      })
      .catch(errorHandler)

    return false
  }
}

module.exports = AgentCommonMethods
