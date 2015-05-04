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
router.navigate('articles/123/edit');
console.log(router.action); // => "edit"
```

<a class="anchor" id="attach"></a>
### #attach()

This section is not yet prepared.

<a class="anchor" id="before-navigation"></a>
### #beforeNavigation()

This section is not yet prepared.

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
router.navigate('articles/123/edit');
console.log(router.component); // => "edit"
router.navigate('admin/articles/123/edit');
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
router.navigate('articles/123/edit');
console.log(router.container); // => "articles"
router.navigate('admin/articles/123/edit');
console.log(router.container); // => "admin.articles"
```

<a class="anchor" id="detach"></a>
### #detach()

This section is not yet prepared.

<a class="anchor" id="draw"></a>
### #draw()

This section is not yet prepared.

<a class="anchor" id="error-handler"></a>
### #errorHandler()

This section is not yet prepared.

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
router.navigate('articles');
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
router.navigate('articles/123/edit');
console.log(router.namespace); // => null
router.navigate('admin/articles/123/edit');
console.log(router.namespace); // => "admin"
```

<a class="anchor" id="navigage"></a>
### #navigate()

This section is not yet prepared.

<a class="anchor" id="notify"></a>
### #notify()

This section is not yet prepared.

<a class="anchor" id="mount"></a>
### #mount()

This section is not yet prepared.

<a class="anchor" id="params"></a>
### #params

This section is not yet prepared.

<a class="anchor" id="query"></a>
### #query

This section is not yet prepared.

<a class="anchor" id="redirect-to"></a>
### #redirectTo()

This section is not yet prepared.


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
router.navigate('account/edit');
console.log(router.resource); // => "account"
router.navigate('articles/123/edit');
console.log(router.resource); // => "articles"
router.navigate('articles/123/comments');
console.log(router.resource); // => "articles/comments"
router.navigate('admin/articles/123/edit');
console.log(router.resource); // => "articles"
```


<a class="anchor" id="routeFor"></a>
### #routeFor()

This section is not yet prepared.


<a class="anchor" id="show"></a>
### #show()

This section is not yet prepared.


<a class="anchor" id="start"></a>
### #start()

This section is not yet prepared.


<a class="anchor" id="stop"></a>
### #stop()

This section is not yet prepared.

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
