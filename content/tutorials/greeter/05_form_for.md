---
title: "Manipulating an HTML Form - How to make a SPA with Cape.JS and Rails"
description: ""
---

[Table of Contents](../) - [Next Section](../06_models_and_resources)


Edit `app/assets/javascripts/components/visitor_form.es6`:

```javascript
class VisitorForm extends Cape.Component {
  render(m) {
    m.h2('Visitors Entry Form')
    m.p("Please fill in your name on this form.")
    m.formFor('visitor', m => {
      m.div(m => {
        m.labelFor('given_name', 'Given Name').sp().textField('given_name')
      })
      m.div(m => {
        m.labelFor('family_name', 'Family Name').sp().textField('family_name')
      })
      m.onclick(e => $router.navigateTo('thanks')).btn('Submit')
    })
  }
}
```

[Table of Contents](../) - [Next Section](../06_models_and_resources)
