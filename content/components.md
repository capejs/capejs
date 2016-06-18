---
title: "Components"
---

[Hello World](#hello-world) -
[ECMAScript 6](#es6) -
[Building Virtual DOM Tree](#dom-tree) -
[Click Counter](#click-counter) -
[Shortcut Methods](#shortcut-methods) -
[HTML Styles](#html-styles) -
[Todo List](#todo-list) -
[Mixins](#mixins)

<a class="anchor" id="hello-world"></a>
### Hello World

The following example will insert `<div>Hello, World!</div>` into the `div#hello-message` element.

#### index.html

```html
<h1>Greeting from Cape.JS</h1>
<div id="hello-message" data-name="World"></div>

<script src="./hello_message.js"></script>
<script>
  var component = new HelloMesage();
  component.mount('hello-message');
</script>
```

#### hello_message.js

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

You can find the source code of working demo on
https://github.com/capejs/capejs/tree/master/demo/hello_message.

<a class="anchor" id="es6"></a>
### ECMAScript 6

If you want to write more concisely, try to define class using ECMAScript 6 (ES6) syntax.

#### hello_message.es6

```javascript
class HelloMessage extends Cape.Component {
  render(m) {
    m.div(`Hello ${this.root.data.name}!`)
  }
}
```

You can find the source code of working demo on
https://github.com/capejs/capejs/tree/master/es6-demo/hello_message.

You must have `npm` and `babel-core` to see this demo page.
You must also have `browserify` to convert `.es6` file to `.js` file.

See https://github.com/capejs/capejs/tree/master/es6-demo/README.md for details.

<a class="anchor" id="dom-tree"></a>
### Building Virtual DOM Tree

#### index.html

```html
<h1>Greeting from Cape.JS</h1>
<div id="hello-message" data-name="World"></div>

<script src="./hello_message2.js"></script>
<script>
  var component = new HelloMesage2();
  component.mount('hello-message');
</script>
```

#### hello_message2.js

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

All methods of markup builder can be chained. So, you can rewrite the above code as follows:

```javascript
class HelloMesage2 extends Cape.Component {
  render(m) {
    m.p(m =>
      m.text('Hello, ').strong(m =>
        m.text(this.root.data.name).text('!');
      )
    )
  }
}
```

Note that you can omit braces when the arrow function has only a single expression.
See MDN's [Arrow functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)
<i class="fa fa-external-link"></i> for details.

<a class="anchor" id="click-counter"></a>
### Click Counter

On this example, your will see the number which gets incremented each time you click on the surrounding `div` box.

#### index.html

```html
<div id="click-counter"></div>

<script src="./click_counter.js"></script>
<script>
  var counter = new ClickCounter();
  counter.mount('click-counter');
</script>
```

#### click_counter.js

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

You can find the source code of working demo on
https://github.com/capejs/capejs/tree/master/demo/click_counter.


<a class="anchor" id="shortcut-methods"></a>
## Shortcut Methods

Cape.JS provides some shortcut methods for the ease of programming, such as
`#class`, `#disabled`, `#onclick`, _etc._
These methods preset the value of attributes for the element which
will be created nextly.

In the previous example, we wrote like this:

```javascript
    m.div(String(this.counter), {
      class: 'counter',
      onclick: function(e) { this.increment() }
    })
```

With shortcut methods, we can write it more concisely:

```javascript
    m.class('count');
    m.onclick(function(e) { this.increment() });
    m.div(String(this.counter);
```

Because all methods of markup builder are *chainable,*
you can also write like this:

```javascript
    m.class('count')
      .onclick(function(e) { this.increment() })
      .div(String(this.counter);
```

The shortcut methods affect only the very element which will be created nextly.
In the following example, the second `<div>` element will have no `class` attribute:

```javascript
    m.class('greeting');
    m.div('Hello, World!');
    m.div('My name is Cape.JS.');
```

See [MarkupBuilder#class()](../api/markup_builder/#class) and
[MarkupBuilder#onclick()](../api/markup_builder/#onblur-onfocus-etc) for details.

<a class="anchor" id="html-styles"></a>
## HTML Styles

When you want to change the style of an element, you have two choices.
The first one is to give the `style` option to `div` method etc.
The second one is to use the `#css` method to preset styles for the
element which will be created nextly.

The following example creates a `<span>` element whose text is rendered with red color:

```javascript
m.span('Hello, World!', style: { color: 'red' });
```

Note that you should give an object as the value of `style` option.
You *can not* write like this:

```javascript
m.span('Hello, World!', style: 'color: red');
```

Note also that you should use *camel case* for the style names:

```javascript
m.span('Hello, World!', style: { fontWeight: 'bold' });
```

Using the `#css` method, you can rewrite the last example as follows:

```javascript
m.css({ fontWeight: 'bold' }).span('Hello, World!');
```

Alternatively, you can pass two strings (style name and its value) to the `#css` method:

```javascript
m.css('fontWeight', 'bold').span('Hello, World!');
```

<a class="anchor" id="todo-list"></a>
## Todo List

On this example, your can add a todo item from a HTML form and toggle the
`completed` property of todo items by clicking check boxes.

#### index.html

```html
<div id="todo-list"></div>

<script src="./todo_list.js"></script>
<script>
  var todoList = new TodoList();
  todoList.mount('todo-list');
</script>
```

#### todo_list.js

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
        m.onclick(function(e) { this.toggle(item) })
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
    this.items.push({ title: this.val('item.title'), done: false });
    this.val('item.title', '');
    this.refresh();
  }
});
```

Note that we use the `formFor` method of markup builder to render an HTML form.
This method takes a string as the first argument, and sets the `name` attribute
of the form to it.

The `textFiled` method creates an `input` element of the type `text`.
If we give `'title'` as the first argument of the method,
the value of `name` attribute of this `input` element is set to `item.title`.

We can get its value by `this.val('item.title')`.
You can also set its value with `val` method by giving a new value as the second argument.

You can find the source code of working demo on
https://github.com/capejs/capejs/tree/master/demo/todo_list.

As for the `#btn()` method, see [MarkupBuilder#btn()](../api/markup_builder/#btn).

<a class="anchor" id="mixins"></a>
### Mixins

When you build a large application with many similar components,
you will want to extract common methods to *mixins*,
objects that contain a combination of methods.

The following example illustrates how to create *mixins* and incorporate them
into component classes.

#### index.html

```html
<div id="main"></div>

<script src="./form_controls.js"></script>
<script src="./simple_form.js"></script>
<script>
  var simple_form = new SimpleForm();
  simple_form.mount('main');
</script>
```

#### form_controls.js

```javascript
var FormControls = {
  renderTextField: function(markup, fieldName, labelText) {
    markup.div({ class: 'form-group' }, function(m) {
      m.labelFor(fieldName, labelText);
      m.textField(fieldName, { class: 'form-control' });
    })
  },

  renderTextareaField: function(markup, fieldName, labelText) {
    markup.div({ class: 'form-group' }, function(m) {
      m.labelFor(fieldName, labelText);
      m.textareaField(fieldName, { class: 'form-control' });
    })
  },

  renderButtons: function(markup) {
    markup.div({ class: 'form-group' }, function(m) {
      m.btn('Submit', { class: 'btn btn-primary' });
      m.btn('Cancel', { class: 'btn btn-default' });
    })
  }
}
```

#### simple_form.js

```javascript
var SimpleForm = Cape.createComponentClass({
  render: function(m) {
    m.p(function(m) {
      m.formFor('user', function(m) {
        this.renderTextField(m, 'family_name', 'Family Name');
        this.renderTextField(m, 'given_name', 'Given Name');
        this.renderTextareaField(m, 'remarks', 'Remarks');
        this.renderButtons(m);
      })
    })
  }
});

Cape.merge(SimpleForm.prototype, FormControls);
```

The `Cape.merge` method imports all properties (methods) of `FormControls`
into `SimpleForm.prototype`.

Note that `Cape.merge` does not rewrite existing properties of `SimpleForm.prototype`
so that you can override one or more methods of `FormControls`
within the definition of `SimpleForm` class.

You can find the source code of working demo on
https://github.com/capejs/capejs/tree/master/demo/mixins.
