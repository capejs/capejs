---
title: "Router"
---

[Simple Routes](#simple-routes) -
[Containers](#containers) -
[Resource Based Routes](#resource-based-routes) -
[Singular Resources](#singular-resources) -
[Nested Resources](#nested-resources) -
[Namespaces](#namespaces) -
[Adding Custom Actions](#adding-custom-actions) -
[Changing Root Container](#changing-root-container) -
[Vars](#vars) -
[Flash](#flash) -
[Before-Navigation Callbacks](#before-navigation-callbacks)

<a class="anchor" id="simple-routes"></a>
### Simple Routes

Cape.JS's router reacts to the changes of URL hash fragment and replace the
component mounted on the target node.

The following example illustrates the basic concept of router and routes.

#### index.html

```html
<div>
  <a href="#">Top</a>
  <a href="#about">About</a>
  <a href="#help">Help</a>
</div>

<div id="main"></div>

<script src="./components.js"></script>
<script src="./router.js"></script>
```

#### components.js

```javascript
var TopPage = Cape.createComponentClass({
  render: function(m) {
    m.p('This is the top page.')
  }
});

var AboutPage = Cape.createComponentClass({
  render: function(m) {
    m.p('This is the about page.')
  }
});

var HelpPage = Cape.createComponentClass({
  render: function(m) {
    m.p('This is the help page.')
  }
});
```

#### router.js

```javascript
var router = new Cape.Router();
router.draw(function(m) {
  m.root('top_page');
  m.page('about', 'about_page');
  m.page('help', 'help_page');
})
router.mount('main');
router.start();
```

`m.root('top_page')` connects the empty hash to the component `TopPage`
so that the browser displays the top page when we open this site.

`m.page('about', 'about_page')` connects the hash `#about` to the component `AboutPage`.
When we click the 'About' link, the `TopPage` component is removed and
the `AboutPage` component gets mounted.

Each connection between a hash and a component is called *route.*
The *router* continues to watch the changes of URL hash and switches
components according to the routes.

You can find the source code of working demo on
https://github.com/oiax/capejs/tree/master/demo/simple_routes.

<a class="anchor" id="containers"></a>
### Containers

When the number of components is getting larger, you may want to organize
them in a hyerarchical structure. In this case, you can create some objects
to contain component classes as follows:

```javascript
var Top = {};
Top.IndexPage = Cape.createComponentClass({
  render: function(m) {
    m.p('This is the top page.')
  }
});

Top.AboutPage = Cape.createComponentClass({
  render: function(m) {
    m.p('This is the about page.')
  }
});

Top.HelpPage = Cape.createComponentClass({
  render: function(m) {
    m.p('This is the help page.')
  }
});
```

We call objects of this kind *containers*.

When you define routes to classes under a container, you should connect
the container's name and the class name with a dot like this:

```javascript
var router = new Cape.Router();
router.draw(function(m) {
  m.root('top.index_page');
  m.page('about', 'top.about_page');
  m.page('help', 'top.help_page');
})
```

<a class="anchor" id="resource-based-routes"></a>
### Resource Based Routes

When you create a user interface for CRUD operations on a database table, say `articles`,
you will need four pages typically:

1. A page for listing articles
1. A page for showing the details of an existing article
1. A page to add a new article
1. A page to update an existing article

As a framework, Cape.JS recommends you to create following routes for these pages:

1. `articles => Articles.List`
1. `articles/:id => Articles.Item`
1. `articles/new => Articles.Form`
1. `articles/:id/edit => Articles.Form`

In line with this, you will create three component classes under a container called `Articles`
and define routes as follows:

```
var router = new Cape.Router();
router.draw(function(m) {
  m.page('articles', 'articles.list');
  m.page('articles/:id', 'articles.item');
  m.page('articles/new', 'articles.form');
  m.page('articles/:id/edit', 'articles.form');
})
```

Using `many` method, you can define them in much easier way, though.

```
var router = new Cape.Router();
router.draw(function(m) {
  m.many('articles');
})
```

The routes defined by the above code are summarized in the next table:

<table class="table">
<tr>
  <th>Hash pattern</th>
  <th>Container</th>
  <th>Component</th>
  <th>Resource</th>
  <th>Action</th>
</tr>
<tr>
  <td>articles</td>
  <td>Articles</td>
  <td>List</td>
  <td>articles</td>
  <td>index</td>
</tr>
<tr>
  <td>articles/:id</td>
  <td>Articles</td>
  <td>Item</td>
  <td>articles</td>
  <td>show</td>
</tr>
<tr>
  <td>articles/new</td>
  <td>Articles</td>
  <td>Form</td>
  <td>articles</td>
  <td>new</td>
</tr>
<tr>
  <td>articles/:id/edit</td>
  <td>Articles</td>
  <td>Form</td>
  <td>articles</td>
  <td>edit</td>
</tr>
</table>

The fourth and fifth rows of the table contain the *resource name* and *action name* of routes.
In Cape.JS, unlike in Ruby on Rails, the concepts of resource and action don't play important role,
but we use them occasionally.

Firstly, we specify action names to the `only` and `except` option in order
to exclude some routes from definition:

```
var router = new Cape.Router();
router.draw(function(m) {
  m.many('articles', except: [ 'new', 'edit' ]);
  m.many('announcement', only: [ 'index' ]);
})
```

Secondly, we want to know the current resource and action names in order to
control the flow of processing when we render components:

```javascript
Articles.Form = Cape.createComponentClass({
  render: function(m) {
    if (router.action === 'new') {
      // ...
    }
    else {
      // ...
    }
  }
});
```

<a class="anchor" id="singular-resources"></a>
### Singular Resources

When you want to define routes for a resource that can have only zero or
one instance, you should use `one` method as follows:

```
var router = new Cape.Router();
router.draw(function(m) {
  m.one('account');
})
```

The routes defined by the above code are summarized in the next table:

<table class="table">
<tr>
  <th>Hash pattern</th>
  <th>Container</th>
  <th>Component</th>
  <th>Resource</th>
  <th>Action</th>
</tr>
<tr>
  <td>account</td>
  <td>Account</td>
  <td>Content</td>
  <td>account</td>
  <td>show</td>
</tr>
<tr>
  <td>account/new</td>
  <td>Account</td>
  <td>Form</td>
  <td>account</td>
  <td>new</td>
</tr>
<tr>
  <td>account/edit</td>
  <td>Account</td>
  <td>Form</td>
  <td>account</td>
  <td>edit</td>
</tr>
</table>

Note that the naming convension is different from that of Ruby on Rails.
The container's name is singular, not plural.

<a class="anchor" id="nested-resources"></a>
### Nested Resources

You can define resources which are logically children
of other resources as follows:

```javascript
var router = new Cape.Router();
router.draw(function(m) {
  m.many('articles', { only: [] }, function(m) {
    m.many('comments')
  });
})
```

The routes defined by the above code are summarized in the next table:

<table class="table">
<tr>
  <th>Hash pattern</th>
  <th>Container</th>
  <th>Component</th>
  <th>Resource</th>
  <th>Action</th>
</tr>
<tr>
  <td>articles/:article_id/comments</td>
  <td>Comments</td>
  <td>List</td>
  <td>articles/comments</td>
  <td>index</td>
</tr>
<tr>
  <td>articles/:article_id/comments/:id</td>
  <td>Comments</td>
  <td>Item</td>
  <td>articles/comments</td>
  <td>show</td>
</tr>
<tr>
  <td>articles/:article_id/comments/new</td>
  <td>Comments</td>
  <td>Form</td>
  <td>articles/comments</td>
  <td>new</td>
</tr>
<tr>
  <td>articles/:article_id/comments/:id/edit</td>
  <td>Comments</td>
  <td>Form</td>
  <td>articles/comments</td>
  <td>edit</td>
</tr>
</table>

Note that you should define `Comments.List`, `Comments.Item` and `Comments.Form`.
They are not `Articles.Comments.List`, `Articles.Comments.Item` and `Articles.Comments.Form`.

<a class="anchor" id="namespaces"></a>
### Namespaces

You can define resources under a *namespace* as follows:

```javascript
var router = new Cape.Router();
router.draw(function(m) {
  m.namespace('admin', function(m) {
    m.many('articles');
  })
})
```

The routes defined by the above code are summarized in the next table:

<table class="table">
<tr>
  <th>Hash pattern</th>
  <th>Container</th>
  <th>Component</th>
  <th>Namespace</th>
  <th>Resource</th>
  <th>Action</th>
</tr>
<tr>
  <td>admin/articles</td>
  <td>Admin.Articles</td>
  <td>List</td>
  <td>admin</td>
  <td>articles</td>
  <td>index</td>
</tr>
<tr>
  <td>admin/articles/:id</td>
  <td>Admin.Articles</td>
  <td>Item</td>
  <td>admin</td>
  <td>articles</td>
  <td>show</td>
</tr>
<tr>
  <td>admin/articles/new</td>
  <td>Admin.Articles</td>
  <td>Form</td>
  <td>admin</td>
  <td>articles</td>
  <td>new</td>
</tr>
<tr>
  <td>admin/articles/:id/edit</td>
  <td>Admin.Articles</td>
  <td>Form</td>
  <td>admin</td>
  <td>articles</td>
  <td>edit</td>
</tr>
</table>


<a class="anchor" id="adding-custom-actions"></a>
### Adding Custom Actions

#### Adding Collection Routes

To add a *collection* route (a route which deals with multiple items), use `collection` method:

```javascript
var router = new Cape.Router();
router.draw(function(m) {
  m.many('articles', function(m) {
    m.collection 'draft'
  });
})
```

This defines a route from `articles/draft` to `Articles.Draft`.


#### Adding Member Routes

To add a *member* route (a route which deals with a specific item), use `member` method:

```javascript
var router = new Cape.Router();
router.draw(function(m) {
  m.many('articles', function(m) {
    m.member 'info'
  });
})
```

This defines a route from `articles/:id/info` to `Articles.Info`.


#### Adding Routes for Additional New Actions

To add an alternate new action, use `new` method:

```javascript
var router = new Cape.Router();
router.draw(function(m) {
  m.many('articles', function(m) {
    m.new 'preview'
  });
})
```

This defines a route from `articles/new/preview` to `Articles.Preview`.


#### Adding Additional Routes to Singular Resources

To add an additional route to singular resources, use `view` method:

```javascript
var router = new Cape.Router();
router.draw(function(m) {
  m.one('account', function(m) {
    m.view 'photo'
  });
})
```

This defines a route from `account/photo` to `Account.Photo`.



#### Adding Routes for Additional New Actions of Singular Resources

To add an alternate new action to singular resources, use `new` method:

```javascript
var router = new Cape.Router();
router.draw(function(m) {
  m.one('account', function(m) {
    m.new 'preview'
  });
})
```

This defines a route from `account/new/preview` to `Account.Preview`.

<a class="anchor" id="changing-root-container"></a>
### Changing Root Container

By default, the root container is `window` object.
In other words, variables for components and containers are defined globally.

But you can change it by passing an object to the `Cape.Router`'s constructor:

```javascript
var MyApp = {};
var router = new Cape.Router(MyApp);
router.draw(function(m) {
  m.root('top_page')
  m.many('articles');
})
```

Then the component class for root page becomes `MyApp.TopPage`,
and the container for the `articles` resource becomes `MyApp.Articles`.


<a class="anchor" id="vars"></a>
### Vars

Routers have a property named `vars`, which developers can store arbitrary data to.

For example, you can store attributes of the current user:

```javascript
var router = new Cape.Router();
router.vars.current_user = { id: 123, name: 'john', privileged: true }
```

You can use this data in the `render` method of a component like this:

```javascript
render: function(m) {
  if (router.vars.current_user.privileged)
    m.attr(onclick: function(e) { this.deleteItem() } );
  else
    m.class('disabled')
  m.button('Delete');
}
```

<a class="anchor" id="flash"></a>
### Flash

Routers have a property named `flash`, which developers can store arbitrary data to,
but is erased after each navigation.

For example, you can store the alert message to be displayed in the next page:

```javascript
var router = new Cape.Router();
router.flash.alert = "You can't delete this item.";
```

You can use this data in the `render` method of a component like this:

```javascript
render: function(m) {
  if (router.flash.alert !== undefined) {
    m.div(router.flash.alert, { class: 'alert' });
  }
}
```


<a class="anchor" id="before-navigation-callbacks"></a>
### Before-Navigation Callbacks

You can register one or more callbacks which are executed before each *navigation*.

Here is an example:

```javascript
var router = new Cape.Router();
router.beforeNavigation(function(hash) {
  return new Promise(function(resolve, reject) {
    $.ajax({
      type: 'GET',
      url: '/session'
    }).done(function(data) {
      if (data.text == 'OK') {
        router.vars.currentUser = data.user;
        resolve(hash);
      }
      else {
        router.vars.currentUser = null;
        resolve('login');
      }
    }).error(function() {
      reject(Error('ERROR'));
    });
  });
});
router.errorHandler(function(err) {
  router.show(Errors.NetworkError);
});
```

In the above code, we get attributes of the user who is signing in to this
application through an Ajax request.

The `resolve` and `reject` are functions.
If we call the `resolve` passing a hash as the first argument,
the process continues to the next callback which takes this hash as its first argument.
When all callbacks are executed successfully, the hash which is specified by the last callback
determines the component to be mounted.

If we call the `reject`, the next and subsequent callbacks are not executed and
the error handler is executed if it exists.

The `show` method of router mounts the specified component (`Errors.NetworkError`)
immediately without executing before-navigation callbacks.

#### Notes on the *Promise*

In this example, we use a
[Promise](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise)
<i class="fa fa-external-link"></i>
object to assure that the callbacks are executed one by one in order before navigation.
Because Ajax requests are processed *asynchronously,*
we can't assure this without the help of *Promise* objects.

Note that all browsers currently in use in the world do not support the *Promise* interface.
See http://caniuse.com/#feat=promises.

For browsers that do not support it, you should use one of these *Promise polyfills:*

* https://github.com/taylorhakes/promise-polyfill
* https://github.com/jakearchibald/es6-promise

If you choose the former, just place the following snippet
to the `<head>` section of your HTML files.

```html
<link href="https://cdn.rawgit.com/taylorhakes/promise-polyfill/master/Promise.min.js" rel="stylesheet">
```
