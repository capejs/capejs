# Cape.JS

![Cape.JS logo](https://cdn.rawgit.com/oiax/Cape.JS/logo1/doc/logo/Cape.JS.svg)

Cape.JS is a lightweight Javascript UI framework based on [virtual-dom](https://github.com/Matt-Esch/virtual-dom) of Matt-Esch.

* **Small but full stack:** Cape.JS is consists of three basic but powerful classes; *Component, DataStore,* and *Router.* You can utilize them to create web widgets and single-page applications (SPAs).
* **Virtual DOM:** Cape.JS takes advantage of [virtual-dom](https://github.com/Matt-Esch/virtual-dom) for high performance UI rendering. You don't have to rely on *jQuery* for DOM manipulation anymore.
* **Concise syntax:** The *markup builder* helps you to construct HTML DOM trees with its simple, easy to learn syntax. You can add a `div` element by calling markup builder's `div` method, for example.

The architecture and terminology of Cape.JS are strongly influenced by [React](https://github.com/facebook/react),  [Riot](https://github.com/muut/riotjs) and [Ruby on Rails](https://github.com/rails/rails).

## Examples

### Hello World

The following example will insert `<div>Hello, World!</div>` into the `div#hello-message` element.

`index.html`

```html
<h1>Greeting from Cape.JS</h1>
<div id="hello-message" data-name="World"></div>

<script src="./hello_message.js"></script>
<script>
  var component = new HelloMesage();
  component.mount('hello-message');
</script>
```

`hello_message.js`

```javascript
var HelloMesage = Cape.createComponentClass({
  render: function(m) {
    m.div('Hello, ' + this.root.data.name + '!')
  }
});
```

First of all, we *must* define the `render` method for Cape.JS components.
The role of this method is to create a *virtual* DOM tree.
Cape.JS updates the *real* DOM tree of browsers using this virtual tree.

The `render` method should take an argument, which is called *markup builder*.
When you call its `div` method, a `div` node is added to the virtual DOM tree.
The markup builder has corresponding methods for all valid tag names of HTML5,
such as `p`, `span`, `br`, `section`, `video`, etc.

You can call `this.root` to get the node which the component was mounted on.
And you can access to `data-name` attributes of the `root` node by
`this.root.data.name`.

A working demo is found in the directory [demo/hello_message](demo/hello_message).

### Hello World (ES6 version)

If you want to write more concisely, try to define class using ECMAScript 6 (ES6) syntax.

`hello_message.es6`

```javascript
class HelloMessage extends Cape.Component {
  render(m) {
    m.div(`Hello ${this.root.data.name}!`)
  }
}
```

A working demo is found in the directory [es6-demo/hello_message](es6-demo/hello_message).

You must have `npm` and `babel-core` to see this demo page.
You must also have `browserify` to convert `.es6` file to `.js` file.

See [es6-demo/README.md](es6-demo/README.md) for details.

### Hello World 2

`index.html`

```html
<h1>Greeting from Cape.JS</h1>
<div id="hello-message" data-name="World"></div>

<script src="./hello_message2.js"></script>
<script>
  var component = new HelloMesage2();
  component.mount('hello-message');
</script>
```

`hello_message2.js`

```javascript
var HelloMesage2 = Cape.createComponentClass({
  render: function(m) {
    m.p(function(m) {
      m.text('Hello, ');
      m.strong(function(m) {
        m.text(this.root.data.name);
        m.text('!');
      })
    })
  }
});
```

This example will generate `<p>Hello, <strong>World!</strong></p>`.

Note that `strong` method takes a function, which create the content of `strong` element.
In this way you can create a deeply-nested DOM tree.

With ES6 syntax, you can write much tersely:

```javascript
class HelloMesage2 extends Cape.Component {
  render(m) {
    m.p(m => {
      m.text('Hello, ');
      m.strong(m => {
        m.text(this.root.data.name);
        m.text('!');
      })
    })
  }
}
```


### Click Counter

On this example, your will see the number which gets incremented each time you click on the surrounding `div` box.

`index.html`

```html
<div id="click-counter"></div>

<script src="./click_counter.js"></script>
<script>
  var counter = new ClickCounter();
  counter.mount('click-counter');
</script>
```

`click_counter.js`

```javascript
var ClickCounter = Cape.createComponentClass({
  render: function(m) {
    m.div(String(this.counter), {
      class: 'counter',
      onclick: function(e) { this.increment() }
    })
  },

  init: function() {
    this.counter = 0;
    this.refresh();
  },

  increment: function() {
    this.counter++;
    this.refresh();
  }
});
```

Note that we give the second argument to the `div` method:

```javascript
{
  class: 'counter',
  onclick: function(e) { this.increment() }
}
```

This *associative array* represents the attributes of `div` element.
We can attach a handler (function) to the `click` event for this element like this.

Within event handlers, `this` denotes the component itself.
So you can call its `increment` method by `this.increment()`.

A method call `this.refresh()` redraws the component.
You should call it at the end of the `init` method,
but if the component lacks the `init` method, the `refresh` method
is called when the component is mounted.

A working demo is found in the directory [demo/click_counter](demo/click_counter).

### Todo List

On this example, your can add a todo item from a HTML form and toggle the
`completed` property of todo items by clicking check boxes.

`index.html`

```html
<div id="todo-list"></div>

<script src="./todo_list.js"></script>
<script>
  var todoList = new TodoList();
  todoList.mount('todo-list');
</script>
```

`todo_list.js`

```javascript
var TodoList = Cape.createComponentClass({
  render: function(m) {
    m.ul(function(m) {
      this.items.forEach(function(item) {
        this.renderItem(m, item);
      }.bind(this))
    });
    this.renderForm(m);
  },

  renderItem: function(m, item) {
    m.li(function(m) {
      m.label({ class: { completed: item.done }}, function(m) {
        m.input({ type: 'checkbox', checked: item.done,
          onclick: function(e) { this.toggle(item) } });
        m.space().text(item.title);
      })
    })
  },

  renderForm: function(m) {
    m.form(function(m) {
      m.textField('title', { onkeyup: function(e) { this.refresh() } });
      m.button("Add", {
        disabled: this.val('title') === '',
        onclick: function(e) { this.addItem() }
      });
    });
  },

  init: function() {
    this.items = [
      { title: 'Foo', done: false },
      { title: 'Bar', done: true }
    ];
    this.refresh();
  },

  toggle: function(item) {
    item.done = !item.done;
    this.refresh();
  },

  addItem: function() {
    this.items.push({ title: this.val('title'), done: false });
    this.val('title', '');
    this.refresh();
  }
});
```

Note that we use the `textField` method of markup builder.
This method creates an `input` element of the type `text`.
If we give `'title'` as the first argument of the method,
it is set to the value of `name` attribute of the `input` element and
we can get its value by `this.val('title')`.
You can also set its value with `val` method by giving a new value as second argument.

A working demo is found in the directory [demo/todo_list](demo/todo_list).

### Data stores

When you develop something larger than a tiny widget, you are recommended to
create a *data store* for your Cape.JS component.

The following example illustrates the basic concept of data stores.


`index.html`

```html
<div id="todo-list"></div>

<script src="./todo_item_store.js"></script>
<script src="./todo_list2.js"></script>
<script>
  var todoList = new TodoList2();
  todoList.mount('todo-list');
</script>
```

`todo_item_store.js`

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

`todo_list2.js`

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
        m.input({ type: 'checkbox', checked: item.done,
          onclick: function(e) { this.ds.toggle(item) } });
        m.space().text(item.title);
      })
    })
  },

  renderForm: function(m) {
    m.form(function(m) {
      m.textField('title', { onkeyup: function(e) { this.refresh() } });
      m.button("Add", {
        disabled: this.val('title') === '',
        onclick: function(e) { this.ds.addItem(this.val('title', '')) }
      });
    });
  },

  init: function() {
    this.ds = TodoItemStore.create();
    this.ds.attach(this);
    this.ds.init();
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

A working demo is found in the directory [demo/todo_list2](demo/todo_list2).

## License

Cape.JS is released under [the MIT License](LICENSE).
