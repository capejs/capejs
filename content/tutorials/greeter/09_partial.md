---
title: "Refactoring with Partials - How to make a SPA with Cape.JS and Rails"
description: ""
---

[Table of Contents](../) - [Next Section](../10_listing_visitors)

```text
$ mkdir -p app/assets/javascripts/partials
$ touch app/assets/javascripts/partials/error_message.es6
$ touch app/assets/javascripts/partials/text_field_set.es6
```

Add these lines to `app/assets/javascripts/partials/error_message.es6`:

```javascript
class ErrorMessage extends Cape.Partial {
  render(m) {
    m.class('alert alert-danger').div(m => {
      if (Object.keys(this.parent.errors).length === 1)
        m.text('An error is found in the form.').sp()
          .text('Please correct it and try again.')
      else
        m.text('Some errors are found in the form.').sp()
          .text('Please correct them and try again.')
    })
  }
}
```

Add these lines to `app/assets/javascripts/partials/text_field_set.es6`:

```javascript
class TextFieldSet extends Cape.Partial {
  render(m, name, labelText) {
    let errors = this.parent.errors && this.parent.errors[name]

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
}
```

Edit `app/assets/javascripts/components/visitor_form.es6`:

```javascript
class VisitorForm extends Cape.Component {
  init() {
    this.agent = new VisitorListAgent(this)
    this.refresh()
  }

  render(m) {
    let errorMessage = new ErrorMessage(this)
    let textFieldSet = new TextFieldSet(this)

    m.p("Please fill in your name on this form.")

    if (this.errors) errorMessage.render(m)

    m.formFor('visitor', m => {
      textFieldSet.render(m, 'family_name', 'Family Name')
      textFieldSet.render(m, 'given_name', 'Given Name')
      m.onclick(e => this.submit())
        .class('btn btn-primary').btn('Submit')
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
