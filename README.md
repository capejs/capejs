# Cape.JS

![Cape.JS logo](https://cdn.rawgit.com/oiax/capejs/master/doc/logo/capejs.svg)

[![Circle CI](https://circleci.com/gh/oiax/capejs.png?style=badge)](https://circleci.com/gh/oiax/capejs)
[![Npm Version](https://badge.fury.io/js/capejs.svg)](http://badge.fury.io/js/capejs)
[![Bower Version](https://badge.fury.io/bo/capejs.svg)](http://badge.fury.io/bo/capejs)

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

If you want to learn about Cape.JS, check out the [Cape.JS Documentation](http://oiax.github.io/capejs/).

## A simple example

The following example will insert `<div>Hello, World!</div>` into the `div#hello-message` element.

`index.html`

```html
<h1>Greeting from Cape.JS</h1>
<div id="hello-message" data-name="World"></div>

<script src="./hello_message.js"></script>
<script>
  var component = new HelloMesage();
  component.mount('hello-message');
</script>
```

`hello_message.js`

```javascript
var HelloMesage = Cape.createComponentClass({
  render: function(m) {
    m.div('Hello, ' + this.root.data.name + '!')
  }
});
```

In this example, the `div` method corresponds to the `div` tag of HTML.
If you replace it with `p`, it inserts `<p>Hello, World!</p>`.
In this way, you can generate [any HTML5 element](http://www.w3.org/TR/html-markup/elements.html),
such as `blockquote`, `h1`, `strong`, `video`, etc.

This example is explained in detail
in the [Hello World](http://oiax.github.io/capejs/components/#hello-world) section
of *Cape.JS Documentation.*

## Tutorials

* [Cape.JS Primer](http://oiax.github.io/capejs/tutorials/capejs_primer/):
  Reading through this tutorial, you can learn the basics of Cape.JS programming.

## A demo application

You can download and try a demo app from https://github.com/oiax/capejs-demo-on-rails.

This is built upon the Ruby on Rails. When you start it and open `http://localhost:3000` with your browser, you will see a page like this:

![Screen shot of demo app](https://cdn.rawgit.com/oiax/capejs/26ce9cefc92d7dd30921995af57545ea1a41fc7a/doc/captures/todo-demo0.png)

Click the "Start" button to navigate to Login form. Then, enter your credentials (`alice` and `hotyoga`) to login to the sytem.

![Screen shot of demo app](https://cdn.rawgit.com/oiax/capejs/26ce9cefc92d7dd30921995af57545ea1a41fc7a/doc/captures/todo-demo1.png)

You can list, add, update and delete tasks here.

![Screen shot of demo app](https://cdn.rawgit.com/oiax/capejs/26ce9cefc92d7dd30921995af57545ea1a41fc7a/doc/captures/todo-demo2.png)

Click the "Logout" button to show the modal for confirmation.

![Screen shot of demo app](https://cdn.rawgit.com/oiax/capejs/915d96806352d70cce139cfb5b5020aec312444b/doc/captures/todo-demo3.png)

## Browser Support

* Microsoft Edge
* Internet Explorer 11
* Google Chrome (Current)
* Mozilla Firefox (Current)
* Safari (7.1+)

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
