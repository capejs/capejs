---
title: "Collection Agents"
---

[Basics](#basics) -
[Setting up](#setting-up) -
[Agent Adapters](#agent-adapters) -
[Initialization](#initialization) -
[Creating Resources](#creating-resources) -
[Options](#options)

<a class="anchor" id="basics"></a>
### Basics

The _collection agents_ are JavaScript objects that have following capabilities:

* Keeping an array of objects that represent resources of the server.
* Creating, updating and deleting these resources by sending Ajax requests to the server.

Cape.JS provides similar objects called _data stores_.
But, they lack Ajax functionalities so that
you have to implement them on your own.

Generally speaking, it is preferable that you adopt collection agents
if the server provides a set of RESTful APIs.

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

<a class="anchor" id="creating-a-resource"></a>
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

<a class="anchor" id="options"></a>
### Options

This section is not yet prepared.
