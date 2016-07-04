'use strict'

let Cape = require('./utilities')

// Cape.DataStore
//
// public properties:
//   options: the object that holds option values given to the constructor
// private properties:
//   _: the object that holds internal methods and properties of this class.
class DataStore {
  constructor(options) {
    this.options = options || {}
    this._ = new _Internal(this)
    if (typeof this.init === 'function') this.init()
  }
}

DataStore.create = function(options) {
  if (!this.instance) this.instance = new this(options)
  return this.instance
}

let PropagatorMethods = require('./mixins/propagator_methods')
Object.assign(DataStore.prototype, PropagatorMethods)

// Internal properties of Cape.DataStore
class _Internal {
  constructor(main) {
    this.main = main
    this.components = []
  }
}

module.exports = DataStore
