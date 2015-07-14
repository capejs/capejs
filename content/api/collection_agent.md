---
title: "Cape.CollectionAgent - API Reference"
---

<span class="badge alert-info">1.2</span>

[Constructor](#constructor) -
[#ajax()](#ajax) -
[#attach()](#attach) -
[#collectionPath()](#collection-path) -
[.create()](#dot-create) -
[#create()](#create) -
[#defaultErrorHandler()](#default-error-handler) -
[#delete()](#delete) -
[#destroy()](#destroy) -
[#detach()](#detach) -
[#get()](#get) -
[#index()](#index) -
[#memberPath()](#member-path) -
[#patch()](#patch) -
[#pathPref()](#path-prefix) -
[#post()](#post) -
[#propagate()](#propagate) -
[#put()](#put) -
[#refresh()](#refresh) -
[#refreshObjects()](#refresh-objects) -
[#show()](#show) -
[#update()](#update)

<a class="anchor" id="constructor"></a>
### Constructor

The `Cape.CollectionAgent` constructor takes a string (resource name) and an
optional object (options).

#### Options

* **adapter:** the name of adapter (e.g., `'rails'`). Default is `undefined`.
  Default value can be changed by setting `Cape.defaultAgentAdapter` property.
* **autoRefresh:** a boolean value that controls POST/PATCH/PUT/DELETE requests
  trigger `this.refresh()`. Default is `true`.
* **dataType:** the type of data that you're expecting from the server.
  The value must be `'json'` (default) or `'text'`.
* **pathPrefix:** the string that is added to the request path.
  Default value is `'/'`.

#### Example

```javascript
Cape.defaultAgentAdapter = 'rails';
var agent1 = new Cape.CollectionAgent('users');
var agent2 = new Cape.CollectionAgent('tags', { pathPrefix: '/api/' });
var agent3 = new Cape.CollectionAgent('pages', { dataType: 'text' });
```
