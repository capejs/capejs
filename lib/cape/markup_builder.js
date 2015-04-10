(function(global) {
  "use strict";

  // Cape.MarkupBuilder
  //
  // public properties:
  //   component: the component that this builder works for.
  // private properties:
  //   _: the object that holds internal methods and properties of this class.
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
    fa: function(iconName, options) {
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

  // Internal properties of Cape.MarkupBuilder
  var _Internal = function _Internal(main) {
    this.main = main;
    this.h = virtualDom.h;
    this.elements = [];
  }

  // Internal methods of Cape.MarkupBuilder
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
    'area', 'base', 'br', 'col', 'data', 'embed', 'hr', 'img', 'keygen',
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
