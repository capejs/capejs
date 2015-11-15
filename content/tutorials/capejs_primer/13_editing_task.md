---
title: "The edit form of the task - Cape.JS Primer"
---

On [the previous lecture](../12_creating_new_task), I created the function to make the new task of TodoList.

On this lecture, I'll show you how to display the form editing the title of the task.

----

Before rewriting the JavaScript program, let's rewrite CSS first.

```css
#todo-list {
  label.completed span {
    color: #888;
    text-decoration: line-through;
  }
  button[disabled] {
    color: #888;
  }
  button + button {
    margin-left: 4px;
  }
  span.modifying {
    font-weight: bold;
    color: #800;
  }
  span.button {
    cursor: pointer;
    background-color: #888;
    color: #fff;
    margin-left: 4px;
    padding: 4px 8px;
    font-size: 60%;
  }
}
```

<div class="note">
Insert lines below the line <code>button + button {</code> except the last line.
</div>

----

Let'e begin. Open `todo_list.es6`. First, rewrite the method `init()` of the class `TodoList` as following. (add the fourth line)

```javascript
  init() {
    this.ds = new TaskStore();
    this.ds.attach(this);
    this.editingTask = null;
    this.ds.refresh();
  }
```

It sets `null` to the attribute named as `editingTask`. As you can see later, it holds the task (the object) during rewriting.

Next, rewrite the method `render()` as following. ( insert the second line from the bottom)

```javascript
  render(m) {
    m.ul(m => {
      this.ds.tasks.forEach(task => {
        m.li(m => this.renderTask(m, task));
      });
    });
    this.renderCreateForm(m);
    this.renderUpdateForm(m);
  }
```

In addition rewrite the method `renderTask()`. (add the sixth, ninth, tenth lines)

```javascript
  renderTask(m, task) {
    m.class({ completed: task.done });
    m.label(m => {
      m.onclick(e => this.ds.toggleTask(task));
      m.input({ type: 'checkbox', checked: task.done }).sp();
      m.class({ modifying: task.modifying });
      m.span(task.title);
    });
    m.onclick(e => this.editTask(task));
    m.span('Edit', { class: 'button' });
  }
```

Add 2 methods of following below the method existing `renderCreateForm()`.

```javascript
  renderUpdateForm(m) {
    m.formFor('task', m => {
      m.onkeyup(e => this.refresh());
      m.textField('title').sp();
      m.attr({ disabled: this.val('task.title').trim() === '' });
      m.btn('Update');
    });
  }

  editTask(task) {
    if (this.editingTask) this.editingTask.modifying = false;
    task.modifying = true;
    this.editingTask = task;
    this.val('task.title', task.title);
    this.refresh();
  }
```

When you clock the "Edit" button displaying on the right side of each task's title, it calles the method `editTask().

This method changes "modifying flag" of the task that you want to modify to  `true` and sets it to the attribute `editingTask` of the component `TodoList`. And then, it redraws the component `TodoList` by inserting the value of the attribute `title` to the modifying form's filed `title`.

----

So, Let's check the operation on the browser. First, the initial condition on the browser is here.

![Screen capture](/capejs/images/capejs_primer/todo_list14.png)

It changes like following by clicking "Edit" button on the right side of "To buy cat's feed".

![Screen capture](/capejs/images/capejs_primer/todo_list15.png)

The reason why the label turns to red is because "modifying flag" is enabled on this task. There is a script in the method `renderTask()`like following.

```javascript
      m.class({ modifying: task.modifying });
      m.span(task.title);
```

As the result, it creates HMTL tag like `<span class="modifying">To buy cat's feed </span>`and it turns to red by the CSS's effect wrote in the beginning.

----

Let's improve UI a little bit more. Let's make it be able to cancel modifying the task. Re write the method `renderUpdateForm()` as following. (add the third line from the bottom)

```javascript
  renderUpdateForm(m) {
    m.formFor('task', m => {
      m.onkeyup(e => this.refresh());
      m.textField('title').sp();
      m.attr({ disabled: this.val('task.title').trim() === '' });
      m.btn('Update');
      m.btn('Cancel', { onclick: e => this.reset() });
    });
  }
```

And then, add the method `reset()` under the method `editTask()`.

```javascript
  reset() {
    if (this.editingTask) this.editingTask.modifying = false;
    this.editingTask = null;
    this.val('task.title', '');
    this.refresh();
  }
```

This method makes `false` "modifying flag" of the modifying task and empties the field `title` of modifying form.

The screen of the browser will be like following.

![Screen capture](/capejs/images/capejs_primer/todo_list16.png)

It backs to the initial screen by clicking "Cancel" button after clicking some "Edit" buttons.

----

Let's keep improving. Let's make it be able to cancel modifying the task when you click "Edit" button next to the same task 2 times in row.

Rewrite the method `editTask()` like following.

```javascript
  editTask(task) {
    if (this.editingTask === task) {
      this.reset();
    }
    else {
      if (this.editingTask) this.editingTask.modifying = false;
      task.modifying = true;
      this.editingTask = task;
      this.val('task.title', task.title);
      this.refresh();
    }
  }
```

Let's make sure it works well on the browser. If you click "Edit" button on the right side of "To buy cat's feed" 2 times in row and the screen backs to the initial one, it's OK.

----

That's all for today.

On [the next lecture](../14_updating_task), I'll run the processing to update the database by Ajax request from this form.
