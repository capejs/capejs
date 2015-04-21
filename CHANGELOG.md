# CHANGELOG - CapeJS

## 1.0.0-beta.1 (April 21, 2015)

### `Cape.RoutingMapper`

* This version introduced following drastic changes:
    * Use dots to separate class name hierarchy.
    * Rename `#match` to `#page`.
    * Remove `#resources` and `#resource`.
    * `ResourceMapper#many('members')` draws four routes:
        1. `members          => Members.List`
        2. `members/new      => Members.Form`
        3. `members/:id      => Members.Item`
        4. `members/:id/edit => Members.Form`
    * `ResourceMapper#one('account') draws` following three routes:
      1. `account          => AccountsList`
      2. `account/new      => AccountsForm`
      3. `account/:id      => AccountsItem`
      4. `account/:id/edit => AccountsForm`

## 0.12.1

### `Cape.Router`

* Remove debug code.

## 0.12.0

### `Cape.Router`

* A before action callback must be a function that returns a *promise*.
* Do not skip before navigation callbacks when the second argument of `#navigate` is true.
* Remove the router's `waiting` property.
* Add `#errorHandler` that registers a function to handle errors occurred
  in before navigation callbacks.
* Add `#show` to mount a component directly.

## 0.11.6

### `Cape.MarkupBuilder`

* Add `#formFor`. Now we can write `m.formFor('foo', ...)`
  instead of `m.form({ name: 'foo'}, ...)`.
* Fix a bug related to the `namespace` property of routes (again!).

## 0.11.5

### `Cape.Router`

* Rename `#beforeAction` to `#beforeNavigation`. `#beforeAction` is deprecated.
* Skip `beforeNavigation` callbacks when the second argument of `#navigate` is true.
* Do not mount the component if the router's `waiting` property is true.

## 0.11.4

### `Cape.Router`

* Fix a bug related to the `namespace` property of routes (again).

## 0.11.3

### `Cape.Router`

* Fix a bug related to the `namespace` property of routes.
* Set namespace and component properties of router.

## 0.11.2

### `Cape.Router`

* Fix a bug related to old router api

## 0.11.1

### `Cape.Component`

* Add `#renderPartial` to render a *partial*. It takes three arguments:
    1. The markup builder.
    1. The partial class name (such as `'name_space/like_button'`).
    1. A object that becomes *this* of the partial.

### `Cape.MarkupBuilder`

* Add `#labelOf`. When its first argument is `'body_color'`, it will create
  a `label` element whose `for` attribute is set by following rules:
    * `'field-body-color'` if the form has no name and is not nested.
    * `'field-items-1-body-color'` if the form has no name and is nested under the name `items-1`.
    * `'foo-field-body-color'` if the form's name is `'foo'` and is not nested.
    * `'foo-field-item-1-body-color'` if the form's name is `'foo'` and is nested under the name `item-1`.
* Set `id` attribute of form controls using the rules listed above.
* Alias `#sp` to `#space`.

### `Cape.RoutingMapper`

* Add `#root` that add route for empty hash.

## 0.11.0

### `Cape.Router`

* Use `/` instead of `#` to separate namespace from component class name.
  Not `foo#bar`, but `foo/bar`. Old style is still valid.

### `Cape.RoutingMapper`

* Support deeply nested namespace.
* Do not include `namespace`, `collection`, and `action` in the keys of `route.params`
  (No backward compatibility).
* Drop support for old convention of component class name (such as `MembersIndex`).

## 0.10.3

### `Cape.RoutingMapper`

* Change the format of `#match` method's first argument from `component#action` to `namespace/component`.
* Deep nesting of namespaces.

### `Cape.Router`

* Choose a component under deeply nested namespace.


## 0.10.2

### `Cape.*`

* Adopt the structure of Node.js package.
* Create *browserified* dist file containing `virtual-dom` and `inflected`.
* Create *minified* dist file.

## 0.10.1

### `Cape.Component`

### Fix `#refresh` to handle correctly a form control whose name is "name" (#8).

## 0.10.0

### `Cape.Router`

* Introduce new convention for component class name.
    * Old (still valid)
        * `foo#bar => FooBar`
        * `admin/foo#bar` => AdminFooBar`
    * New
        * `foo#bar => Foo.Bar`
        * `admin/foo#bar` => Admin.Foo.Bar`

## 0.9.3

### `Cape.*`

* Remove dependencies on jQuery.

## 0.9.2

### `Cape.Router`

* Implement `#beforeAction` to allow users to register callbacks.
* Remove `#exec` and add `#routeFor`.
* Let `#navigate` to call callbacks before mounting component.
* Do not remount the same component. Just send notifications.
* Call `navigate()` within the ``#start method`.

### `Cape.RoutingMapper`

* Change component class name rule. Use `MembersIndex` instead of `Members.Index`.
* Bug fix: Give a correct class name for components under a namespace.

### `Cape`

* Add `session` property that users can store arbitrary data to.

## 0.9.1

### `Router`

* Implement `#draw`, `#mount`, `#start` and `#exec`.

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
