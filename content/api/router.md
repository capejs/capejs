---
title: "Cape.Router - API Reference"
---

[#flash](#flash) -
[#session](#session)


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

<a class="anchor" id="session"></a>
### #session

#### Usage

* **session[key] = value**
* **session.key = value**

Set an arbitrary value (object, string, integer, etc.) to the _session_ object.

#### Example

```javascript
router.session.signedIn = Date.now();
router.session.currentUser = { id: 99, name: 'john', privileged: true };
```
