(function(global) {
  "use strict;"

  var CapeComponent = function CapeComponent() {
    this.forms = {};
  };

  $.extend(CapeComponent.prototype, {
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
      var newTree = this.render();
      var patches = virtualDom.diff(this.tree, newTree);
      this.rootNode = virtualDom.patch(this.rootNode, patches);
      this.tree = newTree;
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
  }

  if ("process" in global) module.exports = CapeComponent;
  global.CapeComponent = CapeComponent;

})((this || 0).self || global);
