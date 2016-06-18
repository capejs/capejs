---
title: "Data Stores"
---

[Basics](#basics) -
[Ajax](#ajax)

<a class="anchor" id="basics"></a>
### Basics

When you develop something larger than a tiny widget, you are recommended to
create a *data store* for your Cape.JS component.

The following example illustrates the basic concept of data stores.

#### index.html

```html
<div id="todo-list"></div>

<script src="./todo_item_store.js"></script>
<script src="./todo_list2.js"></script>
<script>
  var todoList = new TodoList2();
  todoList.mount('todo-list');
</script>
```

#### todo_item_store.js

```javascript
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

The `TodoItemStore` class has three methods and each of them ends with
`this.propagate()`, which calls the `refresh` method of all attached components.

#### todo_list2.js

```javascript
var TodoList2 = Cape.createComponentClass({
  render: function(m) {
    m.ul(function(m) {
      this.ds.items.forEach(function(item) {
        this.renderItem(m, item);
      }.bind(this))
    });
    this.renderForm(m);
  },

  renderItem: function(m, item) {
    m.li(function(m) {
      m.label({ class: { completed: item.done }}, function(m) {
        m.onclick(function(e) { this.ds.toggle(item) })
          .checked(item.done).input({ type: 'checkbox' })
        m.text(item.title);
      })
    })
  },

  renderForm: function(m) {
    m.onsubmit(function(e) { this.addItem(); return false; });
    m.formFor('item', function(m) {
      m.onkeyup(function(e) { this.refresh() }).textField('title');
      m.onclick(function(e) { this.addItem() })
        .disabled(this.val('item.title') === '').btn("Add");
    });
  },

  init: function() {
    this.ds = TodoItemStore.create();
    this.ds.attach(this);
    this.ds.init();
  },

  addItem: function() {
    this.ds.addItem(this.val('item.title', ''))
  },

  beforeUnmount: function() {
    this.ds.detach(this);
  }
});
```

Within the `init` method, we create a singleton instance of `TodoItemStore` class *(data store)*,
and set it to the `ds` property of this component.

Then we call the `attach` method of the data store to register this component
as a *listener* to the *change event*. When the content of data store is changed,
a *change event* is emitted to this component.

When we click a check box, the following code is executed:

```javascript
this.ds.toggle(item)
```

This inverts the `done` attribute of this item and calls `this.propagate()`,
which will cause the re-rendering of this component.

A working demo is found at
https://github.com/capejs/capejs/tree/master/demo/todo_list2

<a class="anchor" id="ajax"></a>
### Ajax

In this section, we assume that an API server is running behind.
When we access it with `GET /api/items.json`, it responds with a JSON string
such as `[{ title: 'Foo', done: false },{ title: 'Bar', done: true }]`.
When we post to the server a JSON string such as `{ title: 'Baz' }`
using `POST /api/items` interface, it stores this new item to the database.
If we post to the server a JSON string such as `{ done: true }`
using `PATCH /api/items/123` interface (`123` is the `id` value of an item),
it records this item as "done" on the database.

Having this settings, we can rewrite the `todo_item_store.js` of the previous
example as follows:

#### todo_item_store.js

```javascript
var TodoItemStore = Cape.createDataStoreClass({
  init: function() {
    this.items = [];
    this.refresh();
  },

  addItem: function(title) {
    var self = this;
    $.ajax({
      type: 'POST',
      url: '/api/items',
      data: { title: title }
    }).done(function(data) {
      self.refresh();
    });
  },

  toggle: function(item) {
    var self = this;
    $.ajax({
      type: 'PATCH',
      url: '/api/items/' + item.id,
      data: { done: !item.done }
    }).done(function(data) {
      self.refresh();
    });
  },

  refresh: function() {
    var self = this;
    $.ajax({
      type: 'GET',
      url: '/api/items.json'
    }).done(function(data) {
      self.items.length = 0;
      data.forEach(function(item) { self.items.push(item) });
      self.propagate();
    });
  }
});
```

`$.ajax` is a jQuery's method to make an Ajax request.
See http://api.jquery.com/jquery.ajax/ for details.

You can find a working demo using Ajax techniques on
https://github.com/capejs/capejs-demo-on-rails.
This demo is built as a Ruby on Rails application.

Note that the Cape.JS v1.2.0 introduced the
[CollectionAgent](../collection_agents/) class which has a _built-in_
functionality to send Ajax requests to the server.
