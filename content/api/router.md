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
