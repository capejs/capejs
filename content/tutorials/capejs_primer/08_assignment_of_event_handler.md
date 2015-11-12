---
title: "Assignment of event handler - Cape.JS Primer"
---

On [the previous lecture](../07_initializing_the_date_with_ajax), I explained how to initialize the component data of Cape.JS on Ajax.

On this lecture, I'll explain how to assign the event handler to HTML element.

----

Open `app/assets/javascripts/todo_list.es6` on the text editor. At this time of now, the method `render()` is defined as following.

```javascript
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
```

Rewrite it as following. (add a line behind `m.label...`)

```javascript
  render(m) {
    m.ul(m => {
      this.tasks.forEach(task => {
        m.li(m => {
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

The line is added is following.

```javascript
m.onclick(e => this.toggleTask(task));
```

This sentence assigns `this.toggleTask(task)` as the event `click` handler. The object it the element added to virtual DOM right after, which is the check box.

<div class="note">
Actually, the broad transcription is used that is introduced on ES6 in this sentence. When it's not simplified, it's like following.

<pre>m.onclick((e) => { this.toggleTask(task) });</pre>

You can simplify brackets surrounding the parameter when there's 1 parameter and you can simplify braces surrounding the sentence when there's 1 content of the function.
</div>

Next, let's define the event handler and rewrite `app/assets/javascripts/todo_list.es6`. Insert the following code to below the method's `render()` definition.

```javascript
  toggleTask(task) {
    window.alert(task.id);
  }
```

It displays the warning dialog just to make sure the event handler can reacts on the click of checkbox.

Now, let's make sure it works well. Boot the server and open `http://localhost:3000/` on the browser. By clicking the first checkbox, it displays "1" like following in the warning dialog. This is the value of the column's `id` task.

![Screen capture](/capejs/images/capejs_primer/todo_list05.png)

----

That's all for today. On [Next lecture](../09_updating_the_data_with_ajax), I'll explain how to update the value of the task's  column `done` by using Ajax call of this event handler.
