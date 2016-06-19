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
    m.p("Please fill in your name on this form.")
    if (this.errors) this.renderErrorMessages(m)
    m.formFor('visitor', m => {
      m.class('form-group').fieldset(m => {
        m.labelFor('family_name', 'Family Name')
        m.class('form-control').textField('family_name')
      })
      m.class('form-group').fieldset(m => {
        m.labelFor('given_name', 'Given Name')
        m.class('form-control').textField('given_name')
      })
      m.onclick(e => this.submit())
        .class('btn btn-primary').btn('Submit')
    })
  }

  renderErrorMessages(m) {
    m.class('alert alert-danger')
    if (this.errors.length === 1)
      m.div("The form has an error. Please correct it and try again.")
    else
      m.div("The form has some errors. Please correct them and try again.")
    m.ul(m => {
      this.errors.forEach(err => {
        m.class('text-danger').li(err + '.')
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
