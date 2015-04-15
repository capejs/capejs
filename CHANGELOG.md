# CHANGELOG - CapeJS

## 0.9.1

### `RoutingMapper`

* Add `#match` method to add a route, optionally with constraints.
* Add `#resources` method to add routes for four actions(index, show, new, edit).
* Add `#resource` method to add routes for three actions(show, new, edit).
* Support `pathNames`, `path`, `only`, `except` options on `#resources` and `#resource` methods.
* Support nested resources.
* Add `#namespace` method to set a namespace for routes.

## 0.9.0

### `Cape.Component`

* Return original value when the value of a field gets set by `#val(name, value)`.

### `Cape.MarkupBuilder`

* Add `#selectBox` and make `#select` ordinary method.
* Add `#_.inputField` and make `#input` ordinary method.

## 0.8.3

### `Cape.Component`

* Adapt `#formData` to nested forms.

### `Cape.MarkupBuilder`

* Add `#fields_for` to create nested forms.

## 0.8.2

### `MarkupBuilder`

* Implement `data` method to set attribute values cumulatively.
* Fix `class` method. The class names set by it should be overridden by options['className'].

## 0.8.1

### `MarkupBuilder`

* Implement `attr` and `class` method to set attribute values cumulatively.

## 0.8.0

### `Component`

* Remove `markup` method. Now, users should define the `render` method to
  take a `MarkupBuilder` object.

## 0.7.4

### `MarkupBuilder`

* Accept `data` option as an alias of `dataset`.
* Handle correctly hash without `id` part such as `users/new`.

## 0.7.3

### `MarkupBuilder`

* Set `selected` attribute to the `option` element automatically.

## 0.7.2

### `MarkupBuilder`
* Rename `#faIcon` to `#fa`.

## 0.7.1

* Fix Cape.createComponentClass to return a class with *interior* class.

## 0.7.0

* Start preparation for the 1.0 release.
