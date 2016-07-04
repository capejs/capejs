'use strict'

let Cape = require('./utilities')

// Cape.Partial
//
// public properties:
//   parent: the parent component that contains this partial component.
class Partial {
  constructor(parent) {
    this.parent = parent
    this.virtualForms = parent.virtualForms
  }

  refresh() {
    this.parent.refresh()
  }

  val(arg1, arg2) {
    if (arguments.length === 1)
      return this.parent.val(arg1)
    else
      return this.parent.val(arg1, arg2)
  }

  setValues(formName, obj) {
    this.virtualForms.setValues(formName, obj)
  }

  formData(formName) {
    return this.virtualForms.formData(formName)
  }

  paramsFor(formName, options) {
    return this.virtualForms.paramsFor(formName, options)
  }

  jsonFor(formName, options) {
    return this.virtualForms.jsonFor(formName, options)
  }

  checkedOn(name) {
    return this.virtualForms.checkedOn(name)
  }
}

module.exports = Partial
