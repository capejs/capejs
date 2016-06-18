---
title: "Creating the Top Page - How to make a SPA with Cape.JS and Rails"
description: "Creating the top page where a Cape.JS componet will be mounted."
---

[Table of Contents](../) - [Next Section](../03_showing_reception_component)

### Add a route to the `top#index` action

Edit `config/routes.rb` so that its content becomes like as:

```ruby
Rails.application.routes.draw do
  root 'top#index'
end
```

### Creating the `top#index` action

```text
$ bin/rails g controller top index
```

Edit `app/views/top/index.html.erb` so that its content becomes like as:

```ruby
<h1>Greeter</h1>
<div id='main'></div>
```

### Starting the server

```text
$ bin/rails s
```

Open `http://localhost:3000/` with your browser to see if the page is rendered without errors.
It should have just a single "Greeter" heading.

[Table of Contents](../) - [Next Section](../03_showing_reception_component)
