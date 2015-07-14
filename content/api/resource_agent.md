---
title: "Cape.ResourceAgent - API Reference"
---

<span class="badge alert-info">1.2</span>

[Constructor](#constructor) -
[#ajax()](#ajax) -
[#collectionPath()](#collection-path) -
[#create()](#create) -
[#defaultErrorHandler()](#default-error-hander) -
[#destroy()](#destroy) -
[#init()](#init) -
[#memberPath()](#member-path) -
[#pathPrefix()](#path-prefix) -
[#singularPath()](#singular-path) -
[#update()](#update)

<a class="anchor" id="constructor"></a>
### Constructor

The `Cape.ResourceAgent` constructor takes a string (resource name),
a `Cape.Component` object and an optional object (options).

#### Options

* **adapter:** the name of adapter (e.g., `'rails'`). Default is `undefined`.
  Default value can be changed by setting `Cape.defaultAgentAdapter` property.
* **dataType:** the type of data that you're expecting from the server.
  The value must be `'json'` (default) or `'text'`.
* **pathPrefix:** the string that is added to the request path.
  Default value is `'/'`.
* **singular:** a boolean value that specifies if the resource is singular or not.
  Resources are called _singular_ when they have a URL without ID. Default is `false`.

#### Adapters

Currently, Cape.JS provides only `RailsAdapter`, which sets the `X-CSRF-Token` header
for Ajax requests.

#### Example

```javascript
Cape.defaultAgentAdapter = 'rails';

var Form = Cape.createComponentClass({
  init: function() {
    this.agent = new Cape.ResourceAgent('user', this);
    this.agent.init(function(agent) {
      this.setValues('user', agent.object);
      this.refresh();
    })
  },

  render: function(m) {
    m.formFor('user', function(m) {
      m.textField('login_name');
      m.passwordField('password');
    });
  }
});
```
