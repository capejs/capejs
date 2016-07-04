'use strict'

let PropagatorMethods = {
  attach: function(component) {
    let target = component
    for (let i = 0, len = this._.components.length; i < len; i++) {
      if (this._.components[i] === component) return
    }
    this._.components.push(component)
  },

  detach: function(component) {
    for (let i = 0, len = this._.components.length; i < len; i++) {
      if (this._.components[i] === component) {
        this._.components.splice(i, 1)
        break
      }
    }
  },

  propagate: function() {
    for (let i = this._.components.length; i--;)
      this._.components[i].refresh()
  }
}

module.exports = PropagatorMethods
