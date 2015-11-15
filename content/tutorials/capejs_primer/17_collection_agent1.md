---
title: "Collection agent (1) - Cape.JS Primer"
---

On [the previous lecture](../16_capejs_1_2), I upgraded Cape.JS 1.1 to 1.2 of "Todo list application".

From this lecture, I'll rewrite the source code by using the new class `CollectionAgent` introduced on Cape.JS 1.2. The behavior of the application doesn't change but I'll show you the amount of source code decrease a lot.

----

First, rewrite `app/assets/javascripts/application.js` as following.

```javascript
//= require jquery
//= require jquery_ujs
//= require turbolinks
//= require capejs
//= require bootstrap
//= require lodash
//= require es6-promise
//= require fetch
//= require_tree .
//= require_self

Cape.defaultAgentAdapter = 'rails';
```

I modified 4 points.

1. I added the directive `//= require es6-promise`.
1. I added the directive `//= require fetch`.
1. I added the directive `//= require_self`.
1. I added the JavaScript code `Cape.defaultAgentAdapter = 'rails';`.

The first and second one make the browser except Chrome and Firefox hold the function of Fetch API. The directive `//= require_self` is necessary to write the JavaScript code in the file `application.js`.

The last sentence sets the default adapter of `CollectionAgent`. "Adapter" means here the JavaScript library adjusting the connection to API server.

If you want to connect API server implemented on Ruby on Rails like our "Todo list", you need to set the default adapter before making the instance `CollectionAgent`.

By this setting, the appropriate value is set to the header of `X-CSRF-Token` of HTTP request sent to API server. Unless you set like this, the request by the method except GET/HEAD is rejected.

<div class="note">
The only adapter with Cape.JS of existing version (v1.2.0) is <code>'rails'</code>. If you want to use API server implemented by the one except Rails, you need to make the adapter by yourself.
</div>

----

Next, change the structure of JSON data that API server returns as "task's list".

So far, `app/views/api/tasks/index.jbuilder` is wrote like following.

```text
json.array! @tasks, :id, :title, :done
```

The JSON data created from this code is like following.

```json
[
  { "id": 1, "title": "Buy cat food", "done": true },
  { "id": 2, "title": "Take away the trash", "done": false }
]
```

But, the collection agent requires JSON data of the structure like following,

```json
{
  "tasks": [
    { "id": 1, "title": "Buy cat food", "done": true },
    { "id": 2, "title": "Take away the trash", "done": false }
  ]
}
```

The whole JSON data is necessary to be the object not the array. And, there is the key which is conform to "the resource name" of the collection agent in the object, and the key must the array of the value. For this example, `"tasks"` is the resource name. (For more information, I'll explain later.)

Then, rewrite `app/views/api/tasks/index.jbuilder` as following.

```text
json.tasks do
  json.array! @tasks, :id, :title, :done
end
```

<div class="note">
To say exactly, the rule that JSON data is the object and its key is the resource name of the collect agent is just the configuration. If you need, developers can change the setting. Cape.JS inherits the paradigm "Convention over Configuration" of Ruby on Rails.
</div>

----

Next, define the class of the collection agent. The name of the class is `TaskCollectionAgent`. You can decide the name as you want not like the model name of Rail.

Open a new file `task_collection_agent.es6` on the directory `app/assets/javascripts` as following.

```javascript
class TaskCollectionAgent extends Cape.CollectionAgent {
  constructor(client, options) {
    super(client, options);
    this.basePath = '/api/';
    this.resourceName = 'tasks';
  }
}
```

The class of the collection agent inherits the class `Cape.CollectionAgent`. On the constructor, it sets some properties. The property `basePath` is string based on URL of Ajax request. The default value is `'/'`. On our "Todo list" application, we set like that because it accesses to the path under the directory `/api/`.

<div class="note">
Said on rounding language of Rails, the property <code>basePath</code> corresponds to namespace.
</div>

The property `resourceName` means "resource name" wrote above. This value connects to the value of the property `basePath` when the collect agent creates URL of Ajax request. Also, it's used to acquire the array from JSON data that backs from API server as the key.

----

The class `TaskCollectionAgent` just write the constructor but is able to acquire the task's list from the server already.

Open `app/assets/javascripts/todo_list.es6` on the text editor. Existing the method `init()` is wrote like following.

```javascript
  init() {
    this.ds = new TaskStore();
    this.ds.attach(this);
    this.editingTask = null;
    this.ds.refresh();
  }
```

Rewrite it as following.

```javascript
  init() {
    this.agent = new TaskCollectionAgent(this);
    this.editingTask = null;
    this.agent.refresh();
  }
```

Collection agent doesn't have the method `attach()` not like the data store. Instead of it, it assigns the component that is the collection agent's "client" as constructor's first parameter.

In addition, developers must implement the method `refresh()` in the case of the data store, collection agent have existing `refresh()`.

Look at `app/assets/javascripts/task_store.es6`. The method `refresh()` is wrote like following.

 ```javascript
  refresh() {
    $.ajax({
      type: 'GET',
      url: '/api/tasks'
    }).done(data => {
      this.tasks = data;
      this.propagate();
    });
  }
```

The instance method `refresh()` of the class `TaskCollectionAgent` corresponds approximately to it. But, the task's array stores in the property `objects` not the property `tasks`.

----

Keep rewriting `app/assets/javascripts/todo_list.es6`. Next is the method `render()`. Existing code is following.:

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

Rewrite it as following.

```javascript
  render(m) {
    m.ul(m => {
      this.agent.objects.forEach(task => {
        m.li(m => this.renderTask(m, task));
      });
    });
    // if (this.editingTask) this.renderUpdateForm(m);
    // else this.renderCreateForm(m);
  }
```

I changed 3 points. Rewrite `this.ds.tasks.forEach` to `this.agent.objects.forEach` on the third line. And, comment out once the seventh and eighth lines. (to avoid errors)

The task's list will display by changes above.

![Screen capture](/capejs/images/capejs_primer/todo_list19.png)

----

The function to toggle the flag "done" of the task and the function to delete tasks don't move yet. On [the next lecture](../18_collection_agent2), I'll modify a part related these functions.
