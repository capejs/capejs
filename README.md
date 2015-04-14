# CapeJS

CapeJS is a lightweight Javascript UI framework based on [virtual-dom](https://github.com/Matt-Esch/virtual-dom) of Matt-Esch.

* **Small but full stack:** CapeJS is consists of three basic but powerful classes; *Component, DataStore,* and *Router.* You can utilize them to create web widgets or single-page applications (SPAs).
* **Virtual DOM:** CapeJS takes advantage of [virtual-dom](https://github.com/Matt-Esch/virtual-dom) for high performance UI rendering. You don't have to rely on *jQuery* for DOM manipulation anymore.
* **Concise syntax:** The *markup builder* helps you to construct HTML DOM trees with its simple, easy to learn syntax. You can add a `div` element by calling markup builder's `div` method, for example.

The architecture and terminology of CapeJS are strongly influenced by [React](https://github.com/facebook/react),  [Riot](https://github.com/muut/riotjs) and [Ruby on Rails](https://github.com/rails/rails).

## Examples

### Hello World

```html
<h1>Greeting from CapeJS</h1>
<div id="hello-message" data-name="World"></div>

<script>
  var HelloMesage = Cape.createComponentClass({
    render: function(m) {
      m.div('Hello, ' + this.root.data.name + '!')
    }
  });

  var component = new HelloMesage();
  component.mount('hello-message');
</script>
```

This example will insert `<div>Hello, World!</div>` into the `div#hello-message` element.

First of all, we *must* define the `render` method for CapeJS components.
The role of this method is to create a *virtual* DOM tree.
CapeJS updates the *real* DOM tree of browsers using this virtual tree.

The `render` method should take an argument, which is called *markup builder*.
When you call its `div` method, a `div` node is added to the virtual DOM tree.
The markup builder has corresponding methods for all valid tag names of HTML5,
such as `p`, `span`, `br`, `section`, `video`, etc.

You can call `this.root` to get the node which the component was mounted on.
And you can access to `data-name` attributes of the `root` node by
`this.root.data.name`.

A working demo is found in the directory [demo/hello_message](demo/hello_message).

### Hello World 2

```html
<h1>Greeting from CapeJS</h1>
<div id="hello-message" data-name="World"></div>

<script>
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

  var component = new HelloMesage2();
  component.mount('hello-message');
</script>
```

This example will generate `<p>Hello, <strong>World!</strong></p>`.

Note that `strong` method takes a function, which create the content of `strong` element.
In this way you can create a deeply-nested DOM tree.

### Click Counter

```html
<div id="click-counter"></div>

<script>
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

  var counter = new ClickCounter();
  counter.mount('click-counter');
</script>
```

On this example, your will see the number which gets incremented each time you click on it.

Note that we give the second argument to the `div` method:

```javascript
        m.div(String(this.counter), {
          class: 'counter',
          onclick: function(e) { this.increment() }
        })
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

```html
<div id="click-counter"></div>

<script>
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
          disabled: this.getValue('title') === '',
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
      this.items.push({ title: this.getValue('title'), done: false });
      this.setValue('title', '');
      this.refresh();
    }
  });

  var component = new TodoList();
  component.mount('todo-list');
</script>
```

On this example, your can add a todo item from a HTML form and toggle the
`completed` property of todo items by clicking check boxes.

Note that we use the `textField` method of markup builder.
This method creates an `input` element of the type `text`.
If we give `'title'` as the first argument of the method,
it is set to the value of `name` attribute of the `input` element and
we can get its value by `this.getValue('title')`.

A working demo is found in the directory [demo/todo_list](demo/todo_list).

## Examples (ES6 version)

If you want to write more concisely, try to define class using ECMAScript 6 (ES6) syntax.

### Hello World

```javascript
class HelloMessage extends Cape.Component {
  render(m) {
    m.p(`Hello ${this.root.data.name}!`)
  }
}

var component = new HelloMessage();
component.mount('hello-message');
```

A working demo is found in the directory [es6-demo/hello_message](es6-demo/hello_message).

You must have `npm` and `babel-core` to see this demo page.
You must also have `browserify` to convert `.es6` file to `.js` file.

See [es6-demo/README.md](es6-demo/README.md) for details.
