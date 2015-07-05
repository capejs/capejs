"use strict";

var virtualDom = require('virtual-dom');
var Inflector = require('inflected');
var Cape = require('./utilities');

// Cape.Component
//
// public properties:
//   root: the root node which this component is mounted on.
// private properties:
//   _: the object that holds internal methods and properties of this class.
var Component = function Component() {
  this._ = new _Internal(this);
};

Cape.extend(Component.prototype, {
  mount: function(id) {
    if (id === undefined)
      throw new Error("The first argument is missing.");
    if (typeof id !== 'string')
      throw new Error("The first argument must be a string.");
    if (this._.mounted)
      throw new Error("This component has been mounted already.");

    this._.mounted = true;
    this.root = document.getElementById(id);
    this.root.data = this._.getElementData(this.root);

    if (this.init) this.init();
    else this.refresh();
  },
  unmount: function() {
    if (!this._.mounted)
      throw new Error("This component has not been mounted yet.");

    this._.mounted = false;

    if (this.beforeUnmount) this.beforeUnmount();
    while (this.root.firstChild) this.root.removeChild(this.root.firstChild);
    if (this.afterUnmount) this.afterUnmount();
  },
  refresh: function() {
    var builder, newTree, patches, tempNode, textareaNodes, i, len, form;

    builder = new global.Cape.MarkupBuilder(this);

    if (this._.tree) {
      this._.serializeForms();
      global.Cape.deepExtend(this._.forms, this._.virtualForms);

      newTree = builder.markup(this.render);
      patches = virtualDom.diff(this._.tree, newTree);
      this.root = virtualDom.patch(this.root, patches);
      this._.tree = newTree;
    }
    else {
      this._.tree = builder.markup(this.render);
      tempNode = virtualDom.create(this._.tree);
      this.root.parentNode.replaceChild(tempNode, this.root);
      this.root = tempNode;
    }

    var forms = this.root.getElementsByTagName('form');
    for (i = 0, len = forms.length; i < len; i++) {
      form = forms[i];
      var key = form.getAttribute('name') || '';
      var vform = this._.virtualForms[key];
      if (!vform) continue;
      Object.keys(vform).forEach(function(k) {
        var elements, j, elem;

        elements = form.getElementsByTagName('*');
        for (j = 0; j < elements.length; j++) {
          elem = elements[j];
          if (elem.getAttribute('name') != k) continue;
          if (elem.value === undefined) continue;
          if (elem.type === 'checkbox') {
            elem.checked = vform[k];
          }
          else if (elem.type === 'radio') {
            if (elem.value === vform[k]) elem.checked = true;
          }
          else {
            elem.value = vform[k];
          }
        }
      })
    }

    this._.virtualForms = {};
    this._.serialized = false;
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

    if (!this._.virtualForms[formName]) this._.virtualForms[formName] = {};
    this._.setValuesOfNestedFields(formName, null, obj);
  },
  formData: function(formName) {
    var form, data, name, segments, lastSegment, obj;

    this._.serializeForms();
    if (formName === undefined) formName = '';
    form = this._.forms[formName] || {};

    data = {}

    for (name in form) {
      segments = name.split('/');
      lastSegment = segments.pop();
      obj = data;
      segments.forEach(function(segment) {
        if (!obj[segment]) obj[segment] = {};
        obj = obj[segment];
      })
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
  }
});

// Internal properties of Cape.Component
var _Internal = function _Internal(main) {
  this.main = main;
  this.forms = {};
  this.virtualForms = {};
  this.mounted = false;
  this.serialized = false;
}

// Internal methods of Cape.Component
Cape.extend(_Internal.prototype, {
  getValue: function(name) {
    var names, formName, attrName, form, _form;

    names = this.getNames(name);
    formName = names[0];
    attrName = names[1];

    if (form = this.virtualForms[formName]) {
      if (form[attrName] !== undefined) return form[attrName];
    }
    if (!this.serialized) this.serializeForms();
    if (form = this.forms[formName]) {
      if (form[attrName] !== undefined) return form[attrName];
    }
    return '';
  },
  setValue: function(name, value) {
    var names, formName, attrName, origValue;

    names = this.getNames(name);
    formName = names[0];
    attrName = names[1];
    origValue = this.getValue(name);

    if (!this.virtualForms[formName]) this.virtualForms[formName] = {};
    this.virtualForms[formName][attrName] = value;

    return origValue;
  },
  setValuesOfNestedFields: function(formName, prefix, obj) {
    var attrName, key;

    for (key in obj) {
      attrName = prefix ? prefix + '/' + key : key;
      if (typeof obj[key] === 'object') {
        this.setValuesOfNestedFields(formName, attrName, obj[key])
      }
      else if (typeof obj[key] === 'array') {
        obj[key].forEach(function(element, index) {
          this.setValuesOfNestedFields(formName, attrName + '/' + index, element)
        })
      }
      else {
        this.virtualForms[formName][attrName] = obj[key];
      }
    }
  },
  serializeForms: function() {
    var forms, elements, i, j, elem, segments, lastSegment, obj, o;

    this.forms = {};
    forms = this.main.root.getElementsByTagName('form');
    for (i = 0; i < forms.length; i++) {
      elements = forms[i].getElementsByTagName('*');
      obj = {};
      for (j = 0; j < elements.length; j++) {
        elem = elements[j];
        if (elem.name && (elem.value !== undefined)) {
          if ((elem.type === 'checkbox' || elem.type === 'radio') && !elem.checked)
            continue;
          obj[elem.name] = elem.value;
        }
      }
      if (forms[i].getAttribute('name')) {
        this.forms[forms[i].getAttribute('name')] = obj;
      }
      else {
        this.forms[''] = obj;
      }
    }
    this.serialized = true;
  },
  getElementData: function(element) {
    var data = {}, camelCaseName;
    [].forEach.call(element.attributes, function(attr) {
      if (/^data-/.test(attr.name)) {
        camelCaseName = attr.name.substr(5).replace(/-(.)/g, function ($0, $1) {
          return $1.toUpperCase();
        });
        data[camelCaseName] = attr.value;
      }
    });
    return data;
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

module.exports = Component;
