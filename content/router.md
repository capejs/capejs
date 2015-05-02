---
title: "Router"
---

[Simple Routes](#simple-routes) -
[Resource Based Routes](#resource-based-routes) -
[Namespaces](#namespaces) -
[Changing Root Container](#changing-root-container) -
[Session](#session) -
[Flash](#flash) -
[Before-navigation Callbacks](#before-navigation-callbacks)

<a class="anchor" id="simple-routes"></a>
### Simple Routes

Cape.JS's router reacts to the changes of URL hash fragment and replace the
component mounted on the target node.

The following example illustrates the basic concept of router and routes.

#### index.html

```html
<div>
  <a href="#">Top</a>
  <a href="#about">About</a>
  <a href="#help">Help</a>
</div>

<div id="main"></div>

<script src="./components.js"></script>
<script src="./router.js"></script>
```

#### components.js

```javascript
var TopPage = Cape.createComponentClass({
  render: function(m) {
    m.p('This is the top page.')
  }
});

var AboutPage = Cape.createComponentClass({
  render: function(m) {
    m.p('This is the about page.')
  }
});

var HelpPage = Cape.createComponentClass({
  render: function(m) {
    m.p('This is the help page.')
  }
});
```

#### router.js

```javascript
var router = new Cape.Router();
router.draw(function(m) {
  m.root('top_page');
  m.page('about', 'about_page');
  m.page('help', 'help_page');
})
router.mount('main');
router.start();
```

`m.root('top_page')` connects the empty hash to the component `TopPage`
so that the browser displays the top page when we open this site.

`m.page('about', 'about_page')` connects the hash `#about` to the component `AboutPage`.
When we click the 'About' link, the `TopPage` component is removed and
the `AboutPage` component gets mounted.

Each connection between a hash and a component is called *route.*
The *router* continues to watch the changes of URL hash and switches
components according to the routes.

You can find the source code of working demo on
https://github.com/oiax/capejs/tree/master/demo/simple_routes.

<a class="anchor" id="resource-based-routes"></a>
### Resource Based Routes

This section is not yet prepared.

<a class="anchor" id="namespaces"></a>
### Namespaces

This section is not yet prepared.

<a class="anchor" id="changing-root-container"></a>
### Changing Root Container

This section is not yet prepared.

<a class="anchor" id="session"></a>
### Session

This section is not yet prepared.

<a class="anchor" id="flash"></a>
### Flash

This section is not yet prepared.

<a class="anchor" id="before-navigation-callbacks"></a>
### Before-navigation Callbacks

This section is not yet prepared.
