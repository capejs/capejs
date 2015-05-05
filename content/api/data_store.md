---
title: "Cape.DataStore - API Reference"
---

[Constructor](#constructor) -
[#attach()](#attach) -
[#detach()](#detach) -
[#propagate()](#propagate)

<a class="anchor" id="constructor"></a>
### Constructor

The `Cape.DataStore` constructor takes no argument and calls its `#init` method
if defined.

#### Example

```javascript
var CounterStore = Cape.createDataStoreClass({
  init: function() {
    this.counter = 0;
  },
  increment: function() {
    this.counter++;
    this.propagate();
  }
});

var cs = new CounterStore();
// cs.counter === 0
```

See also [Cape.createDataStoreClass](../cape/#create-data-store-class).

<a class="anchor" id="attach"></a>
### #attach()

#### Usage

* **attach(component)**

This method registers the _component_ as a target of _propagation_ from this data store.

See [#propagate()](#propagate) for details.


<a class="anchor" id="create"></a>
### .create()

This class method returns a singleton object of this Class.


#### Example

```javascript
var CounterStore = Cape.createDataStoreClass({
  init: function() {
    this.counter = 0;
  },
  increment: function() {
    this.counter++;
    this.propagate();
  }
});

var cs1 = CounterStore.create();
var cs2 = CounterStore.create();
// cs1 === cs2
```

<a class="anchor" id="detach"></a>
### #detach()

#### Usage

* **detach(component)**

This method removes the _component_ from the list of targets of _propagation_ from this data store.

See [#propagate()](#propagate) for details.

<a class="anchor" id="propagate"></a>
### #propagate()

#### Usage

* **propagate()**

This method triggars the _propagation_ process, which calls the `#refresh()` method
of all components registerd as targets of _propagation_ of this data store.

Eventually, the `#refresh` method of each component calls its `#render()` method,
which has to be defined by developers.

Thus, we can assure that each time the data of a data store changes,
its all dependent components get refreshed.

#### Example

```javascript
var CounterStore = Cape.createDataStoreClass({
  init: function() {
    this.counter = 0;
  },
  increment: function() {
    this.counter++;
    this.propagate();
  }
});

var ClickCounter = Cape.createComponentClass({
  render: function(m) {
    m.div(String(this.ds.counter),
      { onclick: function(e) { this.ds.increment() } })
  }
})

var ds = new CounterStore();
var comp1 = new ClickCounter();
var comp2 = new ClickCounter();

comp1.ds = ds;
comp2.ds = ds;
ds.attach(comp1);
ds.attach(comp2);

comp1.mount('counter1');
comp2.mount('counter2');
```
