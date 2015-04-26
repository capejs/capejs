---
title: "Cape - API Reference"
type: "api"
---

[Cape.createComponentClass](#create-component-class) -
[Cape.createDataStoreClass](#create-data-store-class) -
[Cape.deepExtend](#deep-extend) -
[Cape.extend](#extend) -
[Cape.merge](#merge) -
[Cape.session](#session)

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
    this.propagate();
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
    this.propagate();
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

<a class="anchor" id="session"></a>
### Cape.session (property)

#### Usage

* **Cape.session_[key]_ = _value_**

This property just holds an ordinary object. Users may store arbitrary data to this object.

#### Example

```
Cape.session.currentUser =
  { id: 1, name: 'john', privileged: true }

if (Cape.session.currentUser.privileged) {
  // Do something.
}
```
