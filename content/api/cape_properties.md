---
title: "API: Cape Properties"
---

<a class="anchor" id="session"></a>
### Cape.session

This property holds an object (hash). Users may store arbitrary data to this hash.

#### Example

```
Cape.currentUser = { id: 1, name: 'john', privileged: true }

if (Cape.currentUser.privileged) {
  // Do something.
}
```
