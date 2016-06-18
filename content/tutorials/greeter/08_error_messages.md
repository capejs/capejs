---
title: "Showing Error Messages - How to make a SPA with Cape.JS and Rails"
description: ""
---

[Table of Contents](../) - [Next Section](../09_partial)

Edit `app/assets/javascripts/components/visitor_form.es6`:

```javascript
class VisitorForm extends Cape.Component {
  init() {
    this.agent = new VisitorListAgent(this)
    this.refresh()
  }

  render(m) {
    m.h2('Visitors Entry Form')
    m.p("Please fill in your name on this form.")
    if (this.errors) this.renderErrorMessages(m)
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

  renderErrorMessages(m) {
    m.div({ class: 'error-message' }, m => {
      m.p("You have errors. Please fix them and submit again.")
      m.ul(m => {
        this.errors.forEach(err => {
          m.li(err)
        })
      })
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

Reload your browser and click the "Submit" button without filling in the form.
You will see the error messages such as "Family name can't be blank."

[Table of Contents](../) - [Next Section](../09_partial)
