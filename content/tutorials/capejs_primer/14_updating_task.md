---
title: "Update the task - Cape.JS Primer"
---

On [the previous lecture](../13_editing_task), I explain how to display the form modifying the task's title.

On this lecture, I'll run the function to update the database by using the form.

----

Before going in to the topic, I introduce the spec like following as the clue on UI.

* It displays the new added form in the initial not the modifying form.
* It deletes the new added form and display the modifying form by clicking "Edit" button.
* It backs to the initial by calling the method `reset()`.

How should we rewrite the class `TodoList`? Let's think it as the practice.

----

I introduce 2 examples of running.

The first one is to change the method `render()` as following.

```javascript
  render(m) {
    m.ul(m => {
      this.ds.tasks.forEach(task => {
        m.li(m => this.renderTask(m, task));
      });
    });
    if (this.editingTask) this.renderUpdateForm(m);
    else this.renderCreateForm(m);
  }
```

<div class="note">
Be careful that the order of <code>this.renderUpdateForm(m)</code> and <code>this.rendercreateForm(m)</code> changes.
</div>

But, it doesn't work well unless it's Cape.JS 1.1.2 or later. Run the command `bower install` by rewritting `bower.json` as following.

```json
  ...
  "dependencies": {
    "capejs": "~1.1.2",
    "bootstrap": "=3.3.4",
    "fontawesome": "~4.3.0",
    "lodash": "~3.9.3"
  }
}
```

<div class="note">
Be careful that the version of <code>bootstrap</code> is <code>=3.3.4</code>. It doesn't work well on <code>3.3.5</code>, the newest version now on August 1st, 2015. For more information, see <a href="http://stackoverflow.com/questions/31467635/sprockets-cant-find-bootstrap-v3-3-5-while-it-finds-v3-3-4">the question and answer</a> that I wrote on Stack Overflow.
</div>

The second one is to change `renderCreateForm()` and `renderUpdateForm()`.

```javascript
  renderCreateForm(m) {
    m.formFor('new_task', { visible: !this.editingTask }, m => {
      m.onkeyup(e => this.refresh());
      m.textField('title').sp();
      m.attr({ disabled: this.val('new_task.title').trim() === '' });
      m.onclick(e =>
        this.ds.createTask(this.val('new_task.title', '')));
      m.btn(`Add task #${ this.ds.tasks.length + 1 }`);
    });
  }

  renderUpdateForm(m) {
    m.formFor('task', { visible: !!this.editingTask }, m => {
      m.onkeyup(e => this.refresh());
      m.textField('title').sp();
      m.attr({ disabled: this.val('task.title').trim() === '' });
      m.btn('Update');
      m.btn('Cancel', { onclick: e => this.reset() });
    });
  }
```

Each one assigns the option `visible` as the second parameter of the method `formFor()` within the first line of the definition of each method. The whole element `<form>` will be non-displayed (`display: none`) when the option receives `false`.

They look same but they're very different. The first one just creates 1 `<form>` but the second one creates 2 elements `<form>`.

I'll explain if I choose the first one on this article.

----

Then, API of Rails application has already showed. The action `update` has already run at `app/controllers/api/tasks_controller.rb` as following.

```ruby
  def update
    task = Task.find(params[:id])
    if task.update_attributes(task_params)
      render text: 'OK'
    else
      render text: 'NG'
    end
  end
```

I created it within [the 9th lecture](../09_updating_the_data_with_ajax) of this tutorial.

So, here is relatively easy.

First, add the method `updateTask()` to the class `TaskStore`.

```javascript
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

<div class="note">
Insert it next to the method <code>createTask()</code>.
</div>

Next, rewrite the method `renderUpdateForm()` of the class `TodoList` as following. (the fourth line from the bottom)

```javascript
  renderUpdateForm(m) {
    m.formFor('task', { visible: !!this.editingTask }, m => {
      m.onkeyup(e => this.refresh());
      m.textField('title').sp();
      m.attr({ disabled: this.val('task.title').trim() === '' });
      m.btn('Update', { onclick: e => this.updateTask() });
      m.btn('Cancel', { onclick: e => this.reset() });
    });
  }
```

Then, run the method `updateTask()` to the class `TodoList`.

```javascript
  updateTask() {
    var task = this.editingTask;
    task.modifying = false;
    this.editingTask = null;
    this.ds.updateTask(task, this.val('edit.title', ''));
  }
```

Make sure it works well on the browser. If you click "Edit" button on right side of "To return books I borrowed" and add the point "。" at the last and click "Update" button and the title of the task will be updated, it's OK.

----

On [the next lexture](../15_deleting_task), I'll run the function to delete the task. What's going to happen?

I hope you, readers, try to think it as the practice.
