'use strict';

var Cape = require('./utilities');

// Cape.Partial
//
// public properties:
//   parent: the parent component that contains this partial component.
var Partial = function Partial(parent) {
  this.parent = parent;
  this.virtualForms = parent.virtualForms;
};

Cape.extend(Partial.prototype, {
  refresh: function() {
    this.parent.refresh()
  },

  val: function(arg1, arg2) {
    if (arguments.length === 1)
      return this.parent.val(arg1);
    else
      return this.parent.val(arg1, arg2);
  },

  setValues: function(formName, obj) {
    this.virtualForms.setValues(formName, obj);
  },

  formData: function(formName) {
    return this.virtualForms.formData(formName);
  },

  paramsFor: function(formName, options) {
    return this.virtualForms.paramsFor(formName, options);
  },

  jsonFor: function(formName, options) {
    return this.virtualForms.jsonFor(formName, options);
  },

  checkedOn: function(name) {
    return this.virtualForms.checkedOn(name);
  }
});

module.exports = Partial;
