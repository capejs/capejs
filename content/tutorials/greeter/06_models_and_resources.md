---
title: "Models and Resources - How to make a SPA with Cape.JS and Rails"
description: ""
---

[Table of Contents](../) - [Next Section](#)

### Creating `Visitor` model

```text
$ bin/rails g model visitor family_name:string given_name:string
$ bin/rails db:migrate
```

Edit `app/models/visitor.rb`:

```ruby
class Visitor < ApplicationRecord
  validates :family_name, :given_name, presence: true
end
```

### Creating `api/visitors` resources

```text
$ bin/rails g controller api/visitors
```

Edit `config/routes.rb`:

```ruby
Rails.application.routes.draw do
  root 'top#index'

  namespace :api do
    resources :visitors, only: [ :index, :create ]
  end
end
```

### Preparing the `api/visitors` controller

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
      render json: { result: 'Failure', errors: visitor.errors.full_messages }
    end
  end

  private
  def visitor_params
    params.require(:visitor).permit(:family_name, :given_name)
  end
end
```

```text
$ touch app/views/api/visitors/index.jbuilder
```

Add this line to `app/views/api/visitors/index.jbuilder`:

```ruby
json.visitors(@visitors, :id, :family_name, :given_name)
```

[Table of Contents](../) - [Next Section](#)
