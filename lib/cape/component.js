(function(global) {
  "use strict";

  // Cape.Component
  //
  // public properties:
  //   root: the root node which this component is mounted on.
  // private properties:
  //   _: the object that holds internal methods and properties of this class.
  var Component = function Component() {
    this._ = new _Internal(this);
  };

  $.extend(Component.prototype, {
    mount: function(id) {
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
        $.extend(true, this._.forms, this._.virtualForms);

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
        var key = form.name || '';
        var vform = this._.virtualForms[key];
        if (!vform) continue;
        Object.keys(vform).forEach(function(k) {
          if (form[k]) {
            if (form[k].constructor.name === 'RadioNodeList') {
              if (form[k][form[k].length - 1].type === 'checkbox') {
                form[k][form[k].length - 1].checked = vform[k]
              }
              else {
                form[k].value = vform[k]
              }
            }
            else {
              form[k].value = vform[k]
            }
          }
        })
      }

      this._.virtualForms = {};
      this._.serialized = false;
    },
    val: function(name, value) {
      if (arguments.length === 1) return this._.getValue(name);
      else this._.setValue(name, value);
    },
    formData: function(formName) {
      this._.serializeForms();
      if (formName === undefined) formName = '';
      return this._.forms[formName] || {};
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
  $.extend(_Internal.prototype, {
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
          var segments = this.name.split('/');
          var lastSegment = segments.pop();
          var o = obj;
          segments.forEach(function(segment) {
            if (!o[segment]) o[segment] = {};
            o = o[segment];
          })
          o[lastSegment] = this.value || '';
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
    var klass = function() { this._ = new _Internal(this); };
    $.extend(klass.prototype, global.Cape.Component.prototype, methods);
    return klass;
  }

})((this || 0).self || global);
