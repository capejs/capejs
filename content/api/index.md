---
title: "API Reference"
type: "api"
---

### The `Cape` object

The **Cape.JS** defines a single global variable [Cape](./cape).
It has some utility methods, such as `extend`, `merge`, etc.

It also has the `session` property whose value is a hash object.
This property can be used to store arbitrary data by developers.

### Overview of classes

The **Cape.JS** consists of following five classes:

* [Cape.Component](./component)
* [Cape.MarkupBuilder](./markup_builder)
* [Cape.DataStore](./data_store)
* [Cape.Router](./router)
* [Cape.RoutingMapper](./routing_mapper)

These classes are defined as properties of the `Cape` object.

The most basic class is `Cape.Component`.
You need to define a class extending it in order to create a web widget using Cape.JS.
At least, instances of this class must have a method called `render`, which defines
how the component should be rendered in HTML.

`Cape.MarkupBuilder` is a class whose instances build *virtual dom trees.*
Usually you don't instantiate markup builders by yourself.
Instances of `Cape.MarkupBuilder` are passed to the `render` method of
component classes.

`Cape.DataStore` is a class to store and manipulate data, which is used by
components to render themselves.

If you want to create a single page application (SPA), you may need an instance of `Cape.Router`.
After you start it, it continues to watch the changes of *hash fragment* of URL
and mount components according to the *routes*
(associations between hashes and components) which you defined in advance.

You have to call methods of `Cape.RoutingMapper` in order to define the routes.
You will never instantiate it by youself, but will get its instance through the `draw`
method of `Cape.Router`.
