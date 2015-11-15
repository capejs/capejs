---
title: "Change displaying order (3) - Cape.JS Primer"
---

On [the previous lecture](../21_reordering2), I made APIs on the server. Let's finish the functionality to change displaying order of the tasks by using then.

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

The APIs to move up and down the task are like following.

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

I added two lines starting from `else` of last half of the method.

```javascript
    else m.onclick(e => this.agent.patch('move_higher', task.id));

    else m.onclick(e => this.agent.patch('move_lower', task.id));
```

If the value of `task.id` is 7 and the up-arrow icon is clicked,
an Ajax request to the following API is executed:

```text
PATCH /api/tasks/7/move_higher
```

`this.agent` that is used in the method above is the instance `TaskCollectionAgent`,
which executes the Ajax request.

On the ["Collection agent (1)"](/rails/capejs_primer/collection_agent1.html), I defined `TaskCollectionAgent` as following.

```javascript
class TaskCollectionAgent extends Cape.CollectionAgent {
  constructor(client, options) {
    super(client, options);
    this.basePath = '/api/';
    this.resourceName = 'tasks';
  }
}
```

The properties `basePath` and `resourceName` determine the URL of Ajax request.
The code `this.agent.patch('move_higher', task.id)` will make an Ajax requiest
to the URL that is made from the following expression:

```javascript
  this.basePath + this.resourceName + '/' + 'move_higher' + '/' + task.id
```

Collection agent sends Ajax request and receives the request from the server
and refreshes Cape.JS component which is its client.
Thus the functionality to change the displaying order of tasks is realized.

Now, make sure it works well on the browser.

![Screen capture](/capejs/images/capejs_primer/todo_list22.png)

If you click the up-arrow icon on right side of "Take out the trash", the screen will be following.

![Screen capture](/capejs/images/capejs_primer/todo_list23.png)

Next, if you click the down-arrow icon of the same task, it will be back.

---

The functionality to change the task's order is now ready. Also, the tutorial ["Cape.JS Primer"] (../../capejs_primer) for five month running is finished.

I couldn't mention about the **routing** of Cape.JS at all. I'll explain it on the next tutorial. Wait till it!
