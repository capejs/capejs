---
title: "Changing displaying order (3) - Cape.JS Primer"
---

On [the previous lecture](../21_reordering2), I made API on the server. Let's finish the function to change displaying order of the task by using it.

----

At this moment, the code of the method `TodoList#renderButtons` is following. (`app/assets/javascripts/todo_list.es6`)

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

API to move up and down the task is like following.

```text
PATCH /api/tasks/:id/move_higher
PATCH /api/tasks/:id/move_lower
```

So, rewrite the method `TodoList#renderButtons` like following.

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
    else m.onclick(e => this.agent.patch('move_higher', task.id));
    m.span({ class: 'button' }, m => m.fa('arrow-circle-up'));
    if (index === this.agent.objects.length - 1) m.class('disabled');
    else m.onclick(e => this.agent.patch('move_lower', task.id));
    m.span({ class: 'button' }, m => m.fa('arrow-circle-down'));
  }
```

I added 2 lines starting from `else` of last half of the method.

```javascript
    else m.onclick(e => this.agent.patch('move_higher', task.id));

    else m.onclick(e => this.agent.patch('move_lower', task.id));
```

If the value of `task.id` is 7 now and the up-arrow icon is clicked,

```text
PATCH /api/tasks/7/move_higher
```

Ajax request above is run.

`this.agent` that is used in the method above is the instance `TaskCollectionAgent`. It runs Ajax request.

On [Collection agent (1)](/rails/capejs_primer/collection_agent1.html), I defined `TaskCollectionAgent` as following.

```javascript
class TaskCollectionAgent extends Cape.CollectionAgent {
  constructor(client, options) {
    super(client, options);
    this.basePath = '/api/';
    this.resourceName = 'tasks';
  }
}
```

The property `basePath` and `resourceName` determines URL of Ajax request. If it calles the method `this.agent.patch('move_higher', task.id)`,

```javascript
  this.basePath + this.resourceName + '/' + 'move_higher' + '/' + task.id
```

the sentences above make URL of Ajax request.

Collection agent sends Ajax request and receives the request from the server and refresh CapeJS component as its client. This spec realizes the function to make task move up and down.

Now, make sure it works well on the browser.

![Screen capture](/rails/files/todo_list23.png)

If you click the up-arrow icon on right side of "To through bulk trash", the screen will be following.

![Screen capture](/rails/files/todo_list24.png)

Next, if you click the down-arrow icon of the same task, it will be back.

---

The function to change the task's order is now over. Also, the selection [Cape.JS approach] (../../capejs_primer) for 5 month running is finished.

I couldn't mention about the routing function of Cape.JS at all. I'll explain it on the next selection "Next Cape.JS approach". Wait till it!
