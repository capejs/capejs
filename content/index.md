---
title: "Index"
type: "index"
weight: 0
---

<a class="anchor" id="what-is"></a>
## What is Cape.JS?

Cape.JS is a lightweight Javascript UI framework based on [virtual-dom](https://github.com/Matt-Esch/virtual-dom) of Matt-Esch.

* **Small but full stack:** Cape.JS is consists of three basic but powerful classes; *Component, DataStore,* and *Router.* You can utilize them to create web widgets and single-page applications (SPAs).
* **Virtual DOM:** Cape.JS takes advantage of [virtual-dom](https://github.com/Matt-Esch/virtual-dom) for high performance UI rendering. You don't have to rely on *jQuery* for DOM manipulation anymore.
* **Concise syntax:** The *markup builder* helps you to construct HTML DOM trees with its simple, easy to learn syntax. You can add a `div` element by calling markup builder's `div` method, for example.

The architecture and terminology of Cape.JS are strongly influenced by [React](https://github.com/facebook/react),  [Riot](https://github.com/muut/riotjs) and [Ruby on Rails](https://github.com/rails/rails).

<a class="installation" id="installation"></a>
## Installation

If you just want to use Cape.JS in your web site, insert the following snippet
to the `<head>` section of your HTML files.

```html
<link href="https://cdn.rawgit.com/oiax/capejs/v1.0.0-beta.4/dist/cape.min.js"
  rel="stylesheet">
```

You can get the package for [npm](https://www.npmjs.com/) with following command:

```
$ npm install capejs
```

You can get the package for [bower](http://bower.io/) with following command:

```
$ bower install capejs
```

<a class="anchor" id="faq"></a>
## FAQ

### Is it "Cape.JS", "CapeJS", or "capejs"?

The official name is **Cape.JS.**
Its package name for [npm](https://www.npmjs.com)
and [bower](http://bower.io) is **capejs** (without the dot).

At the very initial phase of development, we called it "CapeJS", but
we don't use it anymore.

### Is it production ready?

Not yet. We adopt [Semantic Versioning](http://semver.org/) for Cape.JS.
According to this system, major version (0.y.z) zero is for initial development.
We have released the version 1.0.0-beta.1, but the public API of Cape.JS should
not be considered stable.

### Which browsers are supported?

Currently we test Cape.JS only on the latest versions of Chrome and Firefox.
We are planning to add support for Internet Explorer (version 8 or higher) and Safari
until the release of Cape.JS 1.0.


### How can I contribute?

The Cape.JS is an open source project. Everyone can help.
See [CONTRIBUTING.md](https://github.com/oiax/capejs/CONTRIBUTING.md) for details.

<h2 id="acknowledgements">Acknowledgements</h2>

The logo of Cape.JS is created by [Junya Suzuki](https://github.com/junya-suzuki).

<h2 id="trademarks">Trademarks</h2>

"Cape.JS" and its logo are trademarks of Oiax Inc. All rights reserved.

<h2 id="license">License</h2>

Cape.JS is released under [the MIT License](https://github.com/oiax/capejs/LICENSE).
