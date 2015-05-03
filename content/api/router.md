---
title: "Cape.Router - API Reference"
---

[#flash](#flash) -
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
