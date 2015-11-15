---
title: "Change displaying order (2) - Cape.JS Primer"
---

From [the previous lecture](../20_reordering1), I started making the function to interchange the displaying order of the task. I just set the button moving up and down now. I'll make API on the server this time.

---

First, introduce Gem package [acts_as_list](https://github.com/swanandp/acts_as_list) that make processing to interchange the list's order.

`Gemfile`

```text
gem 'acts_as_list'
```

Run next command on the terminal.

```text
bin/bundle
```

Run the commands below by following `acts_as_list`'s [README.md](https://github.com/swanandp/acts_as_list#example).

```text
bin/rails g migration AddPositionToTasks position:integer
bin/rake db:migrate
bin/rake db:reset
```

Mount `acts_as_list` to the class `Task`. Rewrite `app/models/task.rb` as following.

```text
class Task < ActiveRecord::Base
  acts_as_list
end
```

---

Next, I'll make API. `config/routes.rb` is now like following.

```text
Rails.application.routes.draw do
  root 'top#index'

  namespace :api do
    resources :tasks, only: [ :index, :create, :update, :destroy ]
  end
end
```

Rewrite it as following.

```text
Rails.application.routes.draw do
  root 'top#index'

  namespace :api do
    resources :tasks, only: [ :index, :create, :update, :destroy ] do
      patch :move_higher, :move_lower, on: :member
    end
  end
end
```

`acts_as_list` means "move up" and as `move_higher` and "move down" as `move_lower`. I named API like them.

Next, implement the action  `move_higher` and `move_lower`. Rewrite `app/controllers/tasks_controller.rb` as following.

```text
class Api::TasksController < ApplicationController
  def index
    @tasks = Task.order(position: :asc)
  end

  (snip)

  def destroy
    Task.find(params[:id]).destroy
    render text: 'OK'
  end

  def move_higher
    task = Task.find(params[:id])
    task.move_higher
    render text: 'OK'
  end

  def move_lower
    task = Task.find(params[:id])
    task.move_lower
    render text: 'OK'
  end

  private
  (snip)
```

Thank to the `acts_as_list` gem, it's very simple code. I use these actions for Ajax requests. It just returns the string "OK" to the browser from the server.

----

Now API is ready. On [the next lecture](../22_reordering3), I'll finish JavaScript by using this API.
