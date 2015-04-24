---
title: "API Reference"
type: "api-index"
---

### The `Cape` object

The **Cape.JS** defines a single global variable [Cape](./cape).
It has some utility methods, such as `extend`, `merge`, etc.

It also has the `session` property whose value is a hash object.
This property can be used to store arbitrary data by developers.

### Classes

The **Cape.JS** consists of following five classes:

* [Cape.Component](./component)
* [Cape.MarkupBuilder](./markup_builder)
* [Cape.DataStore](./data_store)
* [Cape.Router](./router)
* [Cape.RoutingMapper](./routing_mapper)

These classes are defined as properties of the `Cape` object.

The most basic class is `Cape.Component`.
As a developer, you should define a class extending it to create a web widget
using Cape.JS.

`Cape.MarkupBuilder` is a class whose instances build a *virtual dom tree*
through their methods. Usually you don't instantiate markup builders by yourself.
Instances of `Cape.MarkupBuilder` are passed to the `render` method of
component classes which are defined by developers.

`Cape.DataStore` is a class to store and manipulate data, which is used
to render components.

If you want to create a single page application (SPA), you need an instance of `Cape.Router`.
After you start it, it continues to the changes of *hash fragment* of URL
and replace components according to the *routes*
(associations between hashes and components) defined in advance.

You have to call methods of `Cape.RoutingMapper` in order to define the routes.
You will never instantiate it by youself, but will get its instance through the `draw`
method of `Cape.Router`.
