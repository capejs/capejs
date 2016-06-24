# Cape.JS

[![Circle CI](https://circleci.com/gh/capejs/capejs.png?style=badge)](https://circleci.com/gh/capejs/capejs)
[![Npm Version](https://badge.fury.io/js/capejs.svg)](http://badge.fury.io/js/capejs)
[![Bower Version](https://badge.fury.io/bo/capejs.svg)](http://badge.fury.io/bo/capejs)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

![Cape.JS logo](https://cdn.rawgit.com/capejs/capejs/master/doc/logo/capejs.svg)

Cape.JS is a lightweight JavaScript UI framework with following features:

* **Full stack:** You can build *single-page applications* (SPAs) with Cape.JS.
* **Modular:** You can place *web widgets* built by Cape.JS to your static web sites.
* **Virtual DOM:** Cape.JS takes advantage of
[virtual-dom](https://github.com/Matt-Esch/virtual-dom)
of Matt-Esch for high performance rendering.
* **Markup builder:** The *markup builder* helps you to construct HTML DOM trees
with its simple, easy to learn syntax.
* **Form manipulation:** You can get or set the value of form fields
without [jQuery](https://jquery.com/).
* **Data stores:** Using *data stores*, you can build web applications
with *unidirectional data flow.*
* **Resource agents and collection agents:** Using *resource agents* and/or
*collection agents*, you can perform REST requests
to the web resources using [Fetch API](https://developer.mozilla.org/en/docs/Web/API/Fetch_API).
* **Router:** You can define *routes* with a DSL (domain specific language)
similar to that of Ruby on Rails.

The architecture and terminology of Cape.JS are strongly influenced by
[React](https://github.com/facebook/react),
[Riot](https://github.com/muut/riotjs)
and [Ruby on Rails](https://github.com/rails/rails).

## Table of Contents

* [Installation](#installation)
    * [Using CDN](#using-cdn)
    * [With npm](#with-npm)
    * [With Bower](#with-bower)
    * [With `capejs-rails` gem](#with-capejs-rails-gem)
* [simple examples](#simple-examples)
    * [Hello World](#hello-world)
    * [Generating DOM Tree](#generating-dom-tree)
* [Handling DOM Events](#handling-dom-events)
* [Router](#router)
* [Tutorials](#tutorials)
* [Demo Applications](#demo-applications)
    * [Greeter](#greeter)
    * [Todo List](#todo-list)
* [Browser Support](#browser-support)
* [Contributing](#contributing)
* [Acknowledgements](#acknowledgements)
* [Trademarks](#trademarks)
* [License](#license)

## Installation

Cape.JS is available from a variety of sources.

### Using CDN

To include Cape.JS on your web site, add this line to the `<head>` section of your HTML files:

```html
<script src="//cdn.rawgit.com/capejs/capejs/v1.5.1/dist/cape.min.js"></script>
```

### With npm

```text
$ npm install capejs
```

### With bower

```text
$ bower install capejs
```

### With `capejs-rails` gem

If you want to integrate Cape.JS with Ruby on Rails, you are recommended to use `capejs-rails` gem.

See [capejs/capejs-rails](https://github.com/capejs/capejs-rails) for details.

## Simple Examples

### Hello World

Put following two files on your PC:

`hello_message.html`

```html
<!DOCTYPE html>
<html>
<head>
  <title>HELLO WORLD</title>
  <meta charset="UTF-8">
  <script src="https://cdn.rawgit.com/capejs/capejs/v1.5.1/dist/cape.min.js"></script>
  <script src="./hello_message.js"></script>
</head>
<body>
  <div id="content"></div>
</body>
</html>
```

`hello_message.js`

```javascript
'use strict'

class HelloMessage extends Cape.Component {
  constructor(name) {
    super()
    this.name = name
  }

  render(m) {
    m.p(`Hello, ${this.name}!`)
  }
}

document.addEventListener("DOMContentLoaded", event => {
  let comp = new HelloMessage('world')
  comp.mount('content')
})
```

When you open `hello_message.html` with your browser, you will see the text "Hello, world!" on the screen.

### Generating DOM Tree

Edit the `render` method of `HelloMessage` class like this:

```javascript
  render(m) {
    m.h1('Greeting')
    m.class('message').p(m => {
      m.text('Hello, ')
      m.em(this.name + '!')
      m.sp()
      m.text('My name is Cape.JS.')
    })
  }
```

This generates a DOM tree roughly equivalent to this HTML fragment:

```html
<h1>Greeting</h1>
<p class='message'>Hello, <em>world!</em> My name is Cape.JS.</p>
```

## Handling DOM Events

Edit `hello_message.js` as follows and reload your browser:

```javascript
'use strict'

class HelloMessage extends Cape.Component {
  constructor(name) {
    super()
    this.names = [ 'alice', 'bob', 'charlie' ]
    this.name = name
  }

  render(m) {
    m.h1('Greeting')
    m.p('Who are you?')
    m.div(m => {
      this.names.forEach(name => {
        m.checked(name === this.name)
          .onclick(e => { this.name = e.target.value; this.refresh() })
          .radioButton('name', name)
        m.sp()
        m.text(name)
      })
    })
    m.class('message').p(m => {
      m.text('Hello, ')
      m.em(this.name + '!')
      m.sp()
      m.text('My name is Cape.JS.')
    })
  }
}

document.addEventListener("DOMContentLoaded", event => {
  let comp = new HelloMessage('alice')
  comp.mount('content')
})
```

You will see three radio buttons and by choosing one of them
you can change the message text.

Note that `this.refresh()` updates the DOM tree _very quickly_
using Virtual DOM technology.

## Router

Cape.JS has a built-in routing library. Using this you can define *routes* with a DSL (domain specific language)
similar to that of Ruby on Rails. Here is an example of `routes.js`:

```javascript
var $router = new Cape.Router()

$router.draw(m => {
  m.root('welcome')
  m.page('login')
  m.page('help')
  m.many('articles')
})
```

You can navigate the user to another page by the `navigateTo()` method:

```javascript
$router.navigateTo('help')
```

The following is a full example of Component definition:

```javascript
class WelcomePage extends Cape.Component {
  render(m) {
    m.div(m => {
      m.onclick(e => $router.navigateTo('help'))
        .class('link').span('Help')
    })
  }
}
```

When the user clicks on the "Help" link, the hash fragment of the URL changes
to `#help` and the `Help` component will be mounted.

Note that you can construct a _single-page application_ (SPA) in this manner.
In the above example, when the user is navigated to the `Help` component,
the HTML document itself does _not_ get reloaded. The `Help` component is rendered
by Cape.JS with the assistance of _virtual-dom._
An apparent _page transition_ happens within a _single_ page in fact.

## Tutorials

* [How to Make a Single Page Application (SPA) with Cape.JS and Rails - A Tutorial](http://capejs.github.io/capejs/tutorials/greeter/): A tutorial about Cape.JS router.
* [Cape.JS Primer](http://capejs.github.io/capejs/tutorials/capejs_primer/):
  Reading through this tutorial, you can learn the basics of Cape.JS programming.

## Demo Applications

### Greeter

You can get the source code of demo app from https://github.com/capejs/greeter-demo.

By reading its source code, you can learn how to construct _Single Page Applications_ (SPAs) combining the Cape.JS as front-end framework with the Rails as back-end framework.

### Todo List

You can download and try a demo app from https://github.com/oiax/capejs-demo-on-rails.

This is built upon the Ruby on Rails. When you start it and open `http://localhost:3000` with your browser, you will see a page like this:

![Screen shot of demo app](https://cdn.rawgit.com/capejs/capejs/26ce9cefc92d7dd30921995af57545ea1a41fc7a/doc/captures/todo-demo0.png)

Click the "Start" button to navigate to Login form. Then, enter your credentials (`alice` and `hotyoga`) to login to the sytem.

![Screen shot of demo app](https://cdn.rawgit.com/capejs/capejs/26ce9cefc92d7dd30921995af57545ea1a41fc7a/doc/captures/todo-demo1.png)

You can list, add, update and delete tasks here.

![Screen shot of demo app](https://cdn.rawgit.com/capejs/capejs/26ce9cefc92d7dd30921995af57545ea1a41fc7a/doc/captures/todo-demo2.png)

Click the "Logout" button to show the modal for confirmation.

![Screen shot of demo app](https://cdn.rawgit.com/capejs/capejs/915d96806352d70cce139cfb5b5020aec312444b/doc/captures/todo-demo3.png)

## Browser Support

* Microsoft Edge
* Internet Explorer 11
* Google Chrome (Current)
* Mozilla Firefox (Current)
* Safari (7.1+)
* Vivaldi (Current)

Any problem with Cape.JS in the above browsers should be reported as a bug in Cape.JS.

## Contributing

The Cape.JS is an open source project.

We encourage you to contribute to the Cape.JS!
Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## Acknowledgements

The logo of Cape.JS is created by [Junya Suzuki](https://github.com/junya-suzuki).

## Trademarks

"Cape.JS" and its logo are trademarks of Oiax Inc. All rights reserved.

## License

Cape.JS is released under [the MIT License](LICENSE).
