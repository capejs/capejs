---
title: "Cape.CollectionAgent - API Reference"
---

<span class="badge alert-info">1.2</span>

[Constructor](#constructor) -
[#_](#_) -
[#adapter](#adapter) -
[#ajax()](#ajax) -
[#attach()](#attach) -
[#autoRefresh](#auto-refresh) -
[#basePath](#base-path) -
[#collectionPath()](#collection-path) -
[#create()](#create) -
[#data](#data) -
[#dataType](#data-type) -
[#defaultErrorHandler()](#default-error-handler) -
[#delete()](#delete) -
[#destroy()](#destroy) -
[#detach()](#detach) -
[#get()](#get) -
[.getInstance()](#get-instance) -
[#head()](#head) -
[#headers](#headers) -
[#index()](#index) -
[#memberPath()](#member-path) -
[#objects](#object) -
[#paramName](#param-name) -
[#patch()](#patch) -
[#post()](#post) -
[#propagate()](#propagate) -
[#put()](#put) -
[#refresh()](#refresh) -
[#update()](#update)

<a class="anchor" id="constructor"></a>
### Constructor

The `Cape.CollectionAgent` constructor takes an object _(options)_ as the first argument.

#### Options

* **resourceName:** the name of resource which is located on the web.
  The collection agents use it in order to construct the paths of server-side API.
* **basePath:** the string that is added to the request path.
  Default value is `'/'`.
* **nestedIn:** the string that is inserted between path prefix and the resource
  name. Default value is `''`.
* **adapter:** the name of adapter (e.g., `'rails'`). Default is `undefined`.
  Default value can be changed by setting `Cape.defaultAgentAdapter` property.
* **autoRefresh:** a boolean value that controls if a `POST/PATCH/PUT/DELETE` request
  triggers `this.refresh()` after its completion. Default is `true`.
* **dataType:** the type of data that you're expecting from the server.
  The value must be `undefined` (default), `'json'` or `'text'`.
  If this property is not set, the collection agents detect the data type
  automatically.

#### Example

```javascript
Cape.defaultAgentAdapter = 'rails';
var agent1 = new Cape.CollectionAgent({ resourceName: 'users' });
var agent2 = new Cape.CollectionAgent({ resourceName: 'tags', basePath: '/api/' });
var agent3 = new Cape.CollectionAgent({ resourceName: 'members', nestedIn: 'teams/123/' });
var agent4 = new Cape.CollectionAgent({ resourceName: 'articles', dataType: 'text' });
```
