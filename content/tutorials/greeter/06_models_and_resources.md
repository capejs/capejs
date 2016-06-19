---
title: "Models and Resources - How to make a SPA with Cape.JS and Rails"
description: "Preparing models and resources on the server-side app."
---

[Table of Contents](../) - [Next Section](../07_collection_agent)

Create `Visitor` model

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

----

```text
$ bin/rails g controller api/visitors
```

Edit `config/routes.rb`:

```ruby
Rails.application.routes.draw do
  root 'top#index'

  namespace :api do
    resources :visitors, only: [ :create ]
  end
end
```

----

Edit `app/controllers/api/visitors_controller.rb`:

```text
class Api::VisitorsController < ApplicationController
  def create
    @visitor = Visitor.new(visitor_params)
    if @visitor.save
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
$ touch app/views/visitors/errors.jbuilder
```

Add these lines to `app/views/visitors/errors.jbuilder`

```ruby
json.errors do
  @visitor.errors.keys.each do |key|
    json.set! key do
      json.array! @visitor.errors.full_messages_for(key)
    end
  end
end
```

[Table of Contents](../) - [Next Section](../07_collection_agent)
