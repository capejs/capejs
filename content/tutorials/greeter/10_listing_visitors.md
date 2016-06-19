---
title: "Listing Registered Visitors - How to make a SPA with Cape.JS and Rails"
description: "Learn how to fetch collection data from the server and render them as a list using Cape.JS's markup builder."
---

[Table of Contents](../)

Edit `config/routes.rb`:

```ruby
Rails.application.routes.draw do
  root 'top#index'

  namespace :api do
    resources :visitors, only: [ :index, :create ]
  end
end
```

Edit `app/controllers/api/visitors_controller.rb`:

```text
class Api::VisitorsController < ApplicationController
  def index
    @visitors = Visitor.order('id')
  end

  def create
    visitor = Visitor.new(visitor_params)
    if visitor.save
      render json: { result: 'Success' }
    else
      render action: 'errors', format: 'json'
    end
  end

  private
  def visitor_params
    params.require(:visitor).permit(:family_name, :given_name)
  end
end
```

```text
$ touch app/views/visitors/index.jbuilder
```

Add this line to `app/views/visitors/index.jbuilder`

```ruby
json.visitors(@visitors, :id, :family_name, :given_name)
```

----

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

----

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
      m.h4('Visitors List')
      m.ol(m => {
        this.agent.objects.forEach(visitor => {
          m.li(`${visitor.family_name}, ${visitor.given_name}`)
        })
      })
      m.div(m => {
        m.onclick(e => $router.navigateTo(''))
          .class('btn btn-primary')
          .btn('Go Back')
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
        .class('btn btn-primary')
        .btn('Proceed to the Entry Form')
      m.sp()
      m.onclick(e => $router.navigateTo('visitors'))
        .class('btn btn-default')
        .btn('Show Visitors List')
    })
  }
}
```

Reload your browser and click the second button to see the the list of registered visitors.

That's all for this tutorial.

[Table of Contents](../)
