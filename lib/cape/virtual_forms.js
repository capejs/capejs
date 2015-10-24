'use strict';

var Cape = require('./utilities');

// Cape.VirtualForms
//
// This class is to be used by an instance of Cape.Component internally.
//
// public properties:
//   component: the component whose forms are represented by the instance of this class.
//   items: an object that keeps virtual forms, which keep attribute names and their values
//     to be applied to the component after it gets rendered.
// private properties:
//   _: the object that holds internal methods and properties of this class.
var VirtualForms = function VirtualForms(component) {
  this.component = component;
  this.items = {};
  this._ = new _Internal(this);
};

Cape.extend(VirtualForms.prototype, {
  prepare: function() {
    this._.compile();
    global.Cape.deepExtend(this._.realForms, this.items);
    this._.tempForms = global.Cape.deepExtend({}, this._.realForms);
  },

  apply: function() {
    var forms, i, len, form, formName, tForm, j, elements, elem, elemName, k;

    forms = this.component.root.getElementsByTagName('form');

    for (i = 0, len = forms.length; i < len; i++) {
      form = forms[i];
      formName = form.getAttribute('name') || '';
      tForm = this._.tempForms[formName] || {};

      elements = form.getElementsByTagName('*');
      for (j = 0; j < elements.length; j++) {
        elem = elements[j];
        if (elem.value === undefined || elem.name === undefined) continue;
        if (elem.type === 'hidden') {
          if (elements[j + 1] && elements[j + 1].type === 'checkbox') continue;
        }
        elemName = elem.getAttribute('name');

        if (elem.type === 'checkbox') {
          if (elemName.slice(-2) === '[]' && Array.isArray(tForm[elemName])) {
            elem.checked = false;
            for (k = 0; k < tForm[elemName].length; k++) {
              if (elem.value === tForm[elemName][k]) {
                elem.checked = true;
                break;
              }
            }
          }
          else {
            elem.checked = tForm[elemName] === true || tForm[elemName] === '1';
          }
        }
        else if (elem.type === 'radio') {
          elem.checked = (elem.value === tForm[elemName]);
        }
        else {
          if (elem.value !== tForm[elemName])
            elem.value = tForm[elemName] ? tForm[elemName] : '';
        }
      }
    }

    this.items = {};
    this._.compiled = false;
  },

  update: function(formName, options) {
    var tForm;

    tForm = this._.tempForms[formName];
    if (tForm === undefined) {
      tForm = this._.tempForms[formName] = {};
    }
    if (options.type === 'checkbox') {
      if (tForm[options.name] === undefined)
        tForm[options.name] = !!options.checked;
    }
    else if (options.type === 'radio' && options.checked) {
      if (tForm[options.name] === undefined)
        tForm[options.name] = options.value;
    }
    else {
      if (options.value) {
        if (tForm[options.name] === undefined)
          tForm[options.name] = options.value;
      }
    }
  },

  val: function(arg1, arg2) {
    var key1, key2, value;

    if (typeof arg1 === 'object') {
      for (key1 in arg1) {
        if (arg1.hasOwnProperty(key1)) {
          value = arg1[key1];
          if (typeof value === 'object') {
            for (key2 in value) {
              if (value.hasOwnProperty(key2)) {
                this._.setValue(key1 + '.' + key2, value[key2]);
              }
            }
          }
          else {
            this._.setValue(key1, value);
          }
        }
      }
    }
    else {
      if (arguments.length === 1) return this._.getValue(arg1);
      else return this._.setValue(arg1, arg2);
    }
  },

  setValues: function(formName, obj) {
    var key;

    if (typeof formName !== 'string')
      throw new Error("The first argument must be a string.");

    if (typeof obj !== 'object')
      throw new Error("The second argument must be an object.");

    if (!this.items[formName]) this.items[formName] = {};
    this._.setValuesOfNestedFields(formName, null, obj);
  },

  formData: function(formName) {
    var form, data, name, segments, lastSegment, obj;

    this._.compile();
    if (formName === undefined) formName = '';
    form = this._.realForms[formName] || {};

    data = {}

    for (name in form) {
      segments = name.split('/');
      lastSegment = segments.pop();
      obj = data;
      segments.forEach(function(segment) {
        if (!obj[segment]) obj[segment] = {};
        obj = obj[segment];
      })
      if (lastSegment.slice(-2) === '[]') {
        lastSegment = lastSegment.slice(0, -2)
      }
      obj[lastSegment] = form[name];
    }

    return data;
  },

  paramsFor: function(formName, options) {
    var paramName, params;

    options = options || {};
    paramName = options.as || formName;
    params = {};
    params[paramName] = this.formData(formName);
    return params;
  },

  jsonFor: function(formName, options) {
    var paramName, obj, params;

    options = options || {};
    paramName = options.as || formName;

    obj = this.formData(formName);
    obj = this._.object2array(obj);

    params = {};
    params[paramName] = obj;
    return JSON.stringify(params);
  },

  checkedOn: function(name) {
    var names, formName, attrName, forms, elements, cb, value;

    names = this._.getNames(name);
    formName = names[0];
    attrName = names[1];

    forms = this.component.root.getElementsByTagName('form');

    for (var i = 0; i < forms.length; i++) {
      elements = forms[i].getElementsByTagName('input');
      for (var j = 0; j < elements.length; j++) {
        if (elements[j].name === attrName && elements[j].type === 'checkbox') {
          cb = elements[j];
        }
      }
    }

    if (cb === undefined) return undefined;

    value = this._.getValue(name);

    return (value === '1' || value === true);
  }
})

