---
title: "Cape.ResourceAgent - API Reference"
---

<span class="badge alert-info">1.2</span>

[Constructor](#constructor) -
[#_](#_) -
[#adapter](#adapter) -
[#ajax()](#ajax) -
[#basePath](#base-path) -
[#client](#client) -
[#collectionPath()](#collection-path) -
[#create()](#create) -
[#data](#data) -
[#dataType](#data-type) -
[#defaultErrorHandler()](#default-error-hander) -
[#destroy()](#destroy) -
[#errors](#errors) -
[#formName](#formName) -
[#headers](#headers) -
[#init()](#init) -
[#memberPath()](#member-path) -
[#object](#object) -
[#newPath()](#new-path) -
[#nestedIn](#nested-in) -
[#paramName](#param-name) -
[#resourceName](#resource-name) -
[#singular](#singular) -
[#singularPath()](#singular-path) -
[#update()](#update)

<a class="anchor" id="constructor"></a>
### Constructor

The `Cape.ResourceAgent` constructor takes
a `Cape.Component` object and an optional object (options) as arguments.

#### Options

* **resourceName:** the name of resource.
* **basePath:** the string that is added to the request path. Default value is '/'.
* **nestedIn:** the string that is inserted between path prefix and the resource
  name. Default value is ''.
* **adapter:** the name of adapter (e.g., `'rails'`). Default is `undefined`.
  Default value can be changed by setting `Cape.defaultAgentAdapter` property.
* **dataType:** the type of data that you're expecting from the server.
  The value must be `'json'` (default) or `'text'`.
* **pathPrefix:** the string that is added to the request path.
  Default value is `'/'`.
* **singular:** a boolean value that specifies if the resource is singular or not.
  Resources are called _singular_ when they have a URL without ID. Default is `false`.
* **formName:** the name of form with which the users edit the properties
  of the resource. Default is `undefiend`.
  When the `formName` option is not defined, the name is derived from the
  `resourceName` property, e.g. `user` if the resource name is `user`.
* **paramName:** the name of parameter to be used when the `object`
  property is initialized and the request parameter is constructed.
  Default is undefiend.
  When the `pathName` option is not defined, the name is derived from the
  `resourceName` property, e.g. `user` if the resource name is `user`.

#### Adapters

Currently, Cape.JS provides only `RailsAdapter`, which sets the `X-CSRF-Token` header
for Ajax requests.

#### Example

```javascript
Cape.defaultAgentAdapter = 'rails';

var Form = Cape.createComponentClass({
  init: function() {
    this.id = 123;
    this.agent = new Cape.ResourceAgent(this, { resourceName: 'user' });
    this.agent.init();
  },

  render: function(m) {
    m.formFor('user', function(m) {
      m.textField('login_name');
      m.onclick(e => this.agent.update()).btn('Update');
    });
  }
});
```

Usually, You will want to define a class inheriting `Cape.ResourceAgent`:

```javascript
Cape.defaultAgentAdapter = 'rails';

var UserAgent = Cape.createResourceAgentClass({
  constructor: function(client, options) {
    super(client, options);
    this.resourceName = 'user';
  }
})

var Form = Cape.createComponentClass({
  init: function() {
    this.id = 123;
    this.agent = new UserAgent(this);
    this.agent.init();
  },

  render: function(m) {
    m.formFor('user', function(m) {
      m.textField('login_name');
      m.onclick(e => this.agent.update()).btn('Update');
    });
  }
});
```
