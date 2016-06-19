---
title: "Manipulating an HTML Form - How to make a SPA with Cape.JS and Rails"
description: "Learn how to construct an HTML form with Cape.JS's markup builder."
---

[Table of Contents](../) - [Next Section](../06_models_and_resources)


Edit `app/assets/javascripts/components/visitor_form.es6`:

```javascript
class VisitorForm extends Cape.Component {
  render(m) {
    m.p("Please fill in your name on this form.")
    m.formFor('visitor', m => {
      m.class('form-group').fieldset(m => {
        m.class('form-control-label').labelFor('family_name', 'Family Name')
        m.class('form-control').textField('family_name')
      })
      m.class('form-group').fieldset(m => {
        m.class('form-control-label').labelFor('given_name', 'Given Name')
        m.class('form-control').textField('given_name')
      })
      m.onclick(e => $router.navigateTo('thanks'))
        .class('btn btn-primary').btn('Submit')
    })
  }
}
```

This component creates a DOM structure roughly equivalent to the following HTML fragment:

```html
<p>Please fill in your name on this form.</p>
<form name="visitor">
<fieldset class="form-group">
<label for="visitor-field-family-name"
  class="form-control-label">Family Name</label>
<input type="text" name="family_name"
  id="visitor-field-family-name" class="form-control">
</fieldset>
<fieldset class="form-group">
<label for="visitor-field-given-name"
  class="form-control-label">Given Name</label>
<input type="text" name="given_name"
  id="visitor-field-given-name" class="form-control">
</fieldset>
<button type="button" class="btn btn-primary" value=""
  onclick="function(e) { $router.navigateTo('thanks') }">Submit</button>
</form>
```

[Table of Contents](../) - [Next Section](../06_models_and_resources)
