(function(global) {
  "use strict";

  if (!global.Cape) {
    var Cape = {};
    if ("process" in global) module.exports = Cape;
    global.Cape = Cape;
  }

  // Users may store arbitrary data to this hash.
  global.Cape.session = {};

  // Merge the properties of two or more objects together into the first object.
  global.Cape.extend = function() {
    var i, key;

    for(i = 1; i < arguments.length; i++)
      for(key in arguments[i])
        if(arguments[i].hasOwnProperty(key))
          arguments[0][key] = arguments[i][key];
    return arguments[0];
  }

  // Merge the properties of two or more objects together into the first object recursively.
  global.Cape.deepExtend = function() {
    var i, key;

    for(i = 1; i < arguments.length; i++)
      for(key in arguments[i])
        if(arguments[i].hasOwnProperty(key)) {
          if (typeof arguments[0][key] === 'object' && typeof arguments[i][key] === 'object')
            global.Cape.deepExtend(arguments[0][key], arguments[i][key]);
          else
            arguments[0][key] = arguments[i][key];
        }
    return arguments[0];
  }

})((this || 0).self || global);

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

  global.Cape.extend(MarkupBuilder.prototype, {
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
    hiddenField: function(name, options) {
      options = options || {};
      options.type = 'hidden';
      options.name = name;
      this._.inputField(options);
      return this;
    },
    textField: function(name, options) {
      options = options || {};
      options.type = 'text';
      options.name = name;
      this._.inputField(options);
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
      this._.inputField(global.Cape.extend({}, options, { type: 'hidden', value: '0' }));
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
  global.Cape.extend(_Internal.prototype, {
    inputField: function(options) {
      var attributes;

      options = options || {};

      if (options.name && this.fieldNamePrefix)
        options.name = this.fieldNamePrefix + '/' + options.name

      attributes = this.generateAttributes(options);
      this.elements.push(this.h('input', attributes));
      return this;
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
      data = global.Cape.extend({}, this.data, data);
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
    'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'keygen',
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

  // Cape.Component
  //
  // public properties:
  //   root: the root node which this component is mounted on.
  // private properties:
  //   _: the object that holds internal methods and properties of this class.
  var Component = function Component() {
    this._ = new _Internal(this);
  };

  global.Cape.extend(Component.prototype, {
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
      else return this._.setValue(name, value);
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
  global.Cape.extend(_Internal.prototype, {
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
        if (forms[i].name) {
          this.forms[forms[i].name] = obj;
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
    var klass = function() { Component.apply(this, arguments) };
    global.Cape.extend(klass.prototype, global.Cape.Component.prototype, methods);
    return klass;
  }

})((this || 0).self || global);

(function(global) {
  "use strict";

  // Cape.DataStore
  //
  // public properties:
  // private properties:
  //   _: the object that holds internal methods and properties of this class.
  var DataStore = function DataStore() {
    this._ = new _Internal(this);
  };

  DataStore.create = function() {
    if (!this.instance) this.instance = new(this);
    return this.instance;
  }

  global.Cape.extend(DataStore.prototype, {
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
    propagate: function() {
      for (var i = this._.components.length; i--;)
        this._.components[i].refresh();
    },
    refresh: function() {}
  });

  // Internal properties of Cape.DataStore
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

  global.Cape.createDataStoreClass = function(methods) {
    var klass = function() { DataStore.apply(this, arguments) };
    global.Cape.extend(klass.prototype, global.Cape.DataStore.prototype, methods);
    return klass;
  }
})((this || 0).self || global);

(function(global) {
  "use strict";

  // Cape.RoutingMapper
  function RoutingMapper(router, options) {
    this._ = new _Internal(this);
    this.router = router;
    if (options) {
      this.namespaceName = options.namespace;
      this.singular = options.singular;
      this.path = options.path;
      this.resourceName = options.resourceName;
      this.collectionName = options.collectionName;
      this.moduleName = options.module;
    }
  };

  global.Cape.extend(RoutingMapper.prototype, {
    match: function(path, componentName, constraints) {
      var route = {}, names;
      if (this.namespaceName) path = this.namespaceName + '/' + path;
      route.path = path;
      route.keys = this._.extractKeys(path);
      route.regexp = this._.constructRegexp(path, constraints);
      names = componentName.split(/#/);
      route.params = {};
      if (this.moduleName)
        route.params.collection = this.moduleName + '/' + names[0];
      else if (this.namespaceName)
        route.params.collection = this.namespaceName + '/' + names[0];
      else
        route.params.collection = names[0];
      route.params.action = names[1];
      this.router.routes.push(route);
    },
    resources: function(resourceName, options, callback) {
      var actions, path, pathName, mapper;

      options = options || {};
      options.pathNames = options.pathNames || {};

      actions = [ 'index', 'new', 'show', 'edit' ];
      this._.filterActions(actions, options);

      path = options.path || resourceName;
      if (this.path) {
        if (this.singular === true) {
          path = this.path + '/' + path
        }
        else {
          path = this.path + '/:' +
            Inflector.singularize(this.collectionName) + '_id/' + path
        }
      }

      if (actions.indexOf('index') != -1)
        this.match(path, resourceName + '#index');
      if (actions.indexOf('new') != -1) {
        pathName = options.pathNames.new ? options.pathNames.new : 'new';
        this.match(path + '/' + pathName, resourceName + '#new');
      }
      if (actions.indexOf('show') != -1)
        this.match(path + '/:id', resourceName + '#show',
          { id: '\\d+' });
      if (actions.indexOf('edit') != -1) {
        pathName = options.pathNames.edit ? options.pathNames.edit : 'edit';
        this.match(path + '/:id/' + pathName, resourceName + '#edit',
          { id: '\\d+' });
      }

      if (typeof callback == 'function') {
        if (callback.length === 0)
          throw new Error("Callback requires an argument.");
        mapper = new RoutingMapper(this.router,
          { path: path, resourceName: resourceName, collectionName: resourceName });
        callback(mapper);
      }
    },
    resource: function(resourceName, options, callback) {
      var actions, path, pathName, collectionName, mapper;

      options = options || {};
      options.pathNames = options.pathNames || {};

      actions = [ 'new', 'show', 'edit' ];
      this._.filterActions(actions, options);

      path = options.path || resourceName;
      if (this.path) {
        if (this.singular === true) {
          path = this.path + '/' + path
        }
        else {
          path = this.path + '/:' +
            Inflector.singularize(this.collectionName) + '_id/' + path
        }
      }

      collectionName = Inflector.pluralize(resourceName);

      if (actions.indexOf('show') != -1)
        this.match(path, collectionName + '#show');
      if (actions.indexOf('new') != -1) {
        pathName = options.pathNames.new ? options.pathNames.new : 'new';
        this.match(path + '/' + pathName, collectionName + '#new');
      }
      if (actions.indexOf('edit') != -1) {
        pathName = options.pathNames.edit ? options.pathNames.edit : 'edit';
        this.match(path + '/' + pathName, collectionName + '#edit');
      }

      if (typeof callback == 'function') {
        if (callback.length === 0)
          throw new Error("Callback requires an argument.");
        mapper = new RoutingMapper(this.router,
          { singular: true, path: path, resourceName: resourceName,
            collectionName: resourceName });
        callback(mapper);
      }
    },
    get: function() {
      var args, options;

      args = Array.prototype.slice.call(arguments, 0);
      if (typeof args[args.length - 1] === 'object')
        options = args.pop();
      else
        options = {}

      if (options.on === 'member') {
        args.forEach(function(actionName) {
          this.match(this.path + '/:id/' + actionName,
            this.resourceName + '#' + actionName, { id: '\\d+' });
        }.bind(this))
      }
      else if (options.on === 'new') {
        args.forEach(function(actionName) {
          this.match(this.path + '/new/' + actionName,
            this.resourceName + '#' + actionName);
        }.bind(this))
      }
      else {
        args.forEach(function(actionName) {
          this.match(this.path + '/' + actionName,
            this.resourceName + '#' + actionName);
        }.bind(this))
      }
    },
    namespace: function(path) {
      var args, callback, options, mapper;

      args = Array.prototype.slice.call(arguments, 1);
      callback = args.pop();
      options = args.pop() || {};
      if (typeof callback !== 'function')
        throw new Error("The last argument must be a function.");
      if (callback.length === 0)
        throw new Error("Callback requires an argument.");

      mapper = new RoutingMapper(this.router,
        { namespace: path, module: options.module });
      callback(mapper);
    }
  })

  // Internal properties of Cape.Component
  var _Internal = function _Internal(main) {
    this.main = main;
  }

  // Internal methods of Cape.Component
  global.Cape.extend(_Internal.prototype, {
    extractKeys: function(path) {
      var keys = [], md;

      path.split('/').forEach(function(fragment) {
        if (md = fragment.match(/^:(\w+)$/)) keys.push(md[1]);
      })
      return keys;
    },
    constructRegexp: function(path, constraints) {
      var fragments = [], md;

      constraints = constraints || {};
      path.split('/').forEach(function(fragment) {
        if (md = fragment.match(/^:(\w+)$/)) {
          if (constraints[md[1]])
            fragments.push('(' + constraints[md[1]] + ')')
          else
            fragments.push('([^/]+)');
        }
        else if (fragment.match(/^\w+$/)) {
          fragments.push(fragment);
        }
      })
      return new RegExp('^' + fragments.join('/') + '$');
    },
    filterActions: function(actions, options) {
      var idx;

      options = options || {};
      if (typeof options['only'] === 'string') {
        actions.length = 0;
        actions.push(options['only'])
      }
      if (Array.isArray(options['only'])) {
        actions.length = 0;
        options['only'].forEach(function(name) { actions.push(name) })
      }
      if (typeof options['except'] === 'string') {
        idx = actions.indexOf(options['except'])
        if (idx !== -1) actions.splice(idx, 1)
      }
      if (Array.isArray(options['except'])) {
        options['except'].forEach(function(name) {
          idx = actions.indexOf(name)
          if (idx !== -1) actions.splice(idx, 1)
        })
      }
    }
  })

  if (!global.Cape) {
    var Cape = {};
    if ("process" in global) module.exports = Cape;
    global.Cape = Cape;
  }
  global.Cape.RoutingMapper = RoutingMapper;
})((this || 0).self || window);

(function(global) {
  "use strict";

  if (!window) return;

  // Cape.Router
  //
  // public properties:
  //   routes: array of hashes that contains routing information.
  //   params: the parameters that are extracted from URL hash fragment.
  // private properties:
  //   _: the object that holds internal methods and properties of this class.
  var Router = function Router() {
    this._ = new _Internal(this);
    this.routes = [];
    this.params = {};
  };

  global.Cape.extend(Router.prototype, {
    draw: function(callback) {
      var mapper;

      if (typeof callback !== 'function')
        throw new Error("The last argument must be a function.");
      if (callback.length === 0)
        throw new Error("Callback requires an argument.");

      mapper = new window.Cape.RoutingMapper(this);
      callback(mapper);
    },
    mount: function(elementId) {
      this._.targetElementId = elementId;
    },
    start: function() {
      var self = this, callback;

      callback = function() {
        var hash = window.location.href.split('#')[1] || '';
        self.navigate(hash);
      };
      if (window.addEventListener)
        window.addEventListener('hashchange', callback, false);
      else
        window.attachEvent('onhashchange', callback);

      this.hash = window.location.href.split('#')[1] || '';
      this.navigate(this.hash);
    },
    routeFor: function(hash) {
      var i, len, route;

      for (i = 0, len = this.routes.length; i < len; i++) {
        route = this.routes[i];
        if (hash.match(route.regexp)) return route;
      }
      throw new Error("No route match. [" + hash + "]");
    },
    navigate: function(hash) {
      var i, len, route, md, componentClassName, componentClass, component;

      this.hash = hash;
      for (i = 0, len = this._.beforeActionCallbacks.length; i < len; i++) {
        this._.beforeActionCallbacks[i].call(this);
      }

      this._.setHash(this.hash);

      route = this.routeFor(this.hash);
      md = hash.match(route.regexp);
      this.params = global.Cape.extend({}, route.params);
      route.keys.forEach(function(key, j) {
        this.params[key] = md[j + 1];
      }.bind(this));

      componentClassName =
        Inflector.camelize(route.params.collection.replace(/\//g, '_')) +
        Inflector.camelize(route.params.action);
      componentClass = window[componentClassName];
      if (!componentClass)
        throw new Error("Class not found.[" + collection + action + "]");

      if (componentClass === this._.mountedComponentClass) {
        this._.notify();
      }
      else {
        if (this._.mountedComponent) this._.mountedComponent.unmount();
        this._.notify();
        component = new componentClass;
        component.mount(this._.targetElementId);
        this._.mountedComponentClass = componentClass;
        this._.mountedComponent = component;
      }
    },
    attach: function(component) {
      var target = component;
      for (var i = 0, len = this._.components.length; i < len; i++) {
        if (this._.components[i] === component) return;
      }
      this._.components.push(component);
    },
    detach: function(component) {
      for (var i = 0, len = this._.components.length; i < len; i++) {
        if (this._.components[i] === component) {
          this._components.splice(i, 1);
          break;
        }
      }
    },
    beforeAction: function(callback) {
      this._.beforeActionCallbacks.push(callback);
    }
  });

  // Internal properties of Cape.Router
  var _Internal = function _Internal(main) {
    this.main = main;
    this.beforeActionCallbacks = [];
    this.components = [];
    this.hash = null;
    this.currentHash = null;
    this.mountedComponent = null;
    this.targetElementId = null;
  }

  // Internal methods of Cape.Router
  global.Cape.extend(_Internal.prototype, {
    notify: function() {
      var i;

      for (i = this.components.length; i--;) {
        this.components[i].refresh();
      }
    },
    setHash: function(hash) {
      window.location.hash = hash;
    }
  });

  if (!window.Cape) {
    var Cape = {};
    window.Cape = Cape;
  }
  if (!window.CapeJS) {
    window.CapeJS = window.Cape;
  }
  window.Cape.Router = Router;

})((this || 0).self || window);
