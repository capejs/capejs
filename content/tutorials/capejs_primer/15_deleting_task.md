---
title: "Delete the task - Cape.JS Primer"
---

On [the precious lecture](../14_updating_task), I run the function to update the title of the task.

On this lecture, it's about deleting the task. Now, we have every CRUD function.

----

First, I create the API. Rewrite `config/routes.rb` as following.

```ruby
Rails.application.routes.draw do
  root 'top#index'

  namespace :api do
    resources :tasks, only: [ :index, :create, :update, :destroy ]
  end
end
```

I added :destroy` after `:update` on the third line from the bottom.

Next, the controller. Add the action `destroy` to `app/controllers/api/tasks_controller.rb`.

```ruby
  def destroy
    Task.find(params[:id]).destroy
    render text: 'OK'
  end
```

Insert it before the definition of the action `update` and the declaration `private`.

----

Let's move on the running JavaScript. Rewrite the method `renderTask() of `app/assets/javascripts/todo_list.es6`.

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
    m.onclick(e => this.ds.destroyTask(task));
    m.span('Delete', { class: 'button' });
  }
```

I added the second and third lines from the bottom. It calls the method `destroyTask()` as the data store by clicking "Delete" button.

Next, run this method. Add the content `destroyTask()` as following on `app/assets/javascripts/task_store.es6`.

```javascript
  destroyTask(task) {
    $.ajax({
      type: 'DELETE',
      url: '/api/tasks/' + task.id
    }).done(data => {
      if (data === 'OK') this.refresh();
    });
  }
```

It's finished. Make it sure it works well. The top screen will changes like following.

![Screen capture](/capejs/images/capejs_primer/todo_list17.png)

It deletes the task by clicking "Delete" button on right side of "To go dentist".

![Screen capture] (/capejs/images/capejs_primer/todo_list18.png)

----

Now, there are more mistakes if you can delete the task just by clicking "Delete" button. Let's display the warning message.

Rewrite `renderTask()` as following.

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
    m.onclick(e => {
      if (confirm('Are you sure you want to delete this task?'))
        this.ds.destroyTask(task);
    });
    m.span('Delete', { class: 'button' });
  }
```

The lines from the third to sixth from the bottom are changed. They are the method of JavaScript displaying the confirm dialog `confirm()`.

Make sure it works well on the browser. (abbreviate the lecture of screen capture) The dialog saying "Are you sure you want to delete this task?" by clicking "Delete" button. If you click "Cancel", it does nothing. If you click "OK", it deletes the task.

----

It might be easy this time for who have read this selections carefully.

On [Next lecture](../16_capejs_1_2), I'll introduce the new version 1.2 of Cape.JS.
