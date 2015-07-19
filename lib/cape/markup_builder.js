'use strict';

var virtualDom = require('virtual-dom');
var Inflector = require('inflected');
var Cape = require('./utilities');

// Cape.MarkupBuilder
//
// public properties:
//   component: the component that this builder works for.
//   formName: current form name.
//   selectBoxName: current select box name.
//   fieldNamePrefix: current field name prefix.
// private properties:
//   _: the object that holds internal methods and properties of this class.
var MarkupBuilder = function MarkupBuilder(component, options) {
  this._ = new _Internal(this);
  this.component = component;
  if (options) {
    this.formName = options.formName;
    this.selectBoxName = options.selectBoxName;
    this.fieldNamePrefix = options.fieldNamePrefix;
  }
};

Cape.extend(MarkupBuilder.prototype, {
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
        { formName: this.formName,
          selectBoxName: this.selectBoxName,
          fieldNamePrefix: this.fieldNamePrefix });
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
  sp: function() {
    this.space();
    return this;
  },
  formFor: function(name) {
    var args, options, callback, name, builder, attributes;

    args = Array.prototype.slice.call(arguments);
    options = this._.extractOptions(args) || {};
    callback = this._.extractCallback(args);

    if (typeof callback !== 'function')
      throw new Error("One of arguments must be a function.");
    if (callback.length === 0)
      throw new Error("Callback requires an argument.");

    builder = new MarkupBuilder(this.component, { formName: name });
    callback.call(this.component, builder);
    options = options || {};
    options.name = name;
    if (options.onsubmit === undefined && this._.eventCallbacks.onsubmit === undefined) {
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

    if (this.fieldNamePrefix !== undefined)
      prefix = this.fieldNamePrefix + '/' + name;
    else
      prefix = name
    if (options.index !== undefined)
      prefix = prefix + '/' + String(options.index);

    builder = new MarkupBuilder(this.component,
      { formName: this.formName, fieldNamePrefix: prefix });
    callback.call(this.component, builder);
    builder._.elements.forEach(function(elem) {
      this._.elements.push(elem);
    }.bind(this));

    return this;
  },
  labelFor: function(name, content, options) {
    var fieldName;

    options = options || {};
    options.htmlFor = this._.elementIdFor(name);
    this.elem('label', content, options)
    return this;
  },
  hiddenField: function(name, options) {
    options = options || {};
    options.type = 'hidden';
    options.name = name;
    this._.inputField(options);
    return this;
  },
  textField: function(name, options) {
    options = options || {};
    options.type = options.type || 'text';
    options.name = name;
    this._.inputField(options);
    return this;
  },
  passwordField: function(name, options) {
    options = options || {};
    options.type = 'password';
    options.name = name;
    this._.inputField(options);
    return this;
  },
  textareaField: function(attrName, options) {
    var formName, vform, dasherized;

    if (attrName && this.fieldNamePrefix)
      attrName = this.fieldNamePrefix + '/' + attrName
    options = options || {};
    options.name = attrName;

    formName = this.formName || '';
    this.component.virtualForms.update(formName, options);

    dasherized = Inflector.dasherize(attrName.replace(/\//g, '_'));
    if (!options.id) {
      if (this.formName)
        options.id = this.formName + '-field-' + dasherized;
      else
        options.id = 'field-' + dasherized;
    }
    this.elem('textarea', '', options);
    return this;
  },
  checkBox: function(attrName, options) {
    var fieldName;

    options = options || {};
    options.type = 'checkbox';
    if (attrName) options.name = attrName;
    if (!options.value) options.value = '1';

    if (options.name && this.fieldNamePrefix)
      fieldName = this.fieldNamePrefix + '/' + options.name
    else
      fieldName = options.name

    if (attrName.slice(-2) !== '[]') {
      this._.elements.push(
        this._.h('input', global.Cape.extend({},
          { name: fieldName, type: 'hidden', value: '0' })));
    }
    this._.inputField(options);
    return this;
  },
  radioButton: function(attrName, value, options) {
    options = options || {};
    options.type = 'radio';
    options.value = value;
    if (attrName) options.name = attrName;
    this._.inputField(options);
    return this;
  },
  selectBox: function(name) {
    var args, options, callback, builder, attributes, dasherized, formName;

    args = Array.prototype.slice.call(arguments, 1);
    options = this._.extractOptions(args) || {};
    callback = this._.extractCallback(args);

    if (typeof callback !== 'function')
      throw new Error("One of arguments must be a function.");
    if (callback.length === 0)
      throw new Error("Callback requires an argument.");

    if (name && this.fieldNamePrefix)
      options.name = this.fieldNamePrefix + '/' + name;
    else
      options.name = name;

    options.id = options.id || this._.elementIdFor(name);

    builder = new MarkupBuilder(this.component,
      { formName: this.formName, selectBoxName: name });
    callback.call(this.component, builder);
    options = options || {};
    attributes = this._.generateAttributes(options);

    formName = this.formName || '';
    this.component.virtualForms.update(
      formName, { name: name, value: options.value });

    this._.elements.push(this._.h('select', attributes, builder._.elements));
    return this;
  },
  btn: function() {
    var args, options, content, callback;

    args = Array.prototype.slice.call(arguments);
    content = this._.extractContent(args);
    options = this._.extractOptions(args) || {};
    callback = this._.extractCallback(args);

    options.type = options.type || 'button';
    this.elem('button', content, options, callback);
    return this;
  },
  attr: function(name, value) {
    if (typeof name === 'object')
      Cape.extend(this._.attr, name)
    else if (typeof name === 'string')
      this._.attr[name] = value;

    return this;
  },
  class: function(name) {
    if (typeof name === 'object')
      Cape.extend(this._.classNames, name)
    else if (typeof name === 'string')
      this._.classNames[name] = true;
    return this;
  },
  data: function(name, value) {
    if (typeof name === 'object')
      Cape.extend(this._.data, name)
    else if (typeof name === 'string')
      this._.data[name] = value;
    return this;
  },
  css: function(name, value) {
    if (typeof name === 'object')
      Cape.extend(this._.style, name)
    else if (typeof name === 'string')
      this._.style[name] = value;

    return this;
  },
  on: function(eventName, callback) {
    if (typeof eventName === 'string')
      this._.eventCallbacks['on' + eventName] = callback
    else
      throw new Error("The first agument must be a string.");
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
  this.classNames = {};
  this.attr = {};
  this.data = {};
  this.style = {};
  this.eventCallbacks = {};
}

// Internal methods of Cape.MarkupBuilder
Cape.extend(_Internal.prototype, {
  inputField: function(options) {
    var attributes, dasherized, formName, vform;

    options = options || {};

    if (options.id === undefined) {
      options.id = this.elementIdFor(options.name);
      if (options.type === 'radio')
        options.id = options.id + '-' + String(options.value);
    }
    if (options.id === null) delete options.id;
    if (options.name && this.main.fieldNamePrefix)
      options.name = this.main.fieldNamePrefix + '/' + options.name;

    formName = this.main.formName || '';
    this.main.component.virtualForms.update(formName, options);

    attributes = this.generateAttributes(options);
    this.elements.push(this.h('input', attributes));
    return this;
  },

  elementIdFor: function(name) {
    var dasherized;

    if (this.main.fieldNamePrefix)
      dasherized = Inflector.dasherize(
        this.main.fieldNamePrefix.replace(/\//g, '-') + '-' + name);
    else
      dasherized = Inflector.dasherize(name);

    if (this.main.formName)
      return this.main.formName + '-field-' + dasherized;
    else
      return 'field-' + dasherized;
  },

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
    options = global.Cape.extend({}, this.attr, options);
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

    classNames = []
    for (key in this.classNames)
      if (this.classNames.hasOwnProperty(key) && this.classNames[key])
        classNames.push(key)
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
    data = global.Cape.extend({}, this.data, data);
    this.data = {};
    options.dataset = data;

    if (typeof options.style === 'object')
      options.style = global.Cape.extend({}, this.style, options.style);
    else
      options.style = this.style
    this.style = {}

    Cape.merge(options, this.eventCallbacks);
    this.eventCallbacks = {};

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
  'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'html',
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
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'keygen',
  'link', 'menuitem', 'meta', 'param', 'source', 'track', 'wbr'
]

for (var i = voidElementNames.length; i--;) {
  var tagName = voidElementNames[i];
  MarkupBuilder.prototype[tagName] = new Function("options",
    "this.elem('" + tagName + "', options); return this");
}

var attrNames = [ 'checked', 'disabled' ];

for (var i = attrNames.length; i--;) {
  var attrName = attrNames[i];
  MarkupBuilder.prototype[attrName] = new Function("value",
    "this.attr('" + attrName + "', value); return this");
}

var eventNames = [
  'blur', 'focus', 'change', 'select', 'submit', 'reset', 'abort', 'error',
  'load', 'unload', 'click', 'dblclick', 'keyup', 'keydown', 'keypress',
  'mouseout', 'mouseover', 'mouseup', 'mousedown', 'mousemove'
]

for (var i = eventNames.length; i--;) {
  var eventName = eventNames[i];
  MarkupBuilder.prototype['on' + eventName] = new Function("callback",
    "this.on('" + eventName + "', callback); return this");
}

module.exports = MarkupBuilder;
