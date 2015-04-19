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
    if (this._.mounted)
      throw new Error("This component has been mounted already.");

    this._.mounted = true;
    this.root = document.getElementById(id);
    this.root.data = this._.getElementData(this.root);

    if (this.init) this.init();
    else this.refresh();

    if (this.afterMount) this.afterMount();
  },
  unmount: function() {
    if (!this._.mounted)
      throw new Error("This component has not been mounted yet.");

    this._.mounted = false;

    if (this.beforeUnmount) this.beforeUnmount();
    if (global.Cape.router) global.Cape.router.detach(this);
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
          if (elem.type === 'hidden') continue;
          if (elem.type === 'checkbox') {
            elem.checked = vform[k];
          }
          else if (elem.type === 'checkbox') {
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
  val: function(name, value) {
    if (arguments.length === 1) return this._.getValue(name);
    else return this._.setValue(name, value);
  },
  formData: function(formName) {
    this._.serializeForms();
    if (formName === undefined) formName = '';
    return this._.forms[formName] || {};
  },
  renderPartial: function(builder, componentName, thisObj) {
    var fragments = componentName.split('.'),
        klassName = fragments.pop(),
        obj, i, camelized, partial;

    klassName = Inflector.camelize(klassName);

    obj = window;
    for (i = 0; obj && i < fragments.length; i++) {
      camelized = Inflector.camelize(fragments[i]);
      if (obj[camelized]) obj = obj[camelized];
      else obj = null;
    }
    if (!obj || !obj['_' + klassName]) {
      throw new Error(
        "Partial component class not found for '" + componentName + "'");
    }

    partial = new obj['_' + klassName];
    partial.render.call(thisObj, builder);
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
    var names, formName, attrName, form;

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
          if (elem.type === 'checkbox' || elem.type === 'radio')
            if (!elem.checked) continue;
          segments = elem.name.split('/');
          lastSegment = segments.pop();
          o = obj;
          segments.forEach(function(segment) {
            if (!o[segment]) o[segment] = {};
            o = o[segment];
          })
          o[lastSegment] = elem.value;
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
  }
})

module.exports = Component;
