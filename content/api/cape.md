---
title: "Cape - API Reference"
type: "api"
---

[Cape.createCollectionAgentClass()](#create-collection-agent-class) -
[Cape.createComponentClass()](#create-component-class) -
[Cape.createDataStoreClass()](#create-data-store-class) -
[Cape.createResourceAgentClass()](#create-resource-agent-class) -
[Cape.deepExtend()](#deep-extend) -
[Cape.defaultAgentAdapter](#default-agent-adapter) -
[Cape.extend()](#extend) -
[Cape.merge()](#merge)

<a class="anchor" id="create-collection-agent-class"></a>
### Cape.createCollectionAgentClass

#### Usage

* **Cape.createCollectionAgentClass(*methods*)**

Create a class extending `Cape.CollectionAgentClass` with `methods`.

<a class="anchor" id="create-component-class"></a>
### Cape.createComponentClass

#### Usage

* **Cape.createComponentClass(*methods*)**

Create a class extending `Cape.Component` with `methods`.


#### Example

```
var HelloMessage = Cape.createComponentClass({
  render: function(m) {
    m.p('Hello, ' + this.root.data.name + '!')
  }
});
```

With ECMAScript 6 syntax, you can write the above as follows:

```
class HelloMessage extends Cape.Component {
  render(m) {
    m.p('Hello, ' + this.root.data.name + '!')
  }
}
```

<a class="anchor" id="create-component-class"></a>
### Cape.createDataStoreClass

#### Usage

* **Cape.createDataStoreClass(*methods*)**

Create a class extending `Cape.DataStore` with `methods`.


#### Example

```
var TodoItemStore = Cape.createDataStoreClass({
  init: function() {
    this.items = [
      { title: 'Foo', done: false },
      { title: 'Bar', done: true }
    ];
  },
  addItem: function(title) {
    this.items.push({ title: title, done: false });
    this.propagate();
  },
  toggle: function(item) {
    item.done = !item.done;
    this.propagate();
  }
});
```

With ECMAScript 6 syntax, you can write the above as follows:

```
class TodoItemStore extends Cape.DataStore {
  init() {
    this.items = [
      { title: 'Foo', done: false },
      { title: 'Bar', done: true }
    ];
  }
  addItem(title) {
    this.items.push({ title: title, done: false });
    this.propagate();
  }
  toggle(item) {
    item.done = !item.done;
    this.propagate();
  }
}
```

<a class="anchor" id="create-resource-agent-class"></a>
### Cape.createResourceAgentClass

#### Usage

* **Cape.createResourceAgentClass(*methods*)**

Create a class extending `Cape.ResourceAgentClass` with `methods`.

<a class="anchor" id="default-agent-adapter"></a>
### Cape.defaultAgentAdapter

This property is used as the default value of `adapter` property of
collection agents and resource agents.

See [CollectionAgent#adapter](../collection_agent#adapter) and
[ResourceAgent#adapter](../resource_agent#adapter).

<a class="anchor" id="deep-extend"></a>
### Cape.deepExtend

#### Usage

* **Cape.extend(*target[, object1, object2, ... objectN]*)**

Merge the properties of two or more objects together into the first object recursively.

#### Example

```
var object1 = {
  apple: 0,
  banana: { weight: 52, price: 100 },
  cherry: 97
};
var object2 = {
  banana: { price: 200 },
  durian: 100
};

Cape.extend(object1, object2);

// [Result]
//
// object1 => {
//   apple: 0,
//   banana: { weight: 52, price: 200 },
//   cherry: 97,
//   durian: 100
// }
```

<a class="anchor" id="extend"></a>
### Cape.extend

#### Usage

* **Cape.extend(*target[, object1, object2, ... objectN]*)**

Merge the properties of two or more objects together into the first object.

#### Example

```
var object1 = {
  apple: 0,
  banana: { weight: 52, price: 100 },
  cherry: 97
};
var object2 = {
  banana: { price: 200 },
  durian: 100
};

Cape.extend(object1, object2);

// [Result]
//
// object1 => {
//   apple: 0,
//   banana: { price: 200 },
//   cherry: 97,
//   durian: 100
// }
```

<a class="anchor" id="merge"></a>
### Cape.merge

#### Usage

* **Cape.merge(target*[, object1, object2, ... objectN]*)**

Merge (but not override) the properties of two or more objects together
into the first object

#### Example

```
var object1 = {
  apple: 0,
  banana: { weight: 52, price: 100 },
  cherry: 97
};
var object2 = {
  apple: 2,
  banana: { price: 200 },
  durian: 100
};

Cape.extend(object1, object2);

// [Result]
//
// object1 => {
//   apple: 0,
//   banana: { weight: 52, price: 100 },
//   cherry: 97,
//   durian: 100
// }
```