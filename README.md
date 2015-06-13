# Cape.JS

![Cape.JS logo](https://cdn.rawgit.com/oiax/capejs/logo1/doc/logo/capejs.svg)

[![Circle CI](https://circleci.com/gh/oiax/capejs.png?style=badge)](https://circleci.com/gh/oiax/capejs)

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
* **Router:** You can define *routes* with a DSL (domain specific language)
similar to that of Ruby on Rails.

The architecture and terminology of Cape.JS are strongly influenced by
[React](https://github.com/facebook/react),
[Riot](https://github.com/muut/riotjs)
and [Ruby on Rails](https://github.com/rails/rails).

If you want to learn about Cape.JS, check out the [Cape.JS Documentation](http://oiax.github.io/capejs/).

You can download and try a demo app from https://github.com/oiax/capejs-demo-on-rails.

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

## Browser Support

* Internet Explorer 11
* Chrome (Current)
* Firefox (Current)
* Safari (6.1+)

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
