---
title: "Index"
type: "index"
weight: 0
---

<a class="anchor" id="what-is"></a>
## What is Cape.JS?

Cape.JS is a lightweight JavaScript UI framework with following features:

* **Full stack:** You can build *single-page applications* (SPAs) with Cape.JS.
* **Modular:** You can place *web widgets* built by Cape.JS to your static web sites.
* **Virtual DOM:** Cape.JS takes advantage of
[virtual-dom](https://github.com/Matt-Esch/virtual-dom) <i class="fa fa-external-link"></i>
of Matt-Esch for high performance rendering.
* **Markup builder:** The *markup builder* helps you to construct HTML DOM trees
with its simple, easy to learn syntax.
* **Form manipulation:** You can get or set the value of form fields
without [jQuery](https://jquery.com/) <i class="fa fa-external-link"></i>.
* **Data stores:** Using *data stores*, you can build web applications
with *unidirectional data flow.*
* **Router:** You can define *routes* with a DSL (domain specific language)
similar to that of Ruby on Rails.

The architecture and terminology of Cape.JS are strongly influenced by
[React](https://github.com/facebook/react) <i class="fa fa-external-link"></i>,
[Riot](https://github.com/muut/riotjs) <i class="fa fa-external-link"></i>
and [Ruby on Rails](https://github.com/rails/rails) <i class="fa fa-external-link"></i>.

<a class="anchor" id="installation"></a>
## Installation

If you just want to use Cape.JS in your web site, insert the following snippet
to the `<head>` section of your HTML files.

```html
<link href="https://cdn.rawgit.com/oiax/capejs/v1.0.0-beta.6/dist/cape.min.js"
  rel="stylesheet">
```

You can get the package for [npm](https://www.npmjs.com/) <i class="fa fa-external-link"></i> with following command:

```
$ npm install capejs
```

You can get the package for [bower](http://bower.io/) <i class="fa fa-external-link"></i> with following command:

```
$ bower install capejs
```

<a class="anchor" id="faq"></a>
## FAQ

### Is it "Cape.JS", "CapeJS", or "capejs"?

The official name is **Cape.JS.**
Its package name for [npm](https://www.npmjs.com) <i class="fa fa-external-link"></i>
and [bower](http://bower.io) <i class="fa fa-external-link"></i> is **capejs** (without the dot).

At the very initial phase of development, we called it "CapeJS", but
we don't use it anymore.

### Is it production ready?

Not yet. We adopt [Semantic Versioning](http://semver.org/) <i class="fa fa-external-link"></i> for Cape.JS.
According to this system, major version (0.y.z) zero is for initial development.
We have released the version 1.0.0-beta.x, but the public API of Cape.JS should
not be considered stable.

### Which browsers are supported?

Currently we test Cape.JS only on the latest versions of Chrome and Firefox.
We are planning to add support for Internet Explorer (version 8 or higher) and Safari
until the release of Cape.JS 1.0.


### How can I contribute?

The Cape.JS is an open source project. Everyone can help.
See [CONTRIBUTING.md](https://github.com/oiax/capejs/CONTRIBUTING.md)
<i class="fa fa-external-link"></i>for details.

<h2 id="acknowledgements">Acknowledgements</h2>

The logo of Cape.JS is created by
[Junya Suzuki](https://github.com/junya-suzuki) <i class="fa fa-external-link"></i>.

<h2 id="trademarks">Trademarks</h2>

"Cape.JS" and its logo are trademarks of Oiax Inc. All rights reserved.

<h2 id="license">License</h2>

Cape.JS is released under
[the MIT License](https://github.com/oiax/capejs/LICENSE) <i class="fa fa-external-link"></i>.
