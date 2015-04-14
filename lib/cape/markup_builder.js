(function(global) {
  "use strict";

  // Cape.MarkupBuilder
  //
  // public properties:
  //   component: the component that this builder works for.
  // private properties:
  //   _: the object that holds internal methods and properties of this class.
  var MarkupBuilder = function MarkupBuilder(component, options) {
    this._ = new _Internal(this);
    this.component = component;
    if (options){
      this._.formName = options.formName;
      this._.selectBoxName = options.selectBoxName;
      this._.fieldNamePrefix = options.fieldNamePrefix;
    }
  };

  $.extend(MarkupBuilder.prototype, {
    markup: function(callback) {
      var root = this.component.root, formName, builder, attributes;

      if (typeof callback !== 'function')
        throw new Error("The first agument must be a function.");
      if (callback.length === 0)
        throw new Error("Callback requires an argument.");
      if (root.tagName == 'form') formName = root.attributes.name;
      builder = new MarkupBuilder(this.component, { formName: formName } );
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
        builder = new MarkupBuilder(this.component,
          { formName: this._.formName,
            selectBoxName: this._.selectBoxName,
            fieldNamePrefix: this._.fieldNamePrefix });
        if (callback.length === 0) { throw new Error("Callback requires an argument.") }
        callback.call(this.component, builder);
        attributes = this._.generateAttributes(options);
        this._.elements.push(this._.h(tagName, attributes, builder._.elements));
      }
      else {
        content = content || '';
        attributes = this._.generateAttributes(options);
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
      builder = new MarkupBuilder(this.component, { formName: name });
      callback.call(this.component, builder);
      options = options || {};
      if (options.onsubmit === undefined) {
        options.onsubmit = function(e) { return false };
      }
      attributes = this._.generateAttributes(options);
      this._.elements.push(this._.h('form', attributes, builder._.elements));
      return this;
    },
    fieldsFor: function(name) {
      var args, options, callback, prefix, builder;

      args = Array.prototype.slice.call(arguments, 1);
      options = this._.extractOptions(args) || {};
      callback = this._.extractCallback(args);

      if (typeof callback !== 'function')
        throw new Error("One of arguments must be a function.");
      if (callback.length === 0)
        throw new Error("Callback requires an argument.");

      if (this._.fieldNamePrefix !== undefined)
        prefix = this._.fieldNamePrefix + '/' + name;
      else
        prefix = name
      if (options.index !== undefined)
        prefix = prefix + '/' + String(options.index);

      builder = new MarkupBuilder(this.component,
        { formName: this._.formName, fieldNamePrefix: prefix });
      callback.call(this.component, builder);
      builder._.elements.forEach(function(elem) {
        this._.elements.push(elem);
      }.bind(this));

      return this;
    },
    labelFor: function(id, content, options) {
      options = options || {};
      options.htmlFor = id;
      this.elem('label', content, options)
      return this;
    },
    input: function(options) {
      var attributes;

      options = options || {};

      if (options.name && this._.fieldNamePrefix)
        options.name = this._.fieldNamePrefix + '/' + options.name

      attributes = this._.generateAttributes(options);
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
    textareaField: function(attrName, options) {
      if (attrName && this._.fieldNamePrefix)
        attrName = this._.fieldNamePrefix + '/' + attrName
      options = options || {};
      options.name = attrName;
      this.elem('textarea', '', options);
      return this;
    },
    checkBox: function(attrName, options) {
      options = options || {};
      options.type = 'checkbox';
      if (attrName) options.name = attrName;
      if (!options.value) options.value = '1';
      this.input($.extend({}, options, { type: 'hidden', value: '0' }));
      this.input(options);
      return this;
    },
    radioButton: function(attrName, value, options) {
      options = options || {};
      options.type = 'radio';
      options.value = value;
      if (attrName) options.name = attrName;
      this.input(options);
      return this;
    },
    selectBox: function(name) {
      var args, options, callback, builder, attributes;

      args = Array.prototype.slice.call(arguments, 1);
      options = this._.extractOptions(args) || {};
      callback = this._.extractCallback(args);

      if (typeof callback !== 'function')
        throw new Error("One of arguments must be a function.");
      if (callback.length === 0)
        throw new Error("Callback requires an argument.");

      if (name && this._.fieldNamePrefix)
        options.name = this._.fieldNamePrefix + '/' + name;
      else
        options.name = name;

      builder = new MarkupBuilder(this.component,
        { formName: this._.formName, selectBoxName: name });
      callback.call(this.component, builder);
      options = options || {};
      attributes = this._.generateAttributes(options);
      this._.elements.push(this._.h('select', attributes, builder._.elements));
      return this;
    },
    attr: function(name, value) {
      this._.attr[name] = value;
      return this;
    },
    class: function(name) {
      this._.classNames.push(name);
      return this;
    },
    data: function(name, value) {
      this._.data[name] = value;
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
    this.classNames = [];
    this.attr = {};
    this.data = {};
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
      var classNames, data;

      options = options || {};
      options = $.extend({}, this.attr, options);
      this.attr = {};

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

      classNames = this.classNames.slice(0);
      this.classNames = [];
      if (typeof options['className'] === 'object') {
        for (var name in options['className']) {
          if (options['className'][name]) {
            classNames.push(name)
          }
        }
      }
      else if (typeof options['className'] === 'string') {
        options['className'].split(' ').forEach(function(e) {
          classNames.push(e);
        })
      }

      if (classNames.length) {
        classNames = classNames.filter(function(e, i, self) {
          return self.indexOf(e) === i;
        })
        options['className'] = classNames.join(' ')
      }
      else {
        delete options['className'];
      }

      if ('data' in options) {
        options['dataset'] = options['data'];
        delete options['data'];
      }
      data = options.dataset || {};
      data = $.extend({}, this.data, data);
      this.data = {};
      options.dataset = data;

      for (var key in options) {
        if (typeof options[key] === 'function') {
          options[key] = options[key].bind(this.main.component)
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
    'sub', 'summary', 'sup', 'table', 'tbody', 'td', 'textarea', 'tfoot',
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
