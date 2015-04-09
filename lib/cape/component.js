(function(global) {
  "use strict";

  var _Internal = function _Internal(main) {
    this.main = main;
  }

  // Internal (private) methods
  $.extend(_Internal.prototype, {
    getValue: function(name) {
      var names, formName, attrName, form;

      names = getNames(name);
      formName = names[0];
      attrName = names[1];

      if (form = this.main.virtualForms[formName]) {
        if (form[attrName] !== undefined) return form[attrName];
      }
      if (!this.main.serialized) serializeForms(this.main);
      if (form = this.main.forms[formName]) {
        if (form[attrName] !== undefined) return form[attrName];
      }
      return '';
    },
    setValue: function(name, value) {
      var names, formName, attrName;

      names = getNames(name);
      formName = names[0];
      attrName = names[1];

      if (!this.main.virtualForms[formName]) this.main.virtualForms[formName] = {};
      this.main.virtualForms[formName][attrName] = value;
    },
    serializeForms: function() {
      var self = this;

      self.main.forms = {};
      $(self.main.root).find('form').each(function(i) {
        var obj = {};

        $.each($(this).serializeArray(), function() {
          obj[this.name] = this.value || '';
        });

        if ($(this).attr('name')) {
          self.main.forms[$(this).attr('name')] = obj;
        }
        else {
          self.main.forms[''] = obj;
        }
      });
      self.main.serialized = true;
    }
  })

  var Component = function Component() {};

  $.extend(Component.prototype, {
    mount: function(id) {
      this._internal = new _Internal(this);
      this.forms = {};
      this.virtualForms = {};
      this.serialized = false;

      this.root = document.getElementById(id);
      this.root.data = getData(this.root);

      if (this.init) this.init();
      else this.refresh();

      if (this.afterMount) this.afterMount();
    },
    unmount: function() {
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

      if (this.tree) {
        this._internal.serializeForms();
        $.extend(true, this.forms, this.virtualForms);

        newTree = this.render();
        patches = virtualDom.diff(this.tree, newTree);
        this.root = virtualDom.patch(this.root, patches);
        this.tree = newTree;
      }
      else {
        this.tree = this.render();
        tempNode = virtualDom.create(this.tree);
        this.root.parentNode.replaceChild(tempNode, this.root);
        this.root = tempNode;
      }

      this.virtualForms = {};
      this.serialized = false;
    },
    val: function(name, value) {
      if (arguments.length === 1) return this._internal.getValue(name);
      else this._internal.setValue(name, value);
    },
    formData: function(formName) {
      if (!this.serialized) this._internal.serializeForms();
      if (formName === undefined) formName = '';
      return this.forms[formName] || {};
    }
  });

  function getData(el) {
    var data = {};
    [].forEach.call(el.attributes, function(attr) {
      if (/^data-/.test(attr.name)) {
        var camelCaseName = attr.name.substr(5).replace(/-(.)/g, function ($0, $1) {
          return $1.toUpperCase();
        });
        data[camelCaseName] = attr.value;
      }
    });
    return data;
  }

  function getNames(name) {
    if (typeof name === 'string' && name.indexOf('.') >= 0) {
      return name.split('.', 2);
    }
    else {
      return [ '', name ]
    }
  }

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
