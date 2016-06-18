---
title: "Setting up - How to make a SPA with Cape.JS and Rails"
description: "Creating a Rails app skeleton and setting it up for Cape.JS integration."
---

[Table of Contents](../) - [Next Section](../02_creating_top_page)

### Checking required softwares

```text
$ ruby -v
$ rails -v
```

You need Ruby 2.2.2 or higher and Rails 5.0.0.rc1.

### Creating the Rails app skeleton

```text
$ rails new greeter -BT
```

The meaning of options:

* `-B`: Don't run bundle install (`--skip-bundle`)
* `-T`: Skip test files (`--skip-test`)

### Setting up the `capejs-rails`

Remove these lines from the `Gemfile`:

```ruby
gem 'sass-rails', '~> 5.0'
gem 'coffee-rails', '~> 4.1.0'
gem 'jquery-rails'
gem 'turbolinks', '~> 5.x'
```

<div class="note">
You can keep <code>coffee-rails</code>, <code>jquery-rails</code> and <code>turbolinks</code>.
We remove them in order to demonstrate that Cape.JS does <em>not</em> depend on jQuery.
</div>

Add these lines to the `Gemfile`:

```ruby
gem 'capejs-rails'
gem 'sass-rails', '~> 6.0.0.beta1'
gem 'sprockets', '~> 4.0.0.beta2'
gem 'sprockets-rails'
gem 'babel-transpiler'
```

```text
$ bin/bundle
```

### Editing `application.js`

Edit `app/assets/javascripts/application.js` so that its content becomes as follows:

```javascript
//= require cape
//= require_tree .
```

We removed three lines that require `jquery`, `jquery_ujs` and `turbolinks`.
Keep them if you kept `jquery-rails` and `turbolinks` on `Gemfile`.

### Creating `generators.rb`

```text
$ touch config/initializers/generators.rb
```

Add these lines to `config/initializers/generators.rb`:

```ruby
Rails.application.config.generators do |g|
  g.helper false
  g.assets false
  g.test_framework false
  g.skip_routes true
end
```

[Table of Contents](../) - [Next Section](../02_creating_top_page)
