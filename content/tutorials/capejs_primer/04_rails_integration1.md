---
title: "Integrate Cape.JS with Ruby on Rails (1) - Cape.JS Primer"
---

On 3 lectures including [the previous time](../03_creating_text_nodes), I explained how to create virtual DOM by Cape.JS.

From this lecture, I'll explain steps to integrate Cape.JS with [Ruby on Rails](http://rubyonrails.org/).

<div class="note">
Please acquire a demonstration application at <a href="https://github.com/oiax/capejs-demo-on-rails">https://github.com/oiax/capejs-demo-on-rails</a> if you are impatient like "I want you to show me a source code not explanation." A sample Rail application we make on this lecture will be a very similar one like the demonstration application.
</div>

As a precondition, Ruby (v2.1 or later), Rails 4.2、Node.js (v0.12 or later) and Git (v2.0 or later) are supposed to be installed on your PC.

<div class="note">
I skip the explanation of steps to install each software. Please search the word such as "node.js install windows" and "git install mac" on the internet.
</div>

----

The application we will make on some lectures from this lecture is easy one to administrate "To-do list" The data of To-do list is stored in SQlite3 database. We don't create the function of users' singing in･out.

Let's begin to create framework of the application.

```text
$ rails new todo_list --skip-bundle
$ cd todo_list
```

Open `Gemfile` on the text editor and add a line as following at the end.:

```ruby
gem 'sprockets-es6', '~> 0.6.1'
```

<div class="note">
Tell the truth, this added line isn't necessary to use Cape.JS. But, Cape.JS programming becomes more fun if you use the syntax of ECMAScript 6. (which is commonly called ES6. JavaScript's standard issue of next term) <code>sprockets-es6</code> is a Gem package that convert the program written in ES6 to the running one for JavaScript.
</div>

Then, install the Gem packages.

```text
$ bin/bundle
```

<div class="note">
Write <code>ruby</code> before the command if you are Windows user." Generally, when you run the command starting with <code>bin/</code>, you need to write  <code>ruby</code> at the top on Windows.
</div>

----

And install [Bower](http://bower.io/) (JavaScript's package administration tool).

```text
$ sudo npm install -g bower
```

<div class="note">
On Windows, omit <code>sudo</code>.
</div>

Create a new file `.bowerrc` on the text editor and write as following.

```json
{
  "directory": "vendor/assets/components"
}
```

The package administrated by Bower is installed at `vendor/assets/components` directory.

Next, install Cape.JS.:

```text
$ bower install capejs
```

As that above, install Bootstrap, Font Awesome, and lodash by using Bower.

```text
$ bower install bootstrap fontawesome lodash
```

<div class="note">
These packages don't need Cape.JS but we install them here because we will use them later of the next lecture.
</div>

Moreover, set default of Bower. Run the command `bower init` on terminal. Keep pushing Enter key until the prompt `? name: (todo_list)` display at first. Since that, about 10 questions is displayed but just keep pushing Enter key with empty value.

As the result, the file `bower.json` with the content like following is made.

```json
{
  "name": "todo_list",
  "version": "0.0.0",
  "authors": [
    "John Doe <john@example.com>"
  ],
  "license": "MIT",
  "ignore": [
    "**/.*",
    "node_modules",
    "bower_components",
    "vendor/assets/components",
    "test",
    "tests"
  ],
  "dependencies": {
    "capejs": "~1.0.0",
    "bootstrap": "~3.3.4",
    "fontawesome": "~4.3.0",
    "lodash": "~3.9.3"
  }
}
```

<div class="note">
At the time when I write this article(May 29th, 2015), There are version numbers in <code>dependencies</code> section like above. But, they will change in the future. It may not be a big problem if the last version number changes. In case that first one and second one are different, rewrite <code>bower.json</code> as above and run `bower install` to let them being same before trying the contents of this lecture.
</div>

<div class="note">
Bootstrap's <code>3.3.5</code> was released on June 17th, 2015 but it doesn't work well because this version has bad chemistry with Rails (accurately, with Sprockets). So, change bootstrap's version number in <code>dependencies</code> section of <code>bower.json</code> from <code>~3.3.4</code> to <code>=3.3.4</code>. The version number is fixed to <code>3.3.4</code> by doing this.
</div>

----

Mount Cape.JS to the Rails application. Open `app/assets/javascripts/application.js` on the text editor and rewrite the content as following.:

```javascript
//= require jquery
//= require jquery_ujs
//= require turbolinks
//= require capejs
//= require bootstrap
//= require lodash
//= require_tree .
```

In addition, open `app/assets/stylesheets/application.css` and rewrite the content as following.:

```css
/*
 *= require_tree .
 *= require fontawesome
 *= require_self
 */
```

Now, it's ready to start developing Rails application by using Cape.JS.

----

On [the next lecture](../05_rails_integration2), we'll still continue to develop "To-do list" application.
