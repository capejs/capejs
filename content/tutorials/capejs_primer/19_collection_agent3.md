---
title: "Collection agent (3) - Cape.JS Primer"
---

This is last lecture to upgrade out "Todo list" application to Cape.JS 1.2. On [the precious lecture](../18_collection_agent2), I explained how to make the function to toggle the flag "done" of the task and the function to delete the task move.

On this time, I'll recreate the function to add new task and the function to change the title of existing task.

----

First, back to the commented out part of the method `render()` of the class `TodoList` (`app/assets/javascripts/todo_list.es6`) temporally.

```javascript
  render(m) {
    m.ul(m => {
      this.agent.objects.forEach(task => {
        m.li(m => this.renderTask(m, task));
      });
    });
    if (this.editingTask) this.renderUpdateForm(m);
    else this.renderCreateForm(m);
  }
```

The third and second line from the bottom.

Next, modify the method `renderCreateForm()` of the class `TodoList` as same. The following below is the one before modifying.

```javascript
  renderCreateForm(m) {
    m.formFor('new_task', m => {
      m.onkeyup(e => this.refresh());
      m.textField('title', { value: this.val('new_task.title') }).sp();
      m.attr({ disabled: this.val('new_task.title').trim() === '' });
      m.onclick(e =>
        this.ds.createTask(this.val('new_task.title', '')));
      m.btn(`Add task #${ this.ds.tasks.length + 1 }`);
    });
  }
```

The one after modifying is following.

```javascript
  renderCreateForm(m) {
    m.formFor('new_task', m => {
      m.onkeyup(e => this.refresh());
      m.textField('title', { value: this.val('new_task.title') }).sp();
      m.attr({ disabled: this.val('new_task.title').trim() === '' });
      m.onclick(e =>
        this.agent.createTask(this.val('new_task.title', '')));
      m.btn(`Add task #${ this.agent.objects.length + 1 }`);
    });
  }
```

I modified 2 points. I replaced `this.ds` to `this.agent` on the fourth line from the bottom and `this.ds.tasks` to `this.agent.objects` on the third line from the bottom.

In addition, modify the method `updateTask()` of the class `TodoList`. Next one is before modifying.

```javascript
  updateTask() {
    var task = this.editingTask;
    task.modifying = false;
    this.editingTask = null;
    this.ds.updateTask(task, this.val('task.title', ''));
  }
```

The one after modifying is following.

```javascript
  updateTask() {
    var task = this.editingTask;
    task.modifying = false;
    this.editingTask = null;
    this.agent.updateTask(task, this.val('task.title', ''));
  }
```

The modifying the class `TodoList` is done.

----

Next, add the method `createTask()` and `updateTask()` to the class `TaskCollectionAgent`. (`app/assets/javascripts/task_collection_agent.es6`)

```javascript
  createTask(title) {
    this.create({ task: { title: title } });
  }

  updateTask(task, title) {
    this.update(task.id, { task: { title: title } })
  }
```

Now, I guess "Todo list" application moves right. Make sure it works well.

Run next command on the terminal and boot the server after initialize the database.

```text
bin/rake db:reset
bin/rails s
```

And then, open `http://localhost:3000` on the browser, the screen will be like following.

![Screen capture](/capejs/images/capejs_primer/todo_list17.png)

When you enter some string in the text entering form and click the button " Add task #5", the new task is recorded. Also, when you click "Edit" button on right side of some tasks, it sets the title of the task in the text entering form. And, rewrite the tile somehow and click "Update" button, the title of the task is changed. When you click "Cancel" button instead of "Update" button, the test entering form is back to the initialize status.

----

For some references, the method `createTask()` and `updateTask()` of the class `TaskStore` is wrote like following.

```javascript
  createTask(title) {
    $.ajax({
      type: 'POST',
      url: '/api/tasks',
      data: { task: { title: title } }
    }).done(data => {
      if (data === 'OK') this.refresh();
    });
  }

  updateTask(task, title) {
    $.ajax({
      type: 'PATCH',
      url: '/api/tasks/' + task.id,
      data: { task: { title: title } }
    }).done(data => {
      if (data === 'OK') {
        task.title = title;
        this.propagate();
      }
    });
  }
```

Compare with the same method of the class `TaskCollectionAgent`. It's much shorter.

----

Now, delete source code because the class `TaskStore` is not necessary anymore.

```text
rm app/assets/javascripts/task_store.es6
```

Our "Todo list" application is now able to respond Cape.JS 1.2.

On [Next lecture](../20_reordering1), I'll add the function to change the showing order of the task on the different viewpoint.
