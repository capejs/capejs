---
title: "Navigation Among Pages - How to make a SPA with Cape.JS and Rails"
description: ""
---

[Table of Contents](../) - [Next Section](../05_form_for)

## Adding `VisitorForm` and `Thanks` components

Edit `app/assets/javascripts/omponents/reception.es6`:

```javascript
class Reception extends Cape.Component {
  render(m) {
    m.p("Hi, I am Greeter. Nice to meet you!")
    m.div(m => {
      m.onclick(e => $router.navigateTo('visitor_form'))
        .class('btn btn-primary').btn('Proceed to the Entry Form')
    })
  }
}
```

```text
$ touch app/assets/javascripts/components/visitor_form.es6
$ touch app/assets/javascripts/components/thanks.es6
```

Add these lines to `app/assets/javascripts/components/visitor_form.es6`:

```javascript
class VisitorForm extends Cape.Component {
  render(m) {
    m.p("Please fill in your name on this form.")
    m.div(m => {
      m.onclick(e => $router.navigateTo('thanks'))
        .class('btn btn-primary').btn('Submit')
    })
  }
}
```

Add these lines to `app/assets/javascripts/components/thanks.es6`:

```javascript
class Thanks extends Cape.Component {
  render(m) {
    m.p("Thank you!")
    m.div(m => {
      m.onclick(e => $router.navigateTo(''))
        .class('btn btn-primary').btn('Return to the top page')
    })
  }
}
```

Edit `app/assets/javascripts/routes.es6` so that its content becomes like this:

```javascript
var $router = new Cape.Router();

$router.draw(m => {
  m.root('reception')
  m.page('visitor_form')
  m.page('thanks')
})

document.addEventListener("DOMContentLoaded", event => {
  $router.mount('main')
  $router.start()
});
```

Reload your browser to check if the page is rendered without errors.
You can see three pages in turn by clicking buttons.

[Table of Contents](../) - [Next Section](../05_form_for)
