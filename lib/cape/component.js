'use strict'

let virtualDom = require('virtual-dom')
let Inflector = require('inflected')
let Cape = require('./utilities')

// Cape.Component
//
// public properties:
//   root: the root node which this component is mounted on.
//   virtualForms: an object that keeps the values of all form controls within this component.
// private properties:
//   _: the object that holds internal methods and properties of this class.

class Component {
  constructor() {
    this.root = undefined
    this.virtualForms = new Cape.VirtualForms(this)
    this._ = new _Internal(this);
  }

  mount(id) {
    if (id === undefined)
      throw new Error("The first argument is missing.")
    if (typeof id !== 'string')
      throw new Error("The first argument must be a string.")
    if (this._.mounted)
      throw new Error("This component has been mounted already.")

    this._.mounted = true
    this.root = document.getElementById(id)

    if (this.root === undefined || this.root === null)
      throw new Error("The element with #" + id + ' is not found.')

    this.root.data = this._.getElementData(this.root)

    if (this.init) this.init()
    else this.refresh()
  }

  unmount() {
    if (!this._.mounted)
      throw new Error("This component has not been mounted yet.")

    this._.mounted = false

    if (this.beforeUnmount) this.beforeUnmount()
    while (this.root.firstChild) this.root.removeChild(this.root.firstChild)
    if (this.afterUnmount) this.afterUnmount()
  }

  refresh() {
    let builder, newTree, patches, tempNode, textareaNodes, i, j, len, form,
        elements, elem, formName, vform, elemName

    builder = new global.Cape.MarkupBuilder(this)

    this.virtualForms.prepare()
    if (this._.tree) {
      newTree = builder.markup(this.render)
      patches = virtualDom.diff(this._.tree, newTree)
      this.root = virtualDom.patch(this.root, patches)
      this._.tree = newTree
    }
    else {
      this._.tree = builder.markup(this.render)
      tempNode = virtualDom.create(this._.tree)
      this.root.parentNode.replaceChild(tempNode, this.root)
      this.root = tempNode
    }
    this.virtualForms.apply()
  }

  val(arg1, arg2) {
    if (arguments.length === 1)
      return this.virtualForms.val(arg1)
    else
      return this.virtualForms.val(arg1, arg2)
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

class _Internal {
  constructor(main) {
    this.main = main
    this.mounted = false
  }

  getElementData(element) {
    let data = {}, camelCaseName
    [].forEach.call(element.attributes, function(attr) {
      if (/^data-/.test(attr.name)) {
        camelCaseName = attr.name.substr(5).replace(/-(.)/g, function ($0, $1) {
          return $1.toUpperCase()
        })
        data[camelCaseName] = attr.value
      }
    })
    return data
  }
}

module.exports = Component
