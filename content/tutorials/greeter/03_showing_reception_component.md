---
title: "Showing the Reception Component - How to make a SPA with Cape.JS and Rails"
description: "Creating the Reception component and introducing the Cape.JS router."
---

[Table of Contents](../) - [Next Section](../04_navigation_among_pages)

### Creating the `Reception` component

```text
$ mkdir -p app/assets/javascripts/components
$ touch app/assets/javascripts/components/reception.es6
```

Edit `app/assets/javascripts/components/reception.es6` so that its content becomes like as:

```javascript
class Reception extends Cape.Component {
  render(m) {
    m.p("Hi, I am Greeter. Nice to meet you!")
  }
}
```

### Introducing the Cape.JS router

```text
$ touch app/assets/javascripts/router.es6
```

Add these lines to `app/assets/javascripts/routes.es6`:

```javascript
var $router = new Cape.Router()

$router.draw(m => {
  m.root('reception')
})

document.addEventListener("DOMContentLoaded", event => {
  $router.mount('main')
  $router.start()
})
```

Reload your browser to see if the page is rendered without errors. Below the heading you will see a <p> element with following content:

> Hi, I am Greeter. Nice to meet you!

[Table of Contents](../) - [Next Section](../04_navigation_among_pages)
