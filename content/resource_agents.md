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
[Specifying a Callback](#specifying-a-callback)
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
    this.agent.init(agent => {
      this.setValues('user', agent.object);
      this.refresh();
    });
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

When you modify the value of `email` field to `'dummy@example.io'` and
click the 'Update' button,
the resource agent sends a `PATCH` request
to `/users/123` with the following JSON body:

```json
{ "user": { "name": "John", "email": "dummy@example.io" } }
```

<a class="anchor" id="building-a-dual-use-form"></a>
### Building a Dual-Use Form

```javascript
class UserForm extends Cape.Component {
  init() {
    this.id = this.data.id;
    this.agent = new UserAgent(this);
    if (this.id) {
      this.agent.init(agent => {
        this.setValues('user', agent.object);
        this.refresh();
      });
    }
    else {
      this.refresh();
    }
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

```html
<h1>New User</h1>
<div id="user-form"></div>

<script src="./user_form.js"></script>
<script>
  var component = new UserForm();
  component.mount('user-form');
</script>
```

```html
<h1>Edit User</h1>
<div id="user-form" data-id="123"></div>

<script src="./user_form.js"></script>
<script>
  var component = new UserForm();
  component.mount('user-form');
</script>
```

<a class="anchor" id="deleting-a-resource"></a>
### Deleting a Resource

You can delete an existing resource by calling `#destroy` method of the resource agent.

```javascript
  m.onclick(e => this.agent.destroy());
  m.btn('Delete');
```

<a class="anchor" id="specifying-a-callback"></a>
### Specifying a Callback

This section is not yet prepared.

<a class="anchor" id="options"></a>
### Options

This section is not yet prepared.
