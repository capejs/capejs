---
title: "The data store - Cape.JS Primer"
---

On [the previous lecture](../09_updating_the_data_with_ajax)I explained how to update the database by calling the method `ajax` of jQuery in the Cape.JS component.

The theme of this lecture is **the data store** of Cape.JS. It's a very important concept to do Web development in Cape.JS.

----

The following below is the whole source code of `todo_list.es6`.

```javascript
class TodoList extends Cape.Component {
  init() {
    $.ajax({
      type: 'GET',
      url: '/api/tasks'
    }).done(data => {
      this.tasks = data;
      this.refresh();
    });
  }

  render(m) {
    m.ul(m => {
      this.tasks.forEach(task => {
        m.li(m => {
          m.class({ completed: task.done });
          m.label(m => {
            m.onclick(e => this.toggleTask(task));
            m.input({ type: 'checkbox', checked: task.done }).sp();
            m.span(task.title);
          });
        });
      });
    });
  }

  toggleTask(task) {
    $.ajax({
      type: 'PATCH',
      url: '/api/tasks/' + task.id,
      data: { task: { done: !task.done } }
    }).done(data => {
      if (data === 'OK') {
        task.done = !task.done;
        this.refresh();
      }
    });
  }
}
```

It's quiet far from the perfection, it has still 39 lines. It should be better separated.

What part can we separate? In my case, I move he method `init` and the call of the method `$.ajax` in the method `toggleTask` to another class. The component of Cape.JS is "V" of MVC model, that means view, so it's better not have the code related to acquiring the data and updating.

Here is the data store. It's "M" of MVC model.

Now, create a new file `task_store.es6` at the directory `app/assets/javascripts` as following.

```javascript
class TaskStore extends Cape.DataStore {
  constructor() {
    super();
    this.tasks = [];
  }

  refresh() {
    $.ajax({
      type: 'GET',
      url: '/api/tasks'
    }).done(data => {
      this.tasks = data;
      this.propagate();
    });
  }

  toggleTask(task) {
    $.ajax({
      type: 'PATCH',
      url: '/api/tasks/' + task.id,
      data: { task: { done: !task.done } }
    }).done(data => {
      if (data === 'OK') {
        task.done = !task.done;
        this.propagate();
      }
    });
  }
}
```

The data store is literally the storage of the data. Inherit the class `Cape.DataStore` and define it. When the data store is called when it's instanced, initialize the data in the method `constructor()` after calling the method `super()` for sure.

The method `refresh()` of the class `TaskStore` is same as the content in the method `init()` of the class `TodoList`. But, it has 1 difference. `this.refresh()` changes to `this.propagate()`.

In addition, the method `toggleTask()` of the class `TaskStore` is the copy of the same method of the class `TodoList`. But, `this.refresh()` changes to `this.propagate()`.

I'll write about the role of the method `propagate()` of the data store later.

----

Next, rewrite the source code of the class `TodoList`.

```javascript
class TodoList extends Cape.Component {
  init() {
    this.ds = new TaskStore();
    this.ds.attach(this);
    this.ds.refresh();
  }

  render(m) {
    m.ul(m => {
      this.ds.tasks.forEach(task => {
        m.li(m => {
          m.class({ completed: task.done });
          m.label(m => {
            m.onclick(e => this.ds.toggleTask(task));
            m.input({ type: 'checkbox', checked: task.done }).sp();
            m.span(task.title);
          });
        });
      });
    });
  }
}
```

<div class="note">
<code>toggleTask()</code> deletes all of methods.
</div>

The method `init()` is completely different now.

```javascript
    this.ds = new TaskStore();
    this.ds.attach(this);
    this.ds.refresh();
```

It creates the instance of the class `TaskStore` on the first line and set it to its property `ds`. Next, it passes its parameter as the method `attach()` of the object `TaskStore` on the second line.

This second line is the point of today's lecture.

The component attaches the data store to itself and so that it can receive the notice when the data that the data store holds changes.

We call the notice that the data changes to the component attached to the data store is called as propagation.

When I explained `TaskStore` just before, I said that I'll explain the method `propagate()` later. This method uses the propagation.

As the result of the propagation, the method `refresh()` of the component is called. That means, the component is redraw when the data changes.

<div class="note">
You can attach many components to the data store. In that case, it sends the notice of data's change to each component in order. In another viewpoint, you can also say that the components "observe" the data store. In this viewpoint, it means that the component redraws itself when the data that the data store holds changes.
</div>

The method `init()` is written on the third line.

```javascript
    this.ds.refresh();
```

Be careful that it calls the method `refresh()` not the method `refresh()`. That means, the following code is run by the object `TaskStore`.

```javascript
    $.ajax({
      type: 'GET',
      url: '/api/tasks'
    }).done(data => {
      this.tasks = data;
      this.propagate();
    });
```

It calls Ajax call, update the data of the data store (`this.tasks`), and begins propagation. As the result, it calls the component's method `refresh()` and redraw for one time.

It might be complicated a little. Understand the flow of the processing by following the source code carefully.

----

It also changes the method `render()` of the class `TodoList`. Look at the following.

```javascript
    m.ul(m => {
      this.ds.tasks.forEach(task => {
        m.li(m => {
          m.class({ completed: task.done });
          m.label(m => {
            m.onclick(e => this.ds.toggleTask(task));
            m.input({ type: 'checkbox', checked: task.done }).sp();
            m.span(task.title);
          });
        });
      });
    });
```

First, `this.tasks.forEach` changes to `this.ds.tasks.forEach` on the second line. The component stop holding the data itself and it's because it delegates the role to the data store.

In addition, I rewrote `this.toggleTask(task)` to `this.ds.toggleTask(task)` on the sixth line. The method `toggleTask()` moved to the data store calls `this.propagate()` lastly and the data's change does "propagation" to the component.

----

The behavior of the application doesn't change by the change of this lecture. Boot Rails application as same as the precious time and click checkboxes of each tasks to make sure that the values of the column of the task `done` changes.

On [the next lecture](../11_form_for_new_task), I'll explain how to display the form that newly adds the task.
