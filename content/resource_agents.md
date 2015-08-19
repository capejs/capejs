---
title: "Resource Agents"
---

<span class="badge alert-info">1.2</span>

[Basics](#basics) -
[Agent Adapters](#agent-adapters) -
[Defining Classes](#defining-classes) -
[Creating a New Resource](#creating-a-new-resource) -
[Editing a Resource](#deleting-a-resource) -
[Building a Dual-Use Form](#building-a-dual-use-form) -
[Deleting a Resource](#deleting-a-resource) -
[Specifying a Callback](#specifying-a-callback) -
[Changing the Path Prefix](#changing-path-prefix) -
[Options](#options)

<a class="anchor" id="basics"></a>
### Basics

The _resource agents_ are JavaScript objects that have following capabilities:

* Keeping an object that represent a resource of the server.
* Creating, updating and deleting it by sending Ajax requests to the server.

Cape.JS provides similar objects called _collection agent,_
which handles a resource collection.


<a class="anchor" id="agent-adapters"></a>
### Agent Adapters

See [Agent Adapters](../collection_agents#agent-adapters) of Collection Agents.


<a class="anchor" id="defining-classes"></a>
### Defining Classes

In order to use resource agents, you should define a class inheriting the
`Cape.ResourceAgent` class.

You can define such a class calling `Cape.createResourceAgentClass()` method:

```javascript
var UserAgent = Cape.createResourceAgentClass({
  resourceName: 'user'
})
```

You can also define it using the ES6 syntax:

```javascript
class UserAgent extends Cape.ResourceAgent {
  constructor(options) {
    super(options);
    this.resourceName = 'user';
  }
}
```

The resource agent uses the `resourceName` property to construct the URL paths
as explained below.


<a class="anchor" id="creating-a-new-resource"></a>
### Creating a New Resource

Suppose that you can create a resource by sending an HTTP request `POST /users`
to the server with following JSON string:

```json
{ "user": { "name": "John", "email": "john@example.com" } }
```

Then, you can build an HTML form like this:

```javascript
class UserForm extends Cape.Component {
  init() {
    this.agent = new UserAgent(this);
    this.refresh();
  }

  render(m) {
    m.formFor('user', m => {
      m.div(m => {
        m.labelFor('name', 'Name').sp();
        m.textField('name');
      });
      m.div(m => {
        m.labelFor('email', 'Email').sp();
        m.textField('email', { type: 'email' });
      });
      m.div(m => {
        m.onclick(e => this.agent.create());
        m.btn('Create');
      });
    });
  }
}
```

If you mount this component into your web page, you will see an HTML form
whose two blank input fields and a 'Create' button.

When you input `'John'` and `'john@example.com'` to these fields and
click the 'Create' button,
the resource agent sends a `POST` request
to `/users` with the following JSON body:

```json
{ "user": { "name": "John", "email": "john@example.com" } }
```

<a class="anchor" id="editing-a-resource"></a>
### Editing a Resource

Suppose that when you send an HTTP request `GET /users/123` to the server,
it returns the following JSON string:

```json
{ "user": { "id": 123, "name": "John", "email": "john@example.com" } }
```

And suppose also that you can update this resource by sending an HTTP request
`PATCH /users/123` to the server with following JSON string:

```json
{ "user": { "name": "John", "email": "dummy@example.io" } }
```

Then, you can build an HTML form like this:

```javascript
class UserForm extends Cape.Component {
  init() {
    this.id = 123;
    this.agent = new UserAgent(this);
    this.agent.init();
  }

  render(m) {
    m.formFor('user', m => {
      m.div(m => {
        m.labelFor('name', 'Name').sp();
        m.textField('name');
      });
      m.div(m => {
        m.labelFor('email', 'Email').sp();
        m.textField('email', { type: 'email' });
      });
      m.div(m => {
        m.onclick(e => this.agent.update());
        m.btn('Update');
      });
    });
  }
}
```

If you mount this component into your web page, you will see an HTML form
whose two text input fields are filled with current values.

Note that we use `this.agent.init()` instead of `this.refresh()` here
(at the line 5).
The `init()` method of resource agents does following three things:

1. Make an Ajax call to the server.
1. Initialize the `object` property using the response data from the server.
1. Call the `refresh()` method of the associated component.

When you modify the value of `email` field of form to `'dummy@example.io'` and
click the 'Update' button,
the resource agent sends a `PATCH` request
to `/users/123` with the following JSON body:

```json
{ "user": { "name": "John", "email": "dummy@example.io" } }
```

<a class="anchor" id="building-a-dual-use-form"></a>
### Building a Dual-Use Form

By synthesizing the two `Component` classes defined above,
we will get the following class:

```javascript
class UserForm extends Cape.Component {
  init() {
    this.id = this.root.data.id;
    this.agent = new UserAgent(this);
    if (this.id) this.agent.init();
    else this.refresh();
  }

  render(m) {
    m.formFor('user', m => {
      m.div(m => {
        m.labelFor('name', 'Name').sp();
        m.textField('name');
      });
      m.div(m => {
        m.labelFor('email', 'Email').sp();
        m.textField('email', { type: 'email' });
      });
      m.div(m => {
        if (this.id) {
          m.onclick(e => this.agent.update());
          m.btn('Update');
        }
        else {
          m.onclick(e => this.agent.create());
          m.btn('Create');
        }
      });
    });
  }
}
```

This `UserForm` class can be used both for a _new user_ form:

```html
<h1>New User</h1>
<div id="user-form"></div>

<script src="./user_form.js"></script>
<script>
  var component = new UserForm();
  component.mount('user-form');
</script>
```

and for a _edit user_ form:

```html
<h1>Edit User</h1>
<div id="user-form" data-id="123"></div>

<script src="./user_form.js"></script>
<script>
  var component = new UserForm();
  component.mount('user-form');
</script>
```

Note that the component gets the string `'123'` through `this.root.data.id`.

<a class="anchor" id="deleting-a-resource"></a>
### Deleting a Resource

You can delete an existing resource by calling `#destroy` method of the resource agent.

```javascript
  m.onclick(e => this.agent.destroy());
  m.btn('Delete');
```

<a class="anchor" id="specifying-a-callback"></a>
### Specifying a Callback

If you want to perform some tasks after the Ajax request is done, you should
specify a callback function as the first argument of `#create()`, `#update()`
or `#destroy()` like this:

```javascript
m.onclick(e => this.agent.create(function(data) {
  if (data.result === 'OK') {
    window.location = '/users';
  }
  else {
    this.agent.errors = data.error_messages;
    this.refresh();
  }
}));
```

The specified callback should take an argument, which can be an object or a string
according to the content type of response.


<a class="anchor" id="changing-path-prefix"></a>
### Changing the Path Prefix

See [Changing the Path Prefix](../collection_agents#changing-path-prefix) of Collection Agents.

<a class="anchor" id="options"></a>
### Options

The constructor of `ResourceMapper` takes following options:

* `resourceName`: the name of resource.
* `basePath`: the string that is added to the request path. Default value is '/'.
* `nestedIn`: the string that is inserted between path prefix and the resource
  name. Default value is ''.
* `adapter`: the name of adapter (e.g., 'rails'). Default is undefined.
  Default value can be changed by setting Cape.defaultAgentAdapter property.
* `dataType`: the type of data that you're expecting from the server.
  The value must be 'json', 'text' or undefined. Default is undefiend.
  When the dataType option is not defined, the type is detected automatically.
* `singular`: a boolean value that specifies if the resource is singular or not.
   Resources are called 'singular' when they have a URL without ID.
   Default is `false`.
* `formName`: the name of form with which the users edit the properties
  of the resource. Default is `undefiend`.
  When the `formName` option is not defined, the name is derived from the
  `resourceName` property, e.g. `user` if the resource name is `user`.
* `paramName`: the name of parameter to be used when the `object`
  property is initialized and the request parameter is constructed.
  Default is undefiend.
  When the `pathName` option is not defined, the name is derived from the
  `resourceName` property, e.g. `user` if the resource name is `user`.
