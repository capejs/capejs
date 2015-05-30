# CHANGELOG - CapeJS

## 1.1.0 (Not yet released)

### `Cape.Component`

* Add `#setValues` to set values of form fields at one time.

## 1.0.1 (May 30, 2015)

### `Cape.Component`

* Bug fix: Can't set field values of nested forms.

## 1.0.0 (May 23, 2015)

* Release the first version that is ready for production use.

## 1.0.0-rc.2 (May 14, 2015)

### `Cape.MarkupBuilder`

* Fix a bug relating to `#checkBox`. The `#attr`, `#class`,  `on`, etc.
  should not affect on the hidden field, but on the check box field.

## 1.0.0-rc.1 (May 6, 2015)

### `Cape.MarkupBuilder`

* Add `#on` method to set an event handler for the next element.
* Add shortcut methods `#onblur`, `#onfocus`, etc. to set an event handler
  for the next element. Supported events are:
  'blur', 'focus', 'change', 'select', 'submit', 'reset', 'abort', 'error',
  'load', 'unload', 'click', 'dblclick', 'keyup', 'keydown', 'keypress',
  'mouseout', 'mouseover', 'mouseup', 'mousedown', 'mousemove'
* Add shortcut methods `#checked` and `#disabled` to set the value of
  corresponding attribute.

## 1.0.0-beta.11 (May 5, 2015)

### `Cape.Component`

* Do not call the `afterMount` callback. Developers should write this logic
  within the `init()` method.
* Do not detach itself from `global.Cape.router`. This depends on an old convension.

### `Cape.MarkupBuilder`

* Add `#btn` method to create &lt;button type="button"&gt; tag.

### `Cape.DataStore`

* The constructor of `DataStore` should call `init()` if defiend.

## 1.0.0-beta.10 (May 4, 2015)

### `Cape.DataStore`

* Bug fix: Remove `this.refresh()`.

## 1.0.0-beta.9 (May 4, 2015)

### `Cape.Router`

* Add `#redirectTo`. Like `#navigate`, it mounts a component, but skips
  before-navigation callbacks.

## 1.0.0-beta.8 (May 4, 2015)

### `Cape.DataStore`

* Remove `#refresh`.

## 1.0.0-beta.7 (May 3, 2015)

### `Cape.Component`

* Remove `#renderPartial`. We can cover this functionality with *mixins*.

### `Cape.Router`

* The `session` property is renamed to `vars`, because it has no relation
  with the session concept.


## 1.0.0-beta.6 (May 1, 2015)

### `Cape`

* Cape's `session` property is abolished. Users should store data to the `session`
  property of `Cape.Router` instances.

### `Cape.Component`

* `#val` should take a hash as its first argument.

### `Cape.MarkupBuilder`

* `#attr`, `#class`, `#data` should also take a hash as the first argument.
* Add `#css` to set the style attribue of next element.

### `Cape.Router`

* Allow the URL hash to include query part such as `?name=John&page=3`.
  These parameters are set to the `query` property of router.
* Add `session` property which users can store arbitrary data to.

## 1.0.0-beta.5 (April 28, 2015)

### `Cape.Router`

* Users can set the *root container* of components by passing it to the first
  argument of the router's constructor. The default root container is `window`.

### `Cape.MarkupBuilder`

* Remove special functionality from `#form` method. Use `#formFor` to add a prefix
  to the name of form fields.
* Rename `#labelOf` to `#labelFor`. The functionality of old `#labelFor` is removed.

## 1.0.0-beta.4 (April 22, 2015)

### `Cape.Router`

* Add the `flash` property. This is reset after each navigate call.
* Users can set flash objects via `Router#navigate(hash, { notice: '...', alert: '...' })`.
* Move `#notify` from internal class to main class.
* Fix a bug that `navigate` method gets called twice.

## 1.0.0-beta.3 (April 22, 2015)

### `Cape.RoutingMapper`

* Change APIs to define singular resource routes.

```
router.draw(function(m) {
  m.one('account', function(m) {
    m.view('info');
    m.new('quick')
  })
});
```

The above code defines the following five routes:

1. `account                  => Account.Content`
2. `account/new              => Account.Form`
2. `account/edit             => Account.Form`
3. `account/info             => Account.Info`
4. `account/new/quick        => Account.Quick`

* Set route's properties nicely (api change)

If we define a route with

```javascript
var router = new Cape.Router();
router.draw(function(m) {
  m.namespace('admin', function(m) {
    m.many('members', { only: [] }, function(m) {
      m.many('passwords', { only: 'edit' }
    })
  })
})
```

then the route has following properties:

* `namespace` -- `'admin'`
* `resource` -- `'members/passwords'`
* `action` -- `'edit'`
* `container` -- `'admin.passwords'`
* `component` -- `'form'`


### `Cape`

* Add `Cape.merge`, which merges (but does not override) the properties of
  two or more objects together into the first object.

## 1.0.0-beta.2 (April 22, 2015)

### `Cape.RoutingMapper`

* Introduce new APIs to define custom resource routes.

```
router.draw(function(m) {
  m.many('members', { only: [] }, function(m) {
    m.collection('special');
    m.member('info');
    m.new('quick')
  })
});
```

The above code defines the following three routes:

1. `members/special          => Members.Special`
2. `members/:id/info         => Members.Info`
3. `members/new/quick        => Members.Quick`

```
router.draw(function(m) {
  m.one('account', { only: [] }, function(m) {
    m.view('info');
    m.new('quick')
  })
});
```

The above code defines the following two routes:

1. `account/info             => Account.Info`
2. `account/new/quick        => Account.Quick`

For plural resources (defined by `#many`), you can't use `#view`.
For singular resources (defined by `#one`), you can't use `#collection` and `#element`.

### `Cape.Router`

* Add `#stop` to stop listening to the `hashchange` events.

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
        1. `account          => Accounts.List`
        2. `account/new      => Accounts.Form`
        3. `account/:id      => Accounts.Item`
        4. `account/:id/edit => Accounts.Form`

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
