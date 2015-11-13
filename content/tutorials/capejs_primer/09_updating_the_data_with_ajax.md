---
title: "Updating the data with Ajax - Cape.JS Primer"
---

On [the previous lecture](../08_assignment_of_event_handler), I explained the event handler. It's the event handler that the function that users run by some actions (like clicking) to HTML element (like the checkbox).

On this lecture, I explain how to update the database by using Ajax call in the event handler.

----

Before I explain the point, I use the style sheet to make it easier to understand the work of the event handler visually.

Create a new file `todo_list.scss` at the directory `app/assets/stylesheets` on the text editor.

```css
#todo-list {
  label.completed span {
    color: #888;
    text-decoration: line-through;
  }
}
```

<div class="note">
The file's extension `.scss` means that this file is written in the style of [Sass/SCSS](http://sass-lang.com/guide). SCSS is the style sheet language expanded CSS and it's converted into CSS by Rails automatically. The first character of SCSS is that it can nest the selector. The example above, it sets the style of the element `span` within the element `label` of the class `completed` which is inside of element with ID `todo-list`.
</div>

And, rewrite the method `render()` of the component `TodoList`. Rewrite the part of `app/assets/javascripts/todo_list.es6 as following on the text editor. (add 1 line in front of `m.label`)

```javascript
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
```

The line added is following.

```javascript
m.class({ completed: task.done });
```

As the result, in the case of the task which element `done` is "true", it sets the class `completed` to the element `label`. Boot the Rails application and open `http://localhost:3000/` on the browser. The display will be like following.

![Screen capture](/capejs/images/capejs_primer/todo_list06.png)

By clicking the first checkbox here, the warning dialog "1" displays. So click the "OK" button. Make sure that the style of strings of "To buy cat's feed" doesn't change. (The color doesn't change to gray and strike-through doesn't display.)

----

Next, rewrite the method `toggleTask()` of the component `TodoList`. Rewrite the part of `app/assets/javascripts/todo_list.es6` as following on the text editor.

```javascript
  toggleTask(task) {
    task.done = !task.done;
    this.refresh();
  }
```

The last goal of this lecture is to update the database with Ajax but we haven't got there yet. First, we update the data that the component `TodoList` has and just retry the rendering of the component.

Reload the browser and click the first checkbox. It's different from the last time, make sure that the style of strings of "To buy cat's feed" changes depending on checks. The parameter `task` of the method `toggleTask` refers the specific task included the task list that the component has. By calling `this.refresh()` after reversing the value of the attribute `done`, the style of the task's title changes because the whole component is redraw.

<div class="note">
The reader who gets used to "virtual DOM" but not to jQuery may have trouble in running this way. When you run this kind of things in jQuery, change the style of HTML element directly by this kind of code `$(e.target).parent().toggleClass("completed");`. You may worry about the performance by writting this, it's "virtual DOM" that makes you relieved. The library `virtual-dom` which is the foundation of Cape.JS caliculates the difference between virtual DOM and real DOM and redraw only necessary parts to be changed.
</div>

----

Next, run API on Rail. First, rewrite `config/routes.rb` as following.

```ruby
Rails.application.routes.draw do
  root 'top#index'

  namespace :api do
    resources :tasks, only: [ :index, :update ]
  end
end
```

The changed place id 3 lines from the bottom. (insert comma and `:update`.)

Then, rewrite `app/controllers/api/tasks_controller.rb` as following.

```ruby
class Api::TasksController < ApplicationController
  def index
    @tasks = Task.order(id: :asc)
  end

  def update
    task = Task.find(params[:id])
    if task.update_attributes(task_params)
      render text: 'OK'
    else
      render text: 'NG'
    end
  end

  private
  def task_params
    params.require(:task).permit(:title, :done)
  end
end
```

<div class="note">
It's a long story if I start explaining this meaning of the change. If you have developed Rails, accept the source code once.

You can learn the methods like `params`、`find`、`update_attributes`、`render` by the textbooks and tutorials. You can search on Internet by using the keyword " Strong Parameters" for the role of the method `task_params`.
</div>

----

Lastly, mount the method `toggleTask()` of the component `TodoList`.

```javascript
  toggleTask(task) {
    $.ajax({
      type: 'PATCH',
      url: `/api/tasks/${task.id}`,
      data: { task: { done: !task.done } }
    }).done(data => {
      if (data === 'OK') {
        task.done = !task.done;
        this.refresh();
      }
    });
  }
```

It accesses to API by the method `PATCH` which means "updating the data" in Rails. If the value of `task.id` is 1 and `task.done` is "false", it sends the message `{ task: done: true }` to URL parameter `/api/tasks/1`.

<div class="note">
Be careful to write like `` `/api/tasks/${task.id}` ``. The string surrounded by the back quote in ECMAScript6 mounts the expression (interpolation). That means, it converts the part <code>${task.id}</code> into the value <code>task.id</code> (like the integer "1" ) and mounts.
</div>

Rails application recieves it and updates the database and returns the string "OK". On the side of Cape.JS receives that and set it into the parameter `data` of the method `done`. So, the conditional expression of if statement comes into effect and reverses the attribute `done` . Then, it redraws the whole component by calling `this.refresh()`.

Then, make sure that it works well. Reload the browser, check the first checkbox. Then, the display will be like following.

![Screen capture](/capejs/images/capejs_primer/todo_list07.png)

Reload the browser again now. If there is still the check of the first checkbox, that means the data base id updated.

----

That's all for today. It might be a bit difficult because I abbreviate some explanations. I'm sorry.

On [Next lecture](../10_the_data_store), I'll explain the data store.
