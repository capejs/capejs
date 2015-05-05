---
title: "Cape.RoutingMapper - API Reference"
---

[collection()](#collection) -
[namespace()](#namespace) -
[new()](#new) -
[many()](#many) -
[member()](#member) -
[one()](#one) -
[page()](#page) -
[root()](#root) -
[view()](#view)


<a class="anchor" id="collection"></a>
### #collection()

#### Usage

* **collection(name)**

Adds a *collection* route (a route which deals with multiple items).

#### Example

```javascript
var router = new Cape.Router();
router.draw(function(m) {
  m.many('articles', function(m) {
    m.collection 'draft'
  });
})
```

This defines a route from `articles/draft` to `Articles.Draft`.

The `#collection()` method must be called within a block that defines a plural resource.

<a class="anchor" id="namespace"></a>
### #namespace()

#### Usage

* **namespace(name, function)**

Introduces a *function* tha defines resources under the specified *namespace*.

```javascript
var router = new Cape.Router();
router.draw(function(m) {
  m.namespace('admin', function(m) {
    m.many('articles');
  })
})
```

The above code defines four routes. See the table below:

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


<a class="anchor" id="new"></a>
### #new()

#### Usage

* **new(name)**

Adds an alternate _new_ action to a resource, which can be plural or singular.

```javascript
var router = new Cape.Router();
router.draw(function(m) {
  m.one('account', function(m) {
    m.new 'preview'
  });
  m.many('articles', function(m) {
    m.new 'preview'
  });
})
```

This defines two routes:

* From `account/new/preview` to `Account.Preview`.
* From `articles/new/preview` to `Articles.Preview`.

<a class="anchor" id="many"></a>
### #many()

#### Usage

* **many(name)**

Defines four routes for a plural resource.

#### Example

```
var router = new Cape.Router();
router.draw(function(m) {
  m.many('articles');
})
```

The above code defines four routes. See the table below:

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


#### Usage

* **many(name, { only: [ action1, action2, ... ] })**

Adds routes for *action1, action2, ...* to a plural resource.
The value of *action1, action2, ...* must be "index", "show", "new" or "edit".

#### Example

```
var router = new Cape.Router();
router.draw(function(m) {
  m.many('articles', { only: [ 'index', 'show' ] });
})
```

This defines two routes:

* From `articles/` to `Articles.List`.
* From `articles/:id` to `Articles.Item`.


#### Usage

* **many(name, { except: [ action1, action2, ... ] })**

Adds basic routes excepting *action1, action2, ...* to a plural resource.
The value of *action1, action2, ...* must be "index", "show", "new" or "edit".

#### Example

```
var router = new Cape.Router();
router.draw(function(m) {
  m.many('articles', { except: [ 'new', 'edit' ] });
})
```

This defines two routes:

* From `articles/` to `Articles.List`.
* From `articles/:id` to `Articles.Item`.


<a class="anchor" id="member"></a>
### #member()

#### Usage

* **member(name)**

Adds a *member* route (a route which deals with a specific item).

#### Example.

```javascript
var router = new Cape.Router();
router.draw(function(m) {
  m.many('articles', function(m) {
    m.member 'info'
  });
})
```

This defines a route from `articles/:id/info` to `Articles.Info`.

The `#member()` method must be called within a block that defines a plural resource.

<a class="anchor" id="one"></a>
### #one()

#### Usage

* **one(name)**

Defines four routes for a singular resource.

#### Example

```
var router = new Cape.Router();
router.draw(function(m) {
  m.one('account');
})
```

The above code defines four routes. See the table below:

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



#### Usage

* **one(name, { only: [ action1, action2, ... ] })**

Adds routes for *action1, action2, ...* to a singular resource.
The value of *action1, action2, ...* must be "show", "new" or "edit".

#### Example

```
var router = new Cape.Router();
router.draw(function(m) {
  m.new('account', { only: [ 'show' ] });
})
```

This defines a route:

* From `account/` to `Account.Content`.


#### Usage

* **one(name, { except: [ action1, action2, ... ] })**

Adds basic routes excepting *action1, action2, ...* to a singular resource.
The value of *action1, action2, ...* must be "show", "new" or "edit".

#### Example

```
var router = new Cape.Router();
router.draw(function(m) {
  m.one('account', { except: [ 'new' ] });
})
```

This defines two routes:

* From `account` to `Account.Content`.
* From `account/edit` to `Account.Form`.


<a class="anchor" id="page"></a>
### #page()

#### Usage

* **page(hashPattern, componentClassPath)**

Defines a route from *hashPattern* to *componentClassPath.*

#### Example

```javascript
var router = new Cape.Router();
router.draw(function(m) {
  m.page('dashboard', 'dashboard');
  m.page('about', 'docs.about');
  m.page('help/:name', 'docs.help');
})
```

#### Usage

* **page(hashPattern, componentClassPath, constraints)**

Defines a route from *hashPattern* to *componentClassPath* with constraints
on the parameters, which are specified by regular expression string.

#### Example

```javascript
var router = new Cape.Router();
router.draw(function(m) {
  m.page('blog/:year/:month', 'blog.articles',
    { year: '201\\d', month: '(:?0[1-9]|1[012])' });
})
```

Note that you should put `:?` to make parentheses
[non-capturing parentheses](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#special-non-capturing-parentheses) <i class="fa fa-external-link"></i>.

<a class="anchor" id="root"></a>
### #root()


#### Usage

* **root(componentClassPath)**

Defines a route from "" to *componentClassPath.*


#### Example

```javascript
var router = new Cape.Router();
router.draw(function(m) {
  root('Dashboard')
})
```

<a class="anchor" id="view"></a>
### #view()


#### Usage

* **view(name)**

Adds a custom route to a singular resource.

#### Example

```javascript
var router = new Cape.Router();
router.draw(function(m) {
  m.one('account', function(m) {
    m.view 'image'
  });
})
```

This defines a route from `account/image` to `Account.Image`.

The `#view()` method must be called within a block that defines a singular resource.
