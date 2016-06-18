---
title: "Refactoring with Partials - How to make a SPA with Cape.JS and Rails"
description: ""
---

[Table of Contents](../) - [Next Section](../10_listing_visitors)

```text
$ mkdir -p app/assets/javascripts/partials
$ touch app/assets/javascripts/partials/error_message_list.es6
```

Add these lines to `app/assets/javascripts/partials/error_message_list.es6`:

```javascript
class ErrorMessageList extends Cape.Partial {
  render(m) {
    m.div({ class: 'error-message' }, m => {
      m.p("You have errors. Please fix them and submit again.")
      m.ul(m => {
        this.parent.errors.forEach(err => {
          m.li(err)
        })
      })
    })
  }
}
```

Edit `app/assets/javascripts/components/visitor_form.es6`:

```javascript
class VisitorForm extends Cape.Component {
  init() {
    this.agent = new VisitorListAgent(this)
    this.errorMessageList = new ErrorMessageList(this)
    this.refresh()
  }

  render(m) {
    m.h2('Visitors Entry Form')
    m.p("Please fill in your name on this form.")
    if (this.errors) this.errorMessageList.render(m)
    m.formFor('visitor', m => {
      m.div(m => {
        m.labelFor('given_name', 'Given Name').sp().textField('given_name')
      })
      m.div(m => {
        m.labelFor('family_name', 'Family Name').sp().textField('family_name')
      })
      m.onclick(e => this.submit()).btn('Submit')
    })
  }

  submit() {
    this.agent.create(this.paramsFor('visitor'), data => {
      if (data.result === 'Success') {
        $router.navigateTo('thanks')
      }
      else {
        this.errors = data.errors
        this.refresh()
      }
    })
  }
}
```

[Table of Contents](../) - [Next Section](../10_listing_visitors)
