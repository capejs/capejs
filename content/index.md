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
* **Resource agents and collection agents:** Using *resource agents* and/or
*collection agents*, you can perform REST requests
to the web resources using [Fetch API](https://developer.mozilla.org/en/docs/Web/API/Fetch_API).
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
<script src="//cdn.rawgit.com/oiax/capejs/v1.5.0/dist/cape.min.js"></script>
```

You can get the package for [npm](https://www.npmjs.com/) <i class="fa fa-external-link"></i> with following command:

```
$ npm install capejs
```

You can get the package for [bower](http://bower.io/) <i class="fa fa-external-link"></i> with following command:

```
$ bower install capejs
```

## Notes on the _Promise_ and _Fetch API_

In order to take advantage of the full capabilities of Cape.JS,
you may have to install _pollyfills_ for
the [Promise](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise)
<i class="fa fa-external-link"></i>
and [Fetch API](https://developer.mozilla.org/en/docs/Web/API/Fetch_API)
<i class="fa fa-external-link"></i>,
because these technologies are only supported by some modern browsers (Firefox and Chrome).

If you want to support Microsoft Edge, Internet Explorer and Safari,
you need to include these pollyfills into your application
by adding the following lines to the `<head>` section of your HTML files.

```html
<script src="//cdnjs.cloudflare.com/ajax/libs/es6-promise/3.2.2/es6-promise.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/fetch/1.0.0/fetch.min.js"></script>
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

Yes, it is.
We adopt [Semantic Versioning](http://semver.org/) <i class="fa fa-external-link"></i> for Cape.JS,
and we have released the version 1.0.0.

### Which browsers are supported?

We test Cape.JS on Microsoft Edge, Internet Explorer 11, Safari (7.1+) and the latest versions of Chrome and Firefox.

Note that we have no plan to support the Internet Explorer 8, 9, and 10.


### How can I contribute?

The Cape.JS is an open source project. Everyone can help.
See [CONTRIBUTING.md](https://github.com/capejs/capejs/CONTRIBUTING.md)
<i class="fa fa-external-link"></i>for details.

<h2 id="acknowledgements">Acknowledgements</h2>

The logo of Cape.JS is created by
[Junya Suzuki](https://github.com/junya-suzuki) <i class="fa fa-external-link"></i>.

<h2 id="trademarks">Trademarks</h2>

"Cape.JS" and its logo are trademarks of Oiax Inc. All rights reserved.

<h2 id="license">License</h2>

Cape.JS is released under
[the MIT License](https://github.com/capejs/capejs/LICENSE) <i class="fa fa-external-link"></i>.
