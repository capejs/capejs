---
title: "Resource Agents"
---

<span class="badge alert-info">1.2</span>

[Basics](#basics) -
[Agent Adapters](#agent-adapters) -
[Defining Classes](#defining-classes) -
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


<a class="anchor" id="options"></a>
### Options

This section is not yet prepared.
