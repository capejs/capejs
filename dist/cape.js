(function(global) {
  "use strict";

  // MarkupBuilder
  //
  // public properties:
  //   component: the component that this builder works for.
  // private properties:
  //   _: the object that holds internal properties of this class.
  var MarkupBuilder = function MarkupBuilder(component, formName) {
    this._ = new _Internal(this);
    this.component = component;
    this._.formName = formName;
  };

  $.extend(MarkupBuilder.prototype, {
    markup: function(callback) {
      var root = this.component.root, formName, builder, attributes;

      if (typeof callback !== 'function')
        throw new Error("The first agument must be a function.");
      if (callback.length === 0)
        throw new Error("Callback requires an argument.");
      if (root.tagName == 'form') formName = root.attributes.name;
      builder = new MarkupBuilder(this.component, formName);
      callback.call(this.component, builder);

      attributes = {};
      for (var i = root.attributes.length; i--;)
        attributes[root.attributes[i].nodeName] = root.attributes[i].value;
      return this._.h(root.tagName, attributes, builder._.elements);
    },
    elem: function(tagName) {
      var args, options, content, callback, builder, attributes;

      args = Array.prototype.slice.call(arguments, 1);
      content = this._.extractContent(args);
      options = this._.extractOptions(args);
      callback = this._.extractCallback(args);

      if (callback) {
        builder = new MarkupBuilder(this.component, this._.formName);
        if (callback.length === 0) { throw new Error("Callback requires an argument.") }
        callback.call(this.component, builder);
        attributes = this._.generateAttributes.call(this, options);
        this._.elements.push(this._.h(tagName, attributes, builder._.elements));
      }
      else {
        content = content || '';
        attributes = this._.generateAttributes.call(this, options);
        this._.elements.push(this._.h(tagName, attributes, content));
      }
      return this;
    },
    text: function(content) {
      this._.elements.push(content);
      return this;
    },
    space: function() {
      this._.elements.push(' ');
      return this;
    },
    form: function() {
      var args, options, callback, name, builder, attributes;

      args = Array.prototype.slice.call(arguments);
      options = this._.extractOptions(args) || {};
      callback = this._.extractCallback(args);

      if (typeof callback !== 'function')
        throw new Error("One of arguments must be a function.");
      if (callback.length === 0)
        throw new Error("Callback requires an argument.");
      name = options.name || '';
      builder = new MarkupBuilder(this.component, name);
      callback.call(this.component, builder);
      options = options || {};
      if (options.onsubmit === undefined) {
        options.onsubmit = function(e) { return false };
      }
      attributes = this._.generateAttributes.call(this, options);
      this._.elements.push(this._.h('form', attributes, builder._.elements));
      return this;
    },
    labelFor: function(id, content, options) {
      options = options || {};
      options.htmlFor = id;
      this.elem('label', content, options)
      return this;
    },
    input: function(options) {
      var form, name, value, attributes;

      options = options || {};
      name = options.name;
      value = options.value;
      if (value === undefined && name !== undefined && this._.formName !== undefined)
        options.value = this.component.val(this._.formName + '.' + name);
      attributes = this._.generateAttributes.call(this, options);
      this._.elements.push(this._.h('input', attributes));
      return this;
    },
    hiddenField: function(name, options) {
      options = options || {};
      options.type = 'hidden';
      options.name = name;
      this.input(options);
      return this;
    },
    textField: function(name, options) {
      options = options || {};
      options.type = 'text';
      options.name = name;
      this.input(options);
      return this;
    },
    textarea: function(name, options) {
      var value = this.component.val(this._.formName + '.' + name);
      options.name = name;
      this.elem('textarea', value, options);
      return this;
    },
    checkBox: function(attrName, options) {
      var value, checked;

      value = this.component.val(this._.formName + '.' + attrName);
      checked = (value === true || value === '1');

      options = options || {};
      options.type = 'checkbox';
      if (attrName) options.name = attrName;
      if (checked) options.checked = 'checked';
      if (!options.value) options.value = '1';
      this.input($.extend({}, options, { type: 'hidden', value: '0' }));
      this.input(options);
      return this;
    },
    radioButton: function(attrName, options) {
      var value = this.component.val(this._.formName + '.' + attrName);

      options = options || {};
      options.type = 'radio';
      if (attrName) options.name = attrName;
      if (options.value === value) options.checked = 'checked';
      this.input(options);
      return this;
    },
    faIcon: function(iconName, options) {
      options = options || {};
      var htmlClass = options.class || options.className;
      if (htmlClass) {
        htmlClass = htmlClass + ' fa fa-' + iconName;
      }
      else {
        htmlClass = 'fa fa-' + iconName;
      }
      options.class = htmlClass;
      this.i('', options);
      return this;
    }
  });

  var _Internal = function _Internal(main) {
    this.main = main;
    this.h = virtualDom.h;
    this.elements = [];
  }

  // Internal (private) methods
  $.extend(_Internal.prototype, {
    extractContent: function(args) {
      if (typeof args[0] === 'string') return args[0];
    },

    extractOptions: function(args) {
      for (var i = 0; i < args.length; i++)
        if (typeof args[i] === 'object') return args[i];
    },

    extractCallback: function(args) {
      for (var i = 0; i < args.length; i++)
        if (typeof args[i] === 'function') return args[i];
    },

    generateAttributes: function(options) {
      options = options || {};
      if ('visible' in options && !options['visible']) {
        options['style'] = options['style'] || {};
        options['style']['display'] = 'none';
      }
      if ('class' in options) {
        options['className'] = options['class'];
        delete options['class'];
      }
      if ('for' in options) {
        options['htmlFor'] = options['for'];
        delete options['for'];
      }
      if (typeof options['className'] === 'object') {
        var names = []
        for (var name in options['className']) {
          if (options['className'][name]) {
            names.push(name)
          }
        }
        if (names.length) {
          options['className'] = names.join(' ')
        }
        else {
          delete options['className'];
        }
      }
      for (var key in options) {
        if (typeof options[key] === 'function') {
          options[key] = options[key].bind(this.component)
        }
      }
      return options;
    }
  });

  var normalElementNames = [
    'a', 'abbr', 'address', 'article', 'aside', 'audio', 'b', 'bdi', 'bdo',
    'blockquote', 'body', 'button', 'canvas', 'caption', 'cite', 'code',
    'colgroup', 'datalist', 'dd', 'del', 'details', 'dfn', 'dialog', 'div',
    'dl', 'dt', 'em', 'embed', 'fieldset', 'figcaption', 'figure', 'footer',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'html',
    'i', 'iframe', 'ins', 'kbd', 'label', 'legend', 'li', 'main', 'map', 'mark',
    'menu', 'menuitem', 'meter', 'nav', 'noscript', 'object', 'ol', 'optgroup',
    'option', 'output', 'p', 'pre', 'progress', 'q', 'rp', 'rt', 'ruby', 's',
    'samp', 'script', 'section', 'select', 'small', 'span', 'strong', 'style',
    'sub', 'summary', 'sup', 'table', 'tbody', 'td', 'tfoot',
    'th', 'thead', 'time', 'title', 'tr', 'u', 'ul', 'var', 'video' ];

  for (var i = normalElementNames.length; i--;) {
    var tagName = normalElementNames[i];
    MarkupBuilder.prototype[tagName] = new Function("arg1", "arg2",
      "this.elem('" + tagName + "', arg1, arg2); return this");
  }

  var voidElementNames = [
    'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'keygen',
    'link', 'menuitem', 'meta', 'param', 'source', 'track', 'wbr'
  ]

  for (var i = voidElementNames.length; i--;) {
    var tagName = voidElementNames[i];
    MarkupBuilder.prototype[tagName] = new Function("options",
      "this.elem('" + tagName + "', options); return this");
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
  global.Cape.MarkupBuilder = MarkupBuilder;

})((this || 0).self || global);

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
      return (new global.Cape.MarkupBuilder(this)).markup(callback);
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

(function(global) {
  "use strict";

  // DataStore
  //
  // public properties:
  // private properties:
  //   _: the object that holds internal properties of this class.
  var DataStore = function DataStore() {
    this._ = new _Internal(this);
  };

  DataStore.create = function() {
    if (!this.instance) this.instance = new(this);
    return this.instance;
  }

  $.extend(DataStore.prototype, {
    attach: function(component) {
      var target = component;
      for (var i = 0, len = this._.components.length; i < len; i++) {
        if (this._.components[i] === component) return;
      }
      this._.components.push(component);
      this.refresh();
    },
    detach: function(component) {
      for (var i = 0, len = this._.components.length; i < len; i++) {
        if (this._.components[i] === component) {
          this._.components.splice(i, 1);
          break;
        }
      }
    },
    trigger: function() {
      for (var i = this._.components.length; i--;)
        this._.components[i].refresh();
    },
    refresh: function() {}
  });

  // Internal class of DataStore
  var _Internal = function _Internal(main) {
    this.main = main;
    this.components = [];
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
  global.Cape.DataStore = DataStore;

})((this || 0).self || global);

(function() {
  "use strict";

  if (!window) return;

  var Router = function Router() {
    this.components = [];
    this.currentHash = null;
    this.params = {};
    this.refresh();
  };

  $.extend(Router.prototype, {
    attach: function(component) {
      var target = component;
      for (var i = 0, len = this.components.length; i < len; i++) {
        if (this.components[i] === component) return;
      }
      this.components.push(component);
      this.refresh();
    },
    detach: function(component) {
      for (var i = 0, len = this.components.length; i < len; i++) {
        if (this.components[i] === component) {
          this.handlers.splice(i, 1);
          break;
        }
      }
    },
    trigger: function(eventType) {
      var hash;

      hash = window.location.href.split('#')[1] || '';
      if (hash !== this.currentHash) {
        this.currentHash = hash;
        this.refresh();
        for (var i = this.components.length; i--;)
          this.components[i].refresh(this.params);
      }
    },
    navigate: function(hash) {
      window.location.hash = hash;
      this.trigger();
    },
    refresh: function() {
      var hash, ary;

      hash = window.location.href.split('#')[1] || '';
      ary = hash.split('/');
      this.params.collection = ary[0];
      this.params.id = ary[1];
      this.params.action = ary[2];
    }
  });

  function trigger() {
    window.Cape.router.trigger()
  }

  if (!window.Cape) {
    var Cape = {};
    window.Cape = Cape;
  }
  if (!window.CapeJS) {
    window.CapeJS = window.Cape;
  }
  window.Cape.Router = Router;
  window.Cape.router = new Router();
  window.Cape.navigate = function(hash) { window.Cape.router.navigate(hash) }

  if (window.addEventListener)
    window.addEventListener('hashchange', trigger, false)
  else
    window.attachEvent('onhashchange', trigger)
})((this || 0).self || window);
