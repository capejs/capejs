---
title: "Cape.Router - API Reference"
---

[#action](#action) -
[#attach()](#attach) -
[#beforeNavigation()](#before-navigation) -
[#component](#component) -
[#container](#container) -
[#detach()](#detach) -
[#draw()](#draw) -
[#errorHandler()](#error-handler) -
[#flash](#flash) -
[#namespace](#namespace) -
[#navigate()](#navigate) -
[#navigateTo()](#navigate-to) -
[#notify()](#notify) -
[#mount()](#mount) -
[#params](#params) -
[#query](#query) -
[#redirectTo](#redirect-to) -
[#resource](#resource) -
[#routeFor()](#route-for) -
[#show()](#show) -
[#start()](#start) -
[#stop()](#stop) -
[#vars](#vars)

<a class="anchor" id="action"></a>
### #action

This property holds the *action name* of the current route.

#### Example

```javascript
var router = new Cape.Router();
router.draw(function(m) {
  m.many('articles');
});
router.navigateTo('articles/123/edit');
console.log(router.action); // => "edit"
```

<a class="anchor" id="attach"></a>
### #attach()

#### Usage

* **attach(component)**

This method register the *component* as the target of *notification* from this router.

See [#notify()](#notify) for details.

<a class="anchor" id="before-navigation"></a>
### #beforeNavigation()

See [Before-Navigation Callbacks](../../router/#before-navigation-callbacks).

<a class="anchor" id="component"></a>
### #component

This property holds the *component name* of the current route in lower case.

#### Example

```javascript
var router = new Cape.Router();
router.draw(function(m) {
  m.many('articles');
  m.namespace('admin', function(m) {
    m.many('articles');
  });
});
router.navigateTo('articles/123/edit');
console.log(router.component); // => "edit"
router.navigateTo('admin/articles/123/edit');
console.log(router.component); // => "edit"
```

<a class="anchor" id="container"></a>
### #container

This property holds the *container name* of the current route in lower case.

#### Example

```javascript
var router = new Cape.Router();
router.draw(function(m) {
  m.many('articles');
  m.namespace('admin', function(m) {
    m.many('articles');
  });
});
router.navigateTo('articles/123/edit');
console.log(router.container); // => "articles"
router.navigateTo('admin/articles/123/edit');
console.log(router.container); // => "admin.articles"
```

<a class="anchor" id="detach"></a>
### #detach()

#### Usage

* **detach(component)**

This method removes the _component_ from the list of targets of _notification_ from this router.

See [#notify()](#notify) for details.


<a class="anchor" id="draw"></a>
### #draw()

#### Usage

* **draw(function)**

This method specify a function that takes a `RoutingMapper` object and defines routes.

#### Example

```javascript
var router = new Cape.Router();
router.draw(function(m) {
  m.root('dashboard');
  m.page('about', 'docs.about');
  m.many('articles');
})
```

In the above example, the argument `m` is a `RoutingMapper` object.

<a class="anchor" id="error-handler"></a>
### #errorHandler()

See [Before-Navigation Callbacks](../../router/#before-navigation-callbacks).

<a class="anchor" id="flash"></a>
### #flash

#### Usage

* **flash[key] = value**
* **flash.key = value**

Set an arbitrary value (object, string, integer, etc.) to the _flash_ object,
which is emptied after each navigation.

#### Example

```javascript
router.flash.alert = 'The specified article has been deleted.';
router.navigateTo('articles');
```


<a class="anchor" id="namespace"></a>
### #container

This property holds the *namespace* of the current route in lower case.

#### Example

```javascript
var router = new Cape.Router();
router.draw(function(m) {
  m.many('articles');
  m.namespace('admin', function(m) {
    m.many('articles');
  });
});
router.navigateTo('articles/123/edit');
console.log(router.namespace); // => null
router.navigateTo('admin/articles/123/edit');
console.log(router.namespace); // => "admin"
```

<a class="anchor" id="navigate"></a>
### #navigate()

This method is *deprecated* as of v1.4.

#### Usage

* **navigate(hash)**

Sets the anchor part (begins with a `#` symbol) of the browser's current URL to _hash._
See [#navigateTo()](#navigateTo).

<a class="anchor" id="navigate-to"></a>
### #navigateTo() <span class="badge alert-info">1.4</span>

#### Usage

* **navigateTo(hash)**

This method sets the anchor part (begins with a `#` symbol) of the browser's current URL to _hash._

When before-navigation callbacks are registered, they are executed
before changing the anchor part of URL.
If the before-navigation callbacks select other string for _hash_,
it will be set to the anchor part of the browser's current URL.

After setting the anchor part of URL, this method choose a component
according to the routing table.

When this component is different from the component which is mounted currently,
it unmounts the latter and mounts the former.
When this component is same with the component mounted currently
it calls the `#refresh` method of mounted component.

Lastly, the `#notify()` method is executed.

If you don't want the `#notify()` method to be executed, use [#show()](#show) instead.

#### Usage

* **navigateTo(hash, params)**

Sets the anchor part (begins with a `#` symbol) of the browser's current URL to _hash_
adding query string which is constructed from _params._

#### Example

```javascript
router.navigateTo('articles', { page: '2' });
```

#### Usage

* **navigateTo(hash, params, options)**

Same as the previous usage, except that the flash messages are set using _options._

#### Example

```javascript
router.navigateTo('articles', {}, { notice: 'A new article has been uploaded.' });
router.navigateTo('articles/new', {}, { alert: 'Failed to upload a new article.' });
```

<a class="anchor" id="notify"></a>
### #notify()

#### Usage

* **notify()**

This method triggars the _notification_ process, which calls the `#refresh()` method
of all components registerd as targets of _notification_ of this data store.

Eventually, each target component executes its `#render()` method,
which has to be defined by developers.

The `#notify()` method is executed after each time the [#navigateTo()](#navigateTo) method is called.

<a class="anchor" id="mount"></a>
### #mount()

#### Usage

* **mount(id)**

This method specifies the `id` of the HTML element which this router
inserts the components into.

#### Example

```html
<div>
  <a href="#">Top</a>
  <a href="#about">About</a>
  <a href="#help">Help</a>
</div>

<div id="main"></div>

<script>
var router = new Cape.Router();
router.draw(function(m) {
  m.root('top_page');
  m.page('about', 'about_page');
  m.page('help', 'help_page');
})
router.mount('main');
</script>
```

In the example above, components are mounted into the `<div>` element whose `id` is `'main'`.

<a class="anchor" id="params"></a>
### #params

This property holds a set of key-value pairs, which represents the parameters
embedded in the main part (before the first '?' symbol) of hash.

#### Example

```javascript
var router = new Cape.Router();
router.draw(function(m) {
  m.page('help/:name', 'help.item');
  m.many('articles', function(m) {
    m.many('comments');
  });
})
router.navigateTo('help/password');
// router.params.name === 'password'
router.navigateTo('articles/123')
// router.params.id === '123'
router.navigateTo('articles/123/comments/7')
// router.params.article_id === '123'
// router.params.id === '7'
```

<a class="anchor" id="query"></a>
### #query

This property holds a set of key-value pairs, which represents the parameters
embedded in the query part (after the first '?' symbol) of hash .

#### Example

```javascript
var router = new Cape.Router();
router.draw(function(m) {
  m.many('articles')
})
router.navigateTo('articles')
// router.query === {}
router.navigateTo('articles?page=2')
// router.query.page === '2'
router.navigateTo('articles?page=2&deleted')
// router.query.page === '2'
// router.query.deleted === ''
```

<a class="anchor" id="redirect-to"></a>
### #redirectTo()

This method sets the anchor part (begins with a `#` symbol) of the browser's current URL to _hash._

Unlike [#navigateTo()](#navigate-to) method, before-navigation callbacks are *not* executed
before changing the anchor part of URL.

After setting the anchor part of URL, this method choose a component
according to the routing table.

When this component is different from the component mounted currently,
it unmounts the latter and mounts the former.
When this component is same with the component which is mounted currently
it calls the `#refresh` method of the mounted component.

Lastly, the `#notify()` method is executed.

#### Usage

* **redirectTo(hash)**

Sets the anchor part (begins with a `#` symbol) of the browser's current URL to _hash._

#### Example

```javascript
router.redirectTo('docs/help');
```

#### Usage <span class="badge alert-info">1.5</span>

* **redirectTo(hash, params)**

Sets the anchor part (begins with a `#` symbol) of the browser's current URL to _hash_
adding query string which is constructed from _params._

#### Example

```javascript
router.redirectTo('articles', { page: '2' });
```

#### Usage <span class="badge alert-info">1.5</span>

* **redirectTo(hash, params, options)**

Same as the previous usage, except that the flash messages are set using _options._

#### Example

```javascript
router.redirectTo('articles', {}, { notice: 'A new article has been uploaded.' });
router.redirectTo('articles/new', {}, { alert: 'Failed to upload a new article.' });
```

#### Usage <span class="badge alert-warning">Deprecated</span>

* **redirectTo(hash, options)**

This usage is deprecated as of version 1.5.

For backward compatibility, if the second argument has 'notice' or 'alert' as a key
and the third argument is not given, the second argument should be treated as _options._

#### Example

```javascript
router.redirectTo('articles', { notice: 'A new article has been uploaded.' });
router.redirectTo('articles/new', { alert: 'Failed to upload a new article.' });
```

<a class="anchor" id="resource"></a>
### #resource

This property holds the *resource name* of the current route in lower case.

#### Example

```javascript
var router = new Cape.Router();
router.draw(function(m) {
  m.one('account');
  m.many('articles', function(m) {
    m.many('comments');
  });
  m.namespace('admin', function(m) {
    m.many('articles');
  });
});
router.navigateTo('account/edit');
console.log(router.resource); // => "account"
router.navigateTo('articles/123/edit');
console.log(router.resource); // => "articles"
router.navigateTo('articles/123/comments');
console.log(router.resource); // => "articles/comments"
router.navigateTo('admin/articles/123/edit');
console.log(router.resource); // => "articles"
```


<a class="anchor" id="route-for"></a>
### #routeFor()

#### Usage

* **routeFor(hash)**

This method returns the first route matching to the *hash,* if any.


#### Example

```javascript
var router = new Cape.Router();
router.draw(function(m) {
  m.namespace('admin', function(m) {
    m.many('articles');
  });
});
var route = router.routeFor('admin/articles/123/edit');
```

<a class="anchor" id="show"></a>
### #show()

#### Usage

* **show(componentClass)**

This method mounts an instance of *componentClass* class.

Unlike [#navigateTo()](#navigateTo), it does neither change the anchor part of
current URL, nor call the [#notify()](#notify) method.

#### Example

```javascript
router.show(LoginForm);
```

#### Usage <span class="badge alert-info">1.5</span>

* **show(componentClass, params)**

Mounts an instance of *componentClass* class passing values to the _query_ attribute
of the router.

#### Example

```javascript
router.show(LoginForm, { email: 'alice@example.com', checked: '1' });
console.log(router.query.email); // => 'alice@example.com'
console.log(router.query.checked); // => '1'
```

<a class="anchor" id="start"></a>
### #start()

With this method call, routers begin to listen to `hashchange` events.

<a class="anchor" id="stop"></a>
### #stop()

With this method call, routers stop to listen to `hashchange` events.

<a class="anchor" id="vars"></a>
### #vars

#### Usage

* **vars[key] = value**
* **vars.key = value**

Set an arbitrary value (object, string, integer, etc.) to the _vars_ object.

#### Example

```javascript
router.vars.signedIn = Date.now();
router.vars.currentUser = { id: 99, name: 'john', privileged: true };
```