// Internal properties of Cape.VirtualForms
var _Internal = function _Internal(main) {
  this.main = main;
  this.realForms = {};
  this.tempForms = {};
  this.compiled = false;
}

// Internal methods of Cape.VirtualForms
Cape.extend(_Internal.prototype, {
  getValue: function(name) {
    var names, formName, attrName, form, _form;

    names = this.getNames(name);
    formName = names[0];
    attrName = names[1];

    if (formName in this.main.items) {
      if (attrName in this.main.items[formName]) {
        return this.main.items[formName][attrName];
      }
    }
    if (!this.compiled) this.compile();

    if (formName in this.realForms) {
      if (attrName in this.realForms[formName]) {
        return this.realForms[formName][attrName];
      }
    }
    return '';
  },

  setValue: function(name, value) {
    var names, formName, attrName, origValue;

    names = this.getNames(name);
    formName = names[0];
    attrName = names[1];
    origValue = this.getValue(name);

    if (!this.main.items[formName]) this.main.items[formName] = {};
    this.main.items[formName][attrName] = value;

    return origValue;
  },

  setValuesOfNestedFields: function(formName, prefix, obj) {
    var attrName, key, self;

    for (key in obj) {
      attrName = prefix ? prefix + '/' + key : key;
      if (key.slice(-2) === '[]') {
        if (Array.isArray(obj[key])) {
          this.main.items[formName][attrName] = obj[key];
        }
      }
      else {
        if (Array.isArray(obj[key])) {
          self = this;
          obj[key].forEach(function(element, index) {
            self.setValuesOfNestedFields(formName, attrName + '/' + index,
              element)
          });
        }
        else if (typeof obj[key] === 'object') {
          this.setValuesOfNestedFields(formName, attrName, obj[key])
        }
        else {
          this.main.items[formName][attrName] = obj[key];
        }
      }
    }
  },

  compile: function() {
    var forms, elements, i, j, elem, segments, lastSegment, obj, o, name;

    this.realForms = {};
    forms = this.main.component.root.getElementsByTagName('form');
    for (i = 0; i < forms.length; i++) {
      elements = forms[i].getElementsByTagName('*');
      obj = {};
      for (j = 0; j < elements.length; j++) {
        elem = elements[j];
        if (elem.name && (elem.value !== undefined) && !elem.disabled) {
          if (elem.type === 'checkbox') {
            if (elem.name.slice(-2) === '[]') {
              if (!Array.isArray(obj[elem.name])) obj[elem.name] = [];
              if (elem.checked) obj[elem.name].push(elem.value);
            }
            else {
              if (elem.checked) obj[elem.name] = elem.value;
            }
          }
          else if (elem.type === 'radio') {
            if (elem.checked) obj[elem.name] = elem.value;
          }
          else {
            obj[elem.name] = elem.value;
          }
        }
      }
      if (forms[i].getAttribute('name')) {
        this.realForms[forms[i].getAttribute('name')] = obj;
      }
      else {
        this.realForms[''] = obj;
      }
    }
    this.compiled = true;
  },

  getNames: function(name) {
    if (typeof name === 'string' && name.indexOf('.') >= 0) {
      return name.split('.', 2);
    }
    else {
      return [ '', name ]
    }
  },

  object2array: function(obj) {
    var isArray = true, _obj, key, ary = [];

    _obj = Cape.deepExtend({}, obj);
    for (key in _obj) {
      if (key.length === 0 || key.match(/\D/)) {
        isArray = false;
        if (typeof obj[key] === 'object')
          obj[key] = this.object2array(_obj[key]);
      }
      else {
        if (typeof obj[key] === 'object')
          ary.push(this.object2array(_obj[key]));
        else
          ary.push(obj[key]);
      }
    }

    if (isArray) return ary;
    else return obj;
  }
})

module.exports = VirtualForms;
