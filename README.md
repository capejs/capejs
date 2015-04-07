# CapeJS

CapeJS is a lightweight Javascript UI library based on [virtual-dom](https://github.com/Matt-Esch/virtual-dom).

## Examples

### Hello World

```html
<body>
  <h1>Greeting from CapeJS</h1>
  <div id="hello-message" data-name="World"></div>

  <script>
    var HelloMesage = function() {};

    $.extend(HelloMesage.prototype, CapeJS.Component.prototype, {
      render: function() {
        return this.markup(function(m) {
          m.div('Hello ' + this.root.getAttribute('data-name') + '!')
        })
      }
    });

    var component = new HelloMesage();
    component.mount('hello-message');
  </script>
</body>
```

This example will insert `<div>Hello World!</div>` into the `div#hello-message` element.
