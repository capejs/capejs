---
title: "Collection Agent - How to make a SPA with Cape.JS and Rails"
description: ""
---

[Table of Contents](../) - [Next Section](../08_error_messages)

### Adding the `VisitorListAgent` class

```text
$ mkdir -p app/assets/javascripts/agents
$ touch app/assets/javascripts/agents/visitor_list_agent.es6
```

Add these lines to `app/assets/javascripts/components/agents.es6`:

```javascript
class VisitorListAgent extends Cape.CollectionAgent {
  constructor(client, options) {
    super(client, options);
    this.resourceName = 'visitors';
    this.basePath = '/api/';
  }
}
```

### Using a Collection Agent

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
        this.refresh()
      }
    })
  }
}
```

[Table of Contents](../) - [Next Section](../08_error_messages)
