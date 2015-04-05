(function(global) {
  "use strict;"

  var VdomBuilder = function VdomBuilder(component, formId) {
    this.component = component;
    this.formId = formId;
    this.h = virtualDom.h;
    this.elements = [];
  };

  $.extend(VdomBuilder.prototype, {
    markup: function(tagName, arg1, arg2) {
      this.contentTag(tagName, arg1, arg2);
      return this.elements[0];
    },
    contentTag: function(tagName) {
      var args, options, content, callback, builder;

      args = Array.prototype.slice.call(arguments, 1);
      content = extractContent(args);
      options = extractOptions(args);
      callback = extractCallback(args);

      if (callback) {
        builder = new VdomBuilder(this.component, this.formId);
        if (callback.length === 0) { throw new Error("Callback requires an argument.") }
        callback.call(this.component, builder);
        attributes = generateAttributes(options);
        this.elements.push(this.h(tagName, attributes, builder.elements));
      }
      else {
        content = content || '';
        attributes = generateAttributes(options);
        this.elements.push(this.h(tagName, attributes, content));
      }
    },
    tag: function(tagName, options) {
      attributes = generateAttributes(options);
      this.elements.push(this.h(tagName, attributes));
    },
    text: function(content) {
      this.elements.push(content);
    },
    space: function() {
      this.elements.push(' ');
    },
    form: function(name, options, callback) {
      var builder, attributes;

      if (callback.length === 0) { throw new Error("Callback requires an argument.") }
      builder = new VdomBuilder(this.component, name);
      callback.call(this.component, builder);
      options = options || {};
      options['name'] = name;
      if (options['onsubmit'] === undefined) {
        options['onsubmit'] = function(e) { return false };
      }
      attributes = generateAttributes(options);
      this.elements.push(this.h('form', attributes, builder.elements));
    },
    labelFor: function(id, content, options) {
      options = options || {};
      options['htmlFor'] = id;
      this.contentTag('label', content, options)
    },
    input: function(options) {
      var form, name, value;

      options = options || {};
      name = options['name'];
      value = options['value'];
      if (value === undefined && name !== undefined && this.formId !== undefined)
        options['value'] = this.component.getValue(this.formId, name);
      attributes = generateAttributes(options);
      this.elements.push(this.h('input', attributes));
    },
    textField: function(name, options) {
      var self = this;

      options = options || {};
      options['type'] = 'text';
      options['name'] = name;
      this.input(options);
    },
    checkBox: function(name, options) {
      var checked = this.component.getValue(this.formId, name);

      options = options || {};
      options['type'] = 'checkbox';
      if (name) options['name'] = name;
      if (checked) options['checked'] = 'checked';
      if (!options['value']) options['value'] = '1';
      this.input(options);
    },
    value: function(name) {
      this.component.getValue(this.formId, name);
    }
  });

  function extractContent(args) {
    if (typeof args[0] === 'string') return args[0];
  }

  function extractOptions(args) {
    for (var i = 0; i < args.length; i++)
      if (typeof args[i] === 'object') return args[i];
  }

  function extractCallback(args) {
    for (var i = 0; i < args.length; i++)
      if (typeof args[i] === 'function') return args[i];
  }

  function generateAttributes(options) {
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
    return options;
  }

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
    'sub', 'summary', 'sup', 'table', 'tbody', 'td', 'textarea', 'tfoot',
    'th', 'thead', 'time', 'title', 'tr', 'u', 'ul', 'var', 'video' ];

  for (var i = 0; i < normalElementNames.length; i++) {
    var tagName = normalElementNames[i];
    VdomBuilder.prototype[tagName] = new Function("arg1", "arg2",
      "this.contentTag('" + tagName + "', arg1, arg2)");
  }

  var voidElementNames = [
    'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'keygen',
    'link', 'menuitem', 'meta', 'param', 'source', 'track', 'wbr'
  ]

  for (var i = 0; i < voidElementNames.length; i++) {
    var tagName = voidElementNames[i];
    VdomBuilder.prototype[tagName] = new Function("options",
      "this.tag('" + tagName + "', options)");
  }

  if (!global.CapeJS) {
    var CapeJS = {};
    if ("process" in global) module.exports = CapeJS;
    global.CapeJS = CapeJS;
  }
  global.CapeJS.VdomBuilder = VdomBuilder;

})((this || 0).self || global);

(function(global) {
  "use strict;"

  var DataStore = function DataStore() {};

  $.extend(DataStore.prototype, {
    on: function(eventType, callback) {
      if (!this.handlers) this.handlers = {};
      if (!this.handlers[eventType]) this.handlers[eventType] = [];
      this.handlers[eventType].push(callback);
    },
    trigger: function(eventType) {
      var i;
      if (!this.handlers || !this.handlers[eventType]) return;
      for (i = 0; i < this.handlers[eventType].length; i++)
        this.handlers[eventType][i].call(this, eventType);
    }
  });

  if (!global.CapeJS) {
    var CapeJS = {};
    if ("process" in global) module.exports = CapeJS;
    global.CapeJS = CapeJS;
  }
  global.CapeJS.DataStore = DataStore;

})((this || 0).self || global);

(function(global) {
  "use strict;"

  var Component = function Component() {
    this.forms = {};
  };

  $.extend(Component.prototype, {
    mount: function(id) {
      this.root = document.getElementById(id);
      this.init();
      this.forms = {};
      this.tree = this.render();
      this.rootNode = virtualDom.create(this.tree);
      this.root.appendChild(this.rootNode);
      serializeForms(this);
    },
    init: function() {},
    refresh: function() {
      var newTree, patches;

      serializeForms(this);
      newTree = this.render();
      patches = virtualDom.diff(this.tree, newTree);
      this.rootNode = virtualDom.patch(this.rootNode, patches);
      this.tree = newTree;
    },
    getValue: function(formName, attrName) {
      var form = this.forms[formName];
      if (form) return form[attrName];
      else return {};
    },
    setValue: function(formName, attrName, value) {
      if (!this.virtualForms[formName]) this.virtualForms[formName] = {};
      this.virtualForms[formName][attrName] = value;
    }
  });

  function serializeForms(component) {
    component.forms = {};
    $(component.rootNode).find('form').each(function(i) {
      var obj = {}, ary;

      $.each($(this).serializeArray(), function() {
        obj[this.name] = this.value || '';
      });

      if ($(this).attr('name')) {
        component.forms[$(this).attr('name')] = obj;
      }
    });
    $.extend(true, component.forms, component.virtualForms);
    component.virtualForms = {};
  }

  if (!global.CapeJS) {
    var CapeJS = {};
    if ("process" in global) module.exports = CapeJS;
    global.CapeJS = CapeJS;
  }
  global.CapeJS.Component = Component;

})((this || 0).self || global);
