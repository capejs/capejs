---
title: "Cape.CollectionAgent - API Reference"
---

<span class="badge alert-info">1.2</span>

[Constructor](#constructor) -
[#_](#_) -
[#adapter](#adapter) -
[#afterRefresh()](#after-refresh) -
[#ajax()](#ajax) -
[#autoRefresh](#auto-refresh) -
[#basePath](#base-path) -
[#collectionPath()](#collection-path) -
[#create()](#create) -
[#data](#data) -
[#dataType](#data-type) -
[#defaultErrorHandler()](#default-error-handler) -
[#delete()](#delete) -
[#destroy()](#destroy) -
[#get()](#get) -
[#head()](#head) -
[#headers](#headers) -
[#index()](#index) -
[#memberPath()](#member-path) -
[#nestedIn](#nested-in) -
[#objects](#object) -
[#paramName](#param-name) -
[#paramsForRefresh()](#params-for-refresh) -
[#patch()](#patch) -
[#post()](#post) -
[#put()](#put) -
[#refresh()](#refresh) -
[#resourceName](#resource-name) -
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
* **paramName:** the name of parameter to be used when the `objects`
  property is refreshed. Default is `undefiend`.
  When the `paramName` option is not defined, the name is derived from the
  `resourceName` property, e.g. `users` if the resource name is `users`.

#### Example

```javascript
Cape.defaultAgentAdapter = 'rails';
var comp = new Cape.Component();
var agent1 = new Cape.CollectionAgent(comp, { resourceName: 'users' });
var agent2 = new Cape.CollectionAgent(comp, { resourceName: 'tags', basePath: '/api/' });
var agent3 = new Cape.CollectionAgent(comp, { resourceName: 'members', nestedIn: 'teams/123/' });
var agent4 = new Cape.CollectionAgent(comp, { resourceName: 'articles', dataType: 'text' });
```

<a class="anchor" id="_"></a>
### #_

This property holds the agent's _inner object,_ which keeps _private_ properties
and methods. Developers should not tamper with it.

<a class="anchor" id="adapter"></a>
### #adapter

See "Options" section of the [Constructor](#constructor).


<a class="anchor" id="after-refresh"></a>
### #afterRefresh

This method gets called by the `refresh()` method after it updates the `data`
and `objects` properties.

The `afterRefresh()` does `this.client.refresh()` by default.
Developers may override this method to let the agent do some
post-processing jobs.


<a class="anchor" id="adapter"></a>
### #adapter

See "Options" section of the [Constructor](#constructor).


<a class="anchor" id="ajax"></a>
### #ajax()

#### Usage

* **ajax(httpMethod, path, params)**
* **ajax(httpMethod, path, params, callback)**
* **ajax(httpMethod, path, params, callback, errorHandler)**

Sends an Ajax request to the server.

<a class="anchor" id="auto-refresh"></a>
### #autoRefresh

See "Options" section of the [Constructor](#constructor).


<a class="anchor" id="base-path"></a>
### #basePath

See "Options" section of the [Constructor](#constructor).


<a class="anchor" id="collection-path"></a>
### #collectionPath()

Returns the URL path to a collection of resources in accordance with the
values of `resourceName`, `basePath` and `nestedIn` properties:

|#resourceName|#basePath|#nestedIn|#collectionPath()|
|------------|--------|--------|----|
|users|||/users|
|users|/api/||/api/users|
|users||teams/123/|/teams/123/users|
|users|/api/|teams/123/|/api/teams/123/users|

Note that the default value of `basePath` property is `/`.


<a class="anchor" id="create"></a>
### #create()
#### Usage

* **create(params)**
* **create(params, callback)**
* **create(params, callback, errorHandler)**

Sends an Ajax request with POST method to the URL that is constructed
by the [collectionPath()](#collection-path) method.

The first argument (`params`) must be an object (hash).

The optional second argument (`callback`) must be a function, which takes the
agent itself as the single argument and does some post-processing jobs.

Ths optional third argument (`errorHandler`) must be a function,
which takes an exception and does some error-handling jobs.

#### Example

```javascript
class UserList extends Cape.Component {
  init() {
    this.agent = new Cape.CollectionAgent(this, { resourceName: 'users' })
    this.agent.refresh()
  }

  render(m) {
    m.ol(m => {
      this.agent.objects.forEach(user => {
        m.li(m => {
          m.text(user.name);
        });
      });
    });
    m.formFor('user', m => {
      m.labelFor('name', 'Name');
      m.textField('name');
      m.onclick(e => {
        this.agent.create(this.paramsFor('user'))
      });
      m.btn('Add User');
    })
  }
}
```

<a class="anchor" id="data"></a>
### #data

This property holds an object (hash)
if the response data is a valid JSON string.
Otherwise, it holds the original string value.

<a class="anchor" id="data-type"></a>
### #dataType

See "Options" section of the [Constructor](#constructor).

<a class="anchor" id="default-error-hander"></a>
### #defaultErrorHandler()

This method handles the exception thrown during the Fetch API.

The default implementation is just `console.log(ex)`.
Developers may override this for a better exception handling.

<a class="anchor" id="delete"></a>
### #delete()
#### Usage

* **delete(actionName, id, params)**
* **delete(actionName, id, params, callback)**
* **delete(actionName, id, params, callback, errorHandler)**

Sends an Ajax request with DELETE method to the URL that is constructed
by given arguments.

<a class="anchor" id="destroy"></a>
### #destroy()
#### Usage

* **destroy(id)**
* **destroy(id, callback)**
* **destroy(id, callback, errorHandler)**

Sends an Ajax request with DELETE method to the URL that is constructed
by the `memberPath()` method.

The first argument (`id`) specifies the _id_ of the resource to be updated.
This is usually the value of primary key of a database record, but is not
always the case.

The optional second argument (`callback`) must be a function, which takes the
agent itself as the single argument and does some post-processing jobs.

Ths optional third argument (`errorHandler`) must be a function,
which takes an exception and does some error-handling jobs.

#### Example

```javascript
class UserList extends Cape.Component {
  init() {
    this.agent = new Cape.CollectionAgent(this, { resourceName: 'users' })
    this.agent.refresh()
  }

  render(m) {
    m.ol(m => {
      this.agent.objects.forEach(user => {
        m.li(m => {
          m.text(user.name);
          m.onclick(e => {
            this.agent.destroy(user.id);
          });
          m.btn('Delete');
        });
      });
    });
  }
}
```


<a class="anchor" id="get"></a>
### #get()
#### Usage

* **get(actionName, id, params)**
* **get(actionName, id, params, callback)**
* **get(actionName, id, params, callback, errorHandler)**

Sends an Ajax request with GET method to the URL that is constructed
by given arguments.


<a class="anchor" id="get-instance"></a>
### .getInstance()
#### Usage

Returns an instance of collection agent.

This class method is implemented as a _multiton_ method,
which keeps a map of named instances
of the class as key-value pairs in order to ensure a single instance per key.

The `resourceName`, `basePath` and `nestedIn` options are used to construct
the key.


<a class="anchor" id="head"></a>
### #head()
#### Usage

* **head(actionName, id, params)**
* **head(actionName, id, params, callback)**
* **head(actionName, id, params, callback, errorHandler)**

Sends an Ajax request with HEAD method to the URL that is constructed
by given arguments.

<a class="anchor" id="headers"></a>
### #headers

This property holds the HTTP headers for Ajax requests.

The default value is `{ 'Content-Type': 'application/json' }`.

<a class="anchor" id="index"></a>
### #index()
#### Usage

* **index(params)**
* **index(params, callback)**
* **index(params, callback, errorHandler)**

Sends an Ajax request with GET method to the URL that is constructed
by the `collectionPath()` method and the `params`.

<a class="anchor" id="member-path"></a>
### #memberPath()
#### Usage

* **memberPath(id)**

Returns the URL path to a resource in accordance with the
values of `resourceName`, `basePath` and `nestedIn` properties:

|#resourceName|#basePath|#nestedIn|#memberPath()|
|------------|--------|--------|----|
|users|||/users/9|
|users|/api/||/api/users/9|
|users||teams/123/|/teams/123/users/9|
|users|/api/|teams/123/|/api/teams/123/users/9|

The `id` part of the URL path (`9`) derives from the `id` argument.

Note that the default value of `basePath` property is `/`.

<a class="anchor" id="nested-in"></a>
### #nestedIn

See "Options" section of the [Constructor](#constructor).

<a class="anchor" id="objects"></a>
### #objects

This property holds an array of objects (hashes) that represents the
collection of resources which the agent is associated to.

<a class="anchor" id="param-name"></a>
### #paramName

See "Options" section of the [Constructor](#constructor).

<a class="anchor" id="params-for-refresh"></a>
### #paramsForRefresh()

#### Usage

* **paramsForRefresh()**

Returns an empty object (`{}`) always. This object is used to construct
the query string of the request URL during the `refresh()` process.

Developers may override this method to change this behavior.

#### Example

```javascript
class UserAgent extends Cape.CollectionAgent {
  constructor(options) {
    super(options);
    this.page = 1;
    this.perPage = 20;
  }

  paramsForRefresh() {
    return { page: this.page, per_page: this.perPage };
  }
}
```


<a class="anchor" id="patch"></a>
### #patch()
#### Usage

* **patch(actionName, id, params)**
* **patch(actionName, id, params, callback)**
* **patch(actionName, id, params, callback, errorHandler)**

Sends an Ajax request with PATCH method to the URL that is constructed
by given arguments.


<a class="anchor" id="post"></a>
### #post()
#### Usage

* **post(actionName, id, params)**
* **post(actionName, id, params, callback)**
* **post(actionName, id, params, callback, errorHandler)**

Sends an Ajax request with POST method to the URL that is constructed
by given arguments.


<a class="anchor" id="put"></a>
### #put()
#### Usage

* **put(actionName, id, params)**
* **put(actionName, id, params, callback)**
* **put(actionName, id, params, callback, errorHandler)**

Sends an Ajax request with PUT method to the URL that is constructed
by given arguments.


<a class="anchor" id="refresh"></a>
### #refresh()

This method sends an Ajax request with GET method to the URL that is constructed
by the [#collectionPath()](#collection-path) and
[#paramsForRefresh()](#params-for-refresh).


<a class="anchor" id="resource-name"></a>
### #resourceName

See "Options" section of the [Constructor](#constructor).

<a class="anchor" id="update"></a>
### #update()
#### Usage

* **update(id, params)**
* **update(id, params, callback)**
* **update(id, params, callback, errorHandler)**

Sends an Ajax request with PATCH method to the URL that is constructed
by the `memberPath()` method.

The first argument (`id`) specifies the _id_ of the resource to be updated.
This is usually the value of primary key of a database record, but is not
always the case.

The second argument (`params`) must be an object (hash).

The optional third argument (`callback`) must be a function, which takes the
agent itself as the single argument and does some post-processing jobs.

Ths optional fourth argument (`errorHandler`) must be a function,
which takes an exception and does some error-handling jobs.

#### Example

```javascript
class UserList extends Cape.Component {
  init() {
    this.agent = new Cape.CollectionAgent(this, { resourceName: 'users' })
    this.agent.refresh()
  }

  render(m) {
    m.ol(m => {
      this.agent.objects.forEach(user => {
        m.li(m => {
          m.text(user.name);
          m.onclick(e => {
            this.agent.update(user.id, { user: { deleted: 1 } });
          });
          m.btn('Delete');
        });
      });
    });
  }
}
```
