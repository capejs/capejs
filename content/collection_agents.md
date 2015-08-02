---
title: "Collection Agents"
---

<span class="badge alert-info">1.2</span>

[Basics](#basics) -
[Setting up](#setting-up) -
[Agent Adapters](#agent-adapters) -
[Initialization](#initialization) -
[Creating Resources](#creating-resources) -
[REST Operations](#rest-operations) -
[Callbacks and Error Handlers](#callbacks-and-error-handlers) -
[Options](#options)

<a class="anchor" id="basics"></a>
### Basics

The _collection agents_ are JavaScript objects that have following capabilities:

* Keeping an array of objects that represent resources of the server.
* Creating, updating and deleting these resources by sending Ajax requests to the server.

Cape.JS provides similar objects called _data stores_.
But, they lack Ajax functionalities so that
you have to implement them on your own.

Generally speaking, you will prefer collection agents to data stores,
if the server provides a set of RESTful APIs.

Note that the collection agents are introduced with the Cape.JS version 1.2.

<a class="anchor" id="setting-up"></a>
### Setting up

For doing Ajax operations, the collection agents utilize
[Fetch API](https://developer.mozilla.org/en/docs/Web/API/Fetch_API),
which is supported only by some modern browsers.
If you want to support Internet Explorer and Safari,
you need to include a _pollyfill_ for the Fetch API into your application
by adding the following lines to the `<head>` section of your HTML files.

```html
<script src="//cdn.rawgit.com/jakearchibald/es6-promise/2.3.0/dist/es6-promise.min.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/fetch/0.9.0/fetch.min.js"></script>
```

<a class="anchor" id="agent-adapters"></a>
### Agent Adapters

Sometimes, the Ajax clients need to send a set of specific HTTP headers to the server.
A Rails application requires a correct `X-CSRF-Token` header, for example.

In order to cope with the peculiarities of the server, you can use a _agent adapter_.
As of `v1.2.0`, the only built-in adapter is `Cape.AgentAdapters.RailsAdapter`.

If your server is built on the Ruby on Rails, put the following line at the very
beginning of your JavaScript code:

```javascript
Cape.defaultAgentAdapter = 'rails'
```

<a class="anchor" id="initialization"></a>
### Initialization

Suppose that when you send an HTTP request `GET /users` to the server,
it returns the following JSON string:

```json
"users" : [
  { "id": 1, "name": "John" },
  { "id": 2, "name": "Anna" },
  { "id": 3, "name": "Tommy" }
]
```

Then, you can build a Cape.JS component like this:

```javascript
class UserList extends Cape.Component {
  init() {
    this.agent = Cape.CollectionAgent.create('users');
    this.agent.attach(this);
    this.agent.refresh();
  }

  render(m) {
    m.ul(m => {
      this.agent.objects.forEach(user => {
        m.li(user.name);
      });
    });
  }
}
```

Note that the `Cape.CollectionAgent.create` method is a singleton factory method,
which returns the same object always. The string argument `'users'` is the name
of resource collection. The collection agent uses it to construct the URL paths
and analyze the JSON string returned from the server.

The `attach` method register the argument as an _event listener_ of the agent.
With this the component will get notified
when the _objects_ managed by the agent are changed.

The `refresh` method will trigger an Ajax request to the server and
initialize the `objects` property of the component.

In response to the notification from the agent,
the component will render the following HTML fragment:

```html
<ul>
  <li>John</li>
  <li>Anna</li>
  <li>Tommy</li>
</ul>
```

<a class="anchor" id="creating-resources"></a>
### Creating Resources

Suppose that you can create a _user_ by sending a `POST` request to the `/users`
with the following body:

```json
"user": { "name": "Nancy" }
```

Then, you can create a form for adding users like this:

```javascript
class UserList extends Cape.Component {
  init() {
    this.agent = Cape.CollectionAgent.create('users');
    this.agent.attach(this);
    this.agent.refresh();
  }

  render(m) {
    m.ul(m => {
      this.agent.objects.forEach(user => {
        m.li(user.name);
      });
    });
    m.formFor('user', m => {
      m.textField('name');
      m.onclick(e => this.agent.create(this.paramsFor('user')));
      m.btn('Create');
    })
  }
}
```

<a class="anchor" id="rest-operations"></a>
### REST operations

Cape.JS provides five basic methods for REST operations:

* [#index()](./api/collection_agent#index) to get a collection of resources
* [#show()](./api/collection_agent#show) to get a resource
* [#create()](./api/collection_agent#create) to create a resource
* [#update()](./api/collection_agent#update) to update (modify) a resource
* [#destroy()](./api/collection_agent#destroy) to delete a resource

These methods send an Ajax call using Rails like HTTP verbs and paths.
If the resource name is `'users'`, the HTTP verbs and paths will be as shown in the
following table, where `:id` is an integer denoting the value of object's `id`.

|Method|HTTP Verb|Path|
|------|---------|----|
|#index()|GET|/users|
|#show()|GET|/users/:id|
|#create()|POST|/users|
|#update()|PATCH|/users/:id|
|#destroy()|DELETE|/users/:id|

The following is an example of code which modify the name of a user:

```javascript
this.agent.update(1, { name: 'johnny' });
```

When you specify other combinations of HTTP verb and path, you should use
one of following five methods:

* [#get()](./api/collection_agent#get) to send a `GET` request
* [#head()](./api/collection_agent#head) to send a `HEAD` request
* [#post()](./api/collection_agent#post) to send a `POST` request
* [#patch()](./api/collection_agent#patch) to send a `PATCH` request
* [#put()](./api/collection_agent#put) to send a `PUT` request
* [#delete()](./api/collection_agent#delete) to send a `DELETE` request

For example, if you want to make a `PATCH` request to the path `/users/123/move_up`,
write a code like this:

```javascript
this.agent.patch('move_up', 123, {});
```

<a class="anchor" id="callbacks-and-error-handlers"></a>
### Callbacks and Error Handlers

If you want the collection agent to perform any jobs after the Ajax request,
you can pass a _callback_ as the last argument to the methods:

```javascript
m.onclick(e => this.agent.create(this.paramsFor('user'), data => {
  if (data.result === 'OK') {
    this.val('user.name', '');
  }
  else {
    // Do something to handle validation errors, for example.
  }
}));
```

Furthermore, you can specify an _error handler_ after the callback:

```javascript
m.onclick(e => this.agent.create(this.paramsFor('user'), data => {
  if (data.result === 'OK') {
    this.val('user.name', '');
  }
  else {
    // Do something to handle validation errors, for example.
  }
}, ex => {
  // Do some error handling.
}));
```

This error hander is called when an exception is raised due to some reasons
(network errors, syntax errors, etc.).

<a class="anchor" id="options"></a>
### Options

The class method `.create()` takes following options:

* `adapter`: the name of adapter (e.g., 'rails'). Default is undefined.
  Default value can be changed by setting Cape.defaultAgentAdapter property.
* `autoRefresh`: a boolean value that controls unsafe Ajax requests trigger
  this.refresh(). Default is true.
* `dataType`: the type of data that you're expecting from the server.
  The value must be 'json', 'text' or undefined. Default is undefiend.
  When the dataType option is not defined, the type is detected automatically.
* `pathPrefix`: the string that is added to the request path. Default value is '/'.
* `paramName`: the name of parameter to be used when the `objects`
  property is initialized and refreshed. Default is undefiend.
  When the `pathName` option is not defined, the name is derived from the
  `resourceName` property, e.g. `user` if the resource name is `users`.

See [.create()](./api/collection_agent#_create) for details.
