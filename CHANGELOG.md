# CHANGELOG - CapeJS

## 0.8.1

### `MarkupBuilder`

* Implement `attr`, `class` and `data` method to set attribute values cumulatively.

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
