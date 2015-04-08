# CapeJS

CapeJS is a lightweight Javascript UI library based on [virtual-dom](https://github.com/Matt-Esch/virtual-dom).

## Examples

### Hello World

```html
<h1>Greeting from CapeJS</h1>
<div id="hello-message" data-name="World"></div>

<script>
  var HelloMesage = Cape.createComponentClass({
    render: function() {
      return this.markup(function(m) {
        m.div('Hello ' + this.root.data.name + '!')
      })
    }
  });

  var component = new HelloMesage();
  component.mount('hello-message');
</script>
```

This example will insert `<div>Hello World!</div>` into the `div#hello-message` element.

First of all, we *must* define the `render` method for CapeJS components.
The role of this method is to create a *virtual* DOM tree.
CapeJS updates the *real* DOM tree of browsers using this virtual tree.

Within the `render` method, we can use `this.markup` method.
It takes a function (*callback*) and returns a virtual DOM tree.

A callback for the `markup` method should have an argument.
In the example above, the `m` is the argument and is called *markup builder*.
If you call its `div` method, you can add a `div` node to the virtual DOM tree.
The markup builder has methods for all valid tag names of HTML5,
such as `p`, `span`, `br`, `section`, `video`, etc.

You can call `this.root` to get the node which the component was mounted on.
And you can access to `data-name` attributes of the `root` node by
`this.root.data.name`.

A working demo is found in the directory `demo/hello_message`.

### Click Counter

```html
<div id="click-counter"></div>

<script>
  var ClickCounter = Cape.createComponentClass({
    render: function() {
      return this.markup(function(m) {
        m.div(String(this.counter), {
          class: 'counter',
          onclick: function(e) { this.increment() }
        })
      })
    },

    init: function() {
      this.counter = 0;
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

Within the code of event handlers, `this` denotes the component itself.
So you can call its `increment` method by `this.increment()`.

A working demo is found in the directory `demo/click_counter`.

### Todo List

```html
<div id="click-counter"></div>

<script>
  var TodoList = Cape.createComponentClass({
    render: function() {
      return this.markup(function(m) {
        m.ul(function(m) {
          this.items.forEach(function(item) {
            this.renderItem(m, item);
          }.bind(this))
        });
        this.renderForm(m);
      })
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

A working demo is found in the directory `demo/todo_list`.
