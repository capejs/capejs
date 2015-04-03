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
      var options, content, callback, vb;

      if (typeof arguments[1] === 'string') {
        content = arguments[1];
        options = arguments[2] || {};
        attributes = generateAttributes(options);
        this.elements.push(this.h(tagName, attributes, content));
      }
      else {
        if (typeof arguments[1] === 'object') {
          options = arguments[1];
          callback = arguments[2];
        }
        else {
          options = {};
          callback = arguments[1];
        }
        if (typeof callback === 'function') {
          var vb = new VdomBuilder(this.component, this.formId);
          if (callback.length === 0) { throw new Error("Callback requires an argument.") }
          callback.call(this.component, vb);
          attributes = generateAttributes(options);
          this.elements.push(this.h(tagName, attributes, vb.elements));
        }
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
      var vb, attributes;

      if (callback.length === 0) { throw new Error("Callback requires an argument.") }
      if (!this.component.forms[name]) this.component.forms[name] = {};
      vb = new VdomBuilder(this.component, name);
      callback.call(this.component, vb);
      options = options || {};
      options['name'] = name;
      if (options['onsubmit'] === undefined) {
        options['onsubmit'] = function(e) { return false };
      }
      attributes = generateAttributes(options);
      this.elements.push(this.h('form', attributes, vb.elements));
    },
    input: function(options) {
      var form, name, value;

      options = options || {};
      name = options['name'];
      value = options['value'];
      if (value === undefined && name !== undefined && this.formId !== undefined) {
        form = this.component.forms[this.formId];
        if (form !== undefined && form[name] !== undefined)
          options['value'] = form[name];
      }
      attributes = generateAttributes(options);
      this.elements.push(this.h('input', attributes));
    },
    textField: function(name, options) {
      var self = this;

      options = options || {};
      options['type'] = 'text';
      options['name'] = name;
      if (options['onkeyup'] === undefined)
        options['onkeyup'] = function(e) {
          self.component.forms[self.formId][name] = e.target.value;
          self.component.refresh();
        };
      this.input(options);
    },
    checkBox: function(name, checked, options) {
      options = options || {};
      options['type'] = 'checkbox';
      if (name) options['name'] = name;
      if (checked) options['checked'] = 'checked';
      this.input(options);
    },
    value: function(name) {
      var form;

      if (name !== undefined && this.formId !== undefined) {
        form = this.component.forms[this.formId];
        if (form !== undefined) return form[name];
      }
    }
  });

  function generateAttributes(options) {
    if ('visible' in options && !options['visible']) {
      options['style'] = options['style'] || {};
      options['style']['display'] = 'none';
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

  if ("process" in global) module.exports = VdomBuilder;
  global.VdomBuilder = VdomBuilder;

})((this || 0).self || global);

