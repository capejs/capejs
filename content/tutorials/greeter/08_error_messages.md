---
title: "Showing Error Messages - How to make a SPA with Cape.JS and Rails"
description: "Learn how to show error messages on the form using JSON data form ther server."
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
    if (this.errors) this.renderErrorMessage(m)
    m.formFor('visitor', m => {
      this.renderTextFieldSet(m, 'family_name', 'Family Name')
      this.renderTextFieldSet(m, 'given_name', 'Given Name')
      m.onclick(e => this.submit())
        .class('btn btn-primary').btn('Submit')
    })
  }

  renderErrorMessage(m) {
    m.class('alert alert-danger').div(m => {
      if (Object.keys(this.errors).length === 1)
        m.text('An error is found in the form.').sp()
          .text('Please correct it and try again.')
      else
        m.text('Some errors are found in the form.').sp()
          .text('Please correct them and try again.')
    })
  }

  renderTextFieldSet(m, name, labelText) {
    let errors = this.errors && this.errors[name]

    if (errors) m.class('has-danger')

    m.class('form-group').fieldset(m => {
      m.class('form-control-label').labelFor(name, labelText)
      m.class('form-control').textField(name)

      if (errors) {
        m.class('text-danger small').ul(m => {
          errors.forEach(error => m.li(error))
        })
      }
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
