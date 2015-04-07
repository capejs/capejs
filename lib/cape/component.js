(function(global) {
  "use strict";

  var Component = function Component() {
    this.forms = {};
    this.virtualForms = {};
  };

  $.extend(Component.prototype, {
    mount: function(id) {
      var self = this;

      this.root = document.getElementById(id);
      if (this.init) this.init();
      if (this.dataStore) {
        this.dataStore.refresh();
        this.updateCallback = function() { self.refresh() };
        this.dataStore.on('update', this.updateCallback);
      }

      this.forms = {};
      this.tree = this.render();
      this.rootNode = virtualDom.create(this.tree);
      this.root.parentNode.replaceChild(this.rootNode, this.root);
      this.root = this.rootNode;
      serializeForms(this);
      if (global.CapeJS.router) global.CapeJS.router.attach(this);
      if (this.afterMount) this.afterMount();
    },
    unmount: function() {
      if (this.beforeUnmount) this.beforeUnmount();
      if (this.dataStore) this.dataStore.off('update', this.updateCallback);
      if (global.CapeJS.router) global.CapeJS.router.detach(this);
      while (this.root.firstChild) this.root.removeChild(this.root.firstChild);
      if (this.afterUnmount) this.afterUnmount();
    },
    markup: function(callback) {
      return (new global.CapeJS.VdomBuilder(this)).markup(callback);
    },
    refresh: function() {
      var newTree, patches;

      serializeForms(this);
      newTree = this.render();
      patches = virtualDom.diff(this.tree, newTree);
      this.rootNode = virtualDom.patch(this.rootNode, patches);
      this.tree = newTree;
    },
    getValue: function(name) {
      var names, formName, attrName, form;

      names = getNames(name);
      formName = names[0];
      attrName = names[1];

      form = this.forms[formName];
      if (form) return form[attrName];
      else return '';
    },
    setValue: function(name, value) {
      var names, formName, attrName;

      names = getNames(name);
      formName = names[0];
      attrName = names[1];

      if (!this.virtualForms[formName]) this.virtualForms[formName] = {};
      this.virtualForms[formName][attrName] = value;
    }
  });

  function getNames(name) {
    if (typeof name === 'string' && name.indexOf('.') >= 0) {
      return name.split('.', 2);
    }
    else {
      return [ '', name ]
    }
  }

  function serializeForms(component) {
    component.forms = {};
    delete component.form;
    $(component.rootNode).find('form').each(function(i) {
      var obj = {};

      $.each($(this).serializeArray(), function() {
        obj[this.name] = this.value || '';
      });

      if ($(this).attr('name')) {
        component.forms[$(this).attr('name')] = obj;
      }
      else {
        component.forms[''] = obj;
        component.form = obj;
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
