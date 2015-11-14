---
title: "Changing displaying order (1) - Cape.JS Primer"
---

3 lectures from this time, I'll add the function to change the displaying order of the task to our "Todo list" application.

----

For preparation, organize the source code a little. Look at the code of the method `renderTask()` of the class `TodoList.

```javascript
  renderTask(m, task) {
    m.class({ completed: task.done });
    m.label(m => {
      m.onclick(e => this.agent.toggleTask(task));
      m.input({ type: 'checkbox', checked: task.done }).sp();
      m.class({ modifying: task.modifying });
      m.span(task.title);
    });
    m.onclick(e => this.editTask(task));
    m.span('Edit', { class: 'button' });
    m.onclick(e => {
      if (confirm('Are you sure you want to delete this task?'))
        this.agent.destroyTask(task);
    });
    m.span('Delete', { class: 'button' });
  }
```

Let's separate it because it's too long.

```javascript
  renderTask(m, task) {
    m.class({ completed: task.done });
    m.label(m => {
      m.onclick(e => this.agent.toggleTask(task));
      m.input({ type: 'checkbox', checked: task.done }).sp();
      m.class({ modifying: task.modifying });
      m.span(task.title);
    });
  }

  renderButtons(m, task) {
    m.onclick(e => this.editTask(task));
    m.span('Edit', { class: 'button' });
    m.onclick(e => {
      if (confirm('Are you sure you want to delete this task?'))
        this.agent.destroyTask(task);
    });
    m.span('Delete', { class: 'button' });
  }
```

Rewrite the code of the method `render()`. This is the one before rewriting.

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

Rewrite the fourth line.

```javascript
  render(m) {
    m.ul(m => {
      this.agent.objects.forEach(task => {
        m.li(m => {
          this.renderTask(m, task);
          this.renderButtons(m, task);
        });
      });
    });
    if (this.editingTask) this.renderUpdateForm(m);
    else this.renderCreateForm(m);
  }
```

<div class="note">
When the content of arrow function of ECMAScript6 includes many statements, it needs to be surrounded by brace. (`{}`)
</div>

----

Let's get the implementation. First, set the button to move up and down.

```javascript
  renderButtons(m, task) {
    m.onclick(e => this.editTask(task));
    m.span('Edit', { class: 'button' });
    m.onclick(e => {
      if (confirm('Are you sure you want to delete this task?'))
        this.agent.destroyTask(task);
    });
    m.span('Delete', { class: 'button' });
    m.span({ class: 'button' }, m => m.fa('arrow-circle-up'));
    m.span({ class: 'button' }, m => m.fa('arrow-circle-down'));
  }
```

I added the third and second lines.

The method `fa()` of markup builder creates the tag to show the icon [Font Awesome](https://fortawesome.github.io/Font-Awesome/).

The screen will be like following when the top page displays on the browser. There are up-way and down-way arrows on the button.

![Screen capture](/capejs/images/capejs_primer/todo_list21.png)

Let's try some more. It should better to make the up button on the first line and down button on the last line have no effect.

First, change the method `render()` like following.

```javascript
  render(m) {
    m.ul(m => {
      this.agent.objects.forEach((task, index) => {
        m.li(m => {
          this.renderTask(m, task);
          this.renderButtons(m, task, index);
        });
      });
    });
    if (this.editingTask) this.renderUpdateForm(m);
    else this.renderCreateForm(m);
  }
```

I rewrote 2 points. I rewrote `forEach(task =>` to `forEach((task, index) =>` on the third line, and `this.renderButtons(m, task);` to `this.renderButtons(m, task, index);` on the sixth line.

<div class="note">
When the parameter of arrow function of ECMAScript6 is 1, it can abbreviate the quote (`()`) but if it 0 or many, it should be surrounded by quote.
</div>

Then, rewrite the method `renderbuttons()`.

```javascript
  renderButtons(m, task, index) {
    m.onclick(e => this.editTask(task));
    m.span('Edit', { class: 'button' });
    m.onclick(e => {
      if (confirm('Are you sure you want to delete this task?'))
        this.agent.destroyTask(task);
    });
    m.span('Delete', { class: 'button' });
    if (index === 0) m.class('disabled');
    m.span({ class: 'button' }, m => m.fa('arrow-circle-up'));
    if (index === this.agent.objects.length - 1) m.class('disabled');
    m.span({ class: 'button' }, m => m.fa('arrow-circle-down'));
  }
```

I rewrote 3 points. First, I added the third parameter `index` to the method `renderbuttons()`. In addition, I added the statements starting from `if` on the fifth and third lines.

On the fifth line from the bottom, I added `disabled` to the attribute `class` of the tag `<span>` surrounding the up button during `index == 0`. On the third line from the bottom, I added `disabled` the attribute`class` of the tag `<span>` surrounding the down button during `index == this.agent.object.length - 1`, the last sentence.

Next, rewrite the style sheet (`app/assets/stylesheets/todo_list.es6`) as following.

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
  span.button.disabled {
    cursor: not-allowed;
    background-color: #ccc;
  }
}
```

I added lines from the fifth to second from the bottom. Reload the browser and the screen will be like following.

![Screen capture](/capejs/images/capejs_primer/todo_list22.png)

----

That's all for today. On [Next time](../21_reordering2), I'll make API on server to interchange the task's order.
