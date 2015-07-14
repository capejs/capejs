---
title: "API Reference"
type: "api"
---

[Cape](./cape) -
[Cape.Component](./component) -
[Cape.MarkupBuilder](./markup_builder) -
[Cape.DataStore](./data_store) -
[Cape.CollectionAgent](./collection_agent) -
[Cape.ResourceAgent](./resource_agent) -
[Cape.Router](./router) -
[Cape.RoutingMapper](./routing_mapper)

### The `Cape` object

The **Cape.JS** defines a single global variable [Cape](./cape).
It has some utility methods, such as `extend`, `merge`, etc.

### Overview of classes

The **Cape.JS** consists of following five classes:

* [Cape.Component](./component)
* [Cape.MarkupBuilder](./markup_builder)
* [Cape.DataStore](./data_store)
* [Cape.CollectionAgent](./collection_agent)
* [Cape.ResourceAgent](./resource_agent)
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

`Cape.CollectionAgent` has a role similar to the `Cape.DataStore`.
Using it you can perform REST requests to the web resources using
[Fetch API](https://developer.mozilla.org/en/docs/Web/API/Fetch_API).

`Cape.ResourceAgent` is a class to represent a particular resource on the web
and performs REST manipulations on it using Fetch API.

If you want to create a single page application (SPA), you may need an instance of `Cape.Router`.
After you start it, it continues to watch the changes of *hash fragment* of URL
and mount components according to the *routes*
(associations between hashes and components) which you defined in advance.

You have to call methods of `Cape.RoutingMapper` in order to define the routes.
You will never instantiate it by youself, but will get its instance through the `draw`
method of `Cape.Router`.
