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

In the JavaScript, `m` works as a *markup builder*.
If you call its `div` method, you can add a `div` element to the component.

You can call `this.root` to get the element which the component was mounted on.
Note that you can access to `data-name` attributes of the `root` element by
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

This _associative array_ represents the attributes of `div` element.
We can attach a handler (function) to the `click` event for this element like this.

On the code of event handlers, `this` denotes the component itself.
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
