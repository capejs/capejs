(function(global) {
  "use strict";

  // Component
  //
  // public properties:
  //   root: the root node which this component is mounted on.
  // private properties:
  //   _internal: the object that holds internal properties of this component.
  var Component = function Component() {
    this._internal = new _Internal(this);
  };

  $.extend(Component.prototype, {
    mount: function(id) {
      if (this._internal.mounted)
        throw new Error("This component has been mounted already.");

      this._internal.mounted = true;
      this.root = document.getElementById(id);
      this.root.data = this._internal.getElementData(this.root);

      if (this.init) this.init();
      else this.refresh();

      if (this.afterMount) this.afterMount();
    },
    unmount: function() {
      if (!this._internal.mounted)
        throw new Error("This component has not been mounted yet.");

      this._internal.mounted = false;

      if (this.beforeUnmount) this.beforeUnmount();
      if (global.Cape.router) global.Cape.router.detach(this);
      while (this.root.firstChild) this.root.removeChild(this.root.firstChild);
      if (this.afterUnmount) this.afterUnmount();
    },
    markup: function(callback) {
      return (new global.Cape.VdomBuilder(this)).markup(callback);
    },
    refresh: function() {
      var newTree, patches, tempNode;

      if (this._internal.tree) {
        this._internal.serializeForms();
        $.extend(true, this._internal.forms, this._internal.virtualForms);

        newTree = this.render();
        patches = virtualDom.diff(this._internal.tree, newTree);
        this.root = virtualDom.patch(this.root, patches);
        this._internal.tree = newTree;
      }
      else {
        this._internal.tree = this.render();
        tempNode = virtualDom.create(this._internal.tree);
        this.root.parentNode.replaceChild(tempNode, this.root);
        this.root = tempNode;
      }

      this._internal.virtualForms = {};
      this._internal.serialized = false;
    },
    val: function(name, value) {
      if (arguments.length === 1) return this._internal.getValue(name);
      else this._internal.setValue(name, value);
    },
    formData: function(formName) {
      if (!this._internal.serialized) this._internal.serializeForms();
      if (formName === undefined) formName = '';
      return this._internal.forms[formName] || {};
    }
  });

  var _Internal = function _Internal(main) {
    this.main = main;
    this.forms = {};
    this.virtualForms = {};
    this.mounted = false;
    this.serialized = false;
  }

  // Internal (private) methods
  $.extend(_Internal.prototype, {
    getValue: function(name) {
      var names, formName, attrName, form;

      names = this.getNames(name);
      formName = names[0];
      attrName = names[1];

      if (form = this.virtualForms[formName]) {
        if (form[attrName] !== undefined) return form[attrName];
      }
      if (!this.serialized) serializeForms(this.main);
      if (form = this.forms[formName]) {
        if (form[attrName] !== undefined) return form[attrName];
      }
      return '';
    },
    setValue: function(name, value) {
      var names, formName, attrName;

      names = this.getNames(name);
      formName = names[0];
      attrName = names[1];

      if (!this.virtualForms[formName]) this.virtualForms[formName] = {};
      this.virtualForms[formName][attrName] = value;
    },
    serializeForms: function() {
      var self = this;

      self.forms = {};
      $(self.main.root).find('form').each(function(i) {
        var obj = {};

        $.each($(this).serializeArray(), function() {
          obj[this.name] = this.value || '';
        });

        if ($(this).attr('name')) {
          self.forms[$(this).attr('name')] = obj;
        }
        else {
          self.forms[''] = obj;
        }
      });
      self.serialized = true;
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

  if (!global.Cape) {
    var Cape = {};
    if ("process" in global) module.exports = Cape;
    global.Cape = Cape;
  }
  if (!global.CapeJS) {
    if ("process" in global) module.exports = CapeJS;
    global.CapeJS = global.Cape;
  }
  global.Cape.Component = Component;

  global.Cape.createComponentClass = function(methods) {
    var klass = function() {};
    $.extend(klass.prototype, global.Cape.Component.prototype, methods);
    return klass;
  }

})((this || 0).self || global);
