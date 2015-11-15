---
title: "Let the component have the date - Cape.JS Primer"
---

On [the previous lecture](../05_rails_integration2), I explained the step to mount Cape.JS to Ruby on Rails.

The theme of this lecture is relation of the component and the data.

----

Our goal is to develop the easy Web "To-do list" application. It handles the collection of "tasks (things to do). It's better to express this kind of data by **object**'s array.

<div class="note">
The "object" here is JavaScript object. JavaScript object has characters of Ruby's hush. For example, when you write <code>obj = { x: 1, y: 2 }; obj["z"] = 3</code>, the object <code>obj</code> holding a pair of 3 properties and value is made. You can also <code>obj["z"]</code> as <code>obj.z</code>.
</div>

Let's express the object like following of each task.:

```javascript
{ title: "Buy cat food", done: false }
```

Then, the array of the object becomes "list of tasks".

```
[
  { title: "Buy cat food", done: false },
  { title: "Go dentist", done: true }
]
```

----

By the way, I'll introduce how to update Cape.JS before I'll come to the point.

Today（2015/06/07）、[Cape.JS 1.1.0](https://github.com/oiax/capejs/releases/tag/v1.1.0) was released. It's better to use the newest one so upgrade Cape.JS of "To-do list".

Open <code>bower.json</code> on the text editor,

```
    "capejs": "~1.0.0",
```

rewrite above to the one following below.

```
    "capejs": "~1.1.0",
```

Then, run `bower install` on terminal.

----

So, let's let the component of Cape.JS have the array of tasks. Rewrite `app/assets/javascripts/todo_list.es6` as following on the text editor.

```javascript
class TodoList extends Cape.Component {
  init() {
    this.tasks = [
      { title: "Buy cat food", done: false },
      { title: "Go dentist", done: true }
    ];
    this.refresh();
  }

  render(m) {
    m.ul(m => {
      this.tasks.forEach(task => {
        m.li(m => {
          m.label(m => {
            m.input({ type: 'checkbox', checked: task.done }).sp();
            m.span(task.title);
          });
        });
      });
    });
  }
}
```

When you define the name of instance method as `init` to the component class, this method is run just after the component is mount.

I set the array of tasks to the property `tasks` here. It calls the method `refresh` at the end of the method. It indicates to redraw to the component. As the result, it calls the method `render` and the screen of the browser changes. If the method `init` doesn't exist on the component, it calles `this.refresh()` in the back. But if you define the method `init`, be careful that the screen of the browser doesn't display anything unless it calls `this.refresh()` even if it mounts the component.

<div class="note">
Does Cape.JS always call the method <code>init</code> after the method, doesn't it? That is because Ajax call is supposed to run in the method <code>init</code> and the date is supposed to be initialized. Ajax call is literally "synchronous" so it finishes after running the method <code>init</code>. So, the data won't be organized even calling <code>this.refresh()</code> after the method <code>init</code>. This situation around here will be clear as you keep studying.
</div>

The content of the method `render` changes very much. It calls the method `forEach` to the array `this.tasks` and runs loop processing. The object like the parameter like `{ title: " To buy cat's feed ", done: false }` is set to the parameter `task` in order. Then, it creates checkbox and text by referring the value this `task`.

```javascript
            m.input({ type: 'checkbox', checked: task.done }).sp();
            m.span(task.title);
```

<div class="note">
Be careful that you can write `task.title` insted of `task["title"]` in JavaScript.
</div>

So, let's try whether it works well. Reload the browser. When the screen like below displays, it's OK.

![Screen capture](/capejs/images/capejs_primer/todo_list03.png)

----

It's like more application. That's all for today. On [the next lecture](../07_initializing_the_date_with_ajax), I'll explain how to initialize the data of the component by using Ajax.
