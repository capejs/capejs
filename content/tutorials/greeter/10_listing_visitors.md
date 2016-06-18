---
title: "Listing Registered Visitors - How to make a SPA with Cape.JS and Rails"
description: ""
---

[Table of Contents](../)

Edit `app/assets/javascripts/routes.es6`:

```javascript
var $router = new Cape.Router();

$router.draw(m => {
  m.root('reception')
  m.page('visitor_form')
  m.page('thanks')
  m.many('visitors', { only: [ 'index'] })
})

document.addEventListener("DOMContentLoaded", event => {
  $router.mount('main')
  $router.start()
});
```

```text
$ mkdir -p app/assets/javascripts/components/visitors
$ touch app/assets/javascripts/components/visitors/list.es6
```

Add these lines to `app/assets/javascripts/components/visitors/list.es6`:

```javascript
var Visitors = Visitors || {}

;((namespace) => {

  class List extends Cape.Component {
    init() {
      this.agent = new VisitorListAgent(this)
      this.agent.refresh()
    }

    render(m) {
      m.ol(m => {
        this.agent.objects.forEach(visitor => {
          m.li(`${visitor.family_name}, ${visitor.given_name}`)
        })
      })
      m.div(m => {
        m.onclick(e => $router.navigateTo('')).btn('Return to the top page')
      })
    }
  }

  namespace.List = List

})(Visitors)
```

Edit `app/assets/javascripts/components/reception.es6`:

```javascript
class Reception extends Cape.Component {
  render(m) {
    m.p("Hi, I am Greeter. Nice to meet you!")
    m.div(m => {
      m.onclick(e => $router.navigateTo('visitor_form'))
        .btn('Proceed to the Entry Form')
    })
    m.div(m => {
      m.onclick(e => $router.navigateTo('visitors'))
        .btn('Show the list of registered visitors')
    })
  }
}
```

Reload your browser and click the second button to see the the list of registered visitors.

That's all for this tutorial.

[Table of Contents](../)
