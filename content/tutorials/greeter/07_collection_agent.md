---
title: "Collection Agent - How to make a SPA with Cape.JS and Rails"
description: ""
---

[Table of Contents](../) - [Next Section](../08_error_messages)

```text
$ mkdir -p app/assets/javascripts/agents
$ touch app/assets/javascripts/agents/visitor_list_agent.es6
```

Add these lines to `app/assets/javascripts/agents/visitor_list_agent.es6`:

```javascript
class VisitorListAgent extends Cape.CollectionAgent {
  constructor(client, options) {
    super(client, options)

    this.resourceName = 'visitors'
    this.basePath = '/api/'
  }
}
```

----

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

  submit() {
    this.agent.create(this.paramsFor('visitor'), data => {
      if (data.result === 'Success') {
        $router.navigateTo('thanks')
      }
      else {
        this.refresh()
      }
    })
  }
}
```

[Table of Contents](../) - [Next Section](../08_error_messages)
