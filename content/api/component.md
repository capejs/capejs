---
title: "Cape.Component - API Reference"
---

[formData()](#form-data) -
[jsonFor()](#json-for) -
[mount()](#mount) -
[paramsFor()](#params-for) -
[refresh()](#refresh) -
[root](#root) -
[unmount()](#unmount) -
[val()](#val) -
[valuesFor()](#values-for)

<a class="anchor" id="form-data"></a>
### #formData()

#### Usage

* **formData()**

Thid method returns a JavaScript object that represents the values of
all form controls within the component.

The values are organized in hierarchical structure as explained following examples:

#### Example

If you have a component defined like this,

```javascript
var Form = Cape.createComponentClass({
  render: function(m) {
    m.formFor('user', function(m) {
      m.textField('login_name');
      m.passwordField('password');
    });
  }
});
```

the `formData()` method of its instances returns an object like this:

```javascript
{
  user: {
    login_name: 'john',
    password: 'p@ssw0rd'
  }
}
```


#### Example

If you have a component defined like this,

```javascript
var Form = Cape.createComponentClass({
  render: function(m) {
    m.formFor('user', function(m) {
      m.textField('login_name');
      m.passwordField('password');
      for (var index = 0; index < 2; i++) {
        m.fieldsFor('addresses', { index: index }, function(m) {
          m.textField('country');
          m.textField('city');
        })
      }
    });
  }
});
```

the `formData()` method of its instances returns an object like this:

```javascript
{
  user: {
    login_name: 'john',
    password: 'p@ssw0rd',
    addresses: {
      '0': {
        country: 'Japan',
        city: 'Tokyo'
      },
      '1': {
        country: 'USA',
        city: 'New York'
      }
    }
  }
}
```

<a class="anchor" id="json-for"></a>
### #jsonFor() <span class="badge alert-info">1.1.0</span>

#### Usage

* **jsonFor(formName)**

Thid method returns a JSON string that represents the field values of
a named form.

The values are organized in hierarchical structure as explained following examples:

#### Example

If you have a component defined like this,

```javascript
var Form = Cape.createComponentClass({
  render: function(m) {
    m.formFor('user', function(m) {
      m.textField('login_name');
      m.passwordField('password');
    });
  }
});
```

the `jsonFor()` method of its instances returns a string like this:

```json
{"user": { "login_name": "john", "password": "p@ssw0rd"}}
```


#### Example

If you have a component defined like this,

```javascript
var Form = Cape.createComponentClass({
  render: function(m) {
    m.formFor('user', function(m) {
      m.textField('login_name');
      m.passwordField('password');
      for (var index = 0; index < 2; i++) {
        m.fieldsFor('addresses', { index: index }, function(m) {
          m.textField('country');
          m.textField('city');
        })
      }
    });
  }
});
```

the `jsonFor()` method of its instances returns a string like this:

```json
{"user": {"login_name": "john", "password": "p@ssw0rd"},
"addresses": [{"country": "Japan", "city": "Tokyo" },
{"country": "USA", "city": "New York"}]}
```

<a class="anchor" id="mount"></a>
### #mount()

#### Usage

* **mount(id)**

This method renders the component and inserts it within the element specified by _id._

#### Example

```html
<body>
<div id="main"></div>
<script>
var HelloWorld = Cape.createComponentClass({
  render: function(m) {
    m.p('Hello, World!')
  }
});
var component = new HelloWorld();
component.mount('main');
</script>
</body>
```

If the component has the `init()` method, the `mount()` calls it
instead of rendering the component.

#### Example

```javascript
var HelloWorld = Cape.createComponentClass({
  init: function() {
    this.name = 'World';
    this.refresh();
  },

  render: function(m) {
    m.p('Hello, ' + this.name + '!')
  }
});
```

Note that you should have to call the `refresh()` method at the end
to render the component.

<a class="anchor" id="params-for"></a>
### #paramsFor() <span class="badge alert-info">1.1.0</span>

Thid method returns an object that represents the field values of
a named form.

The values are organized in hierarchical structure as explained following examples:

#### Example

If you have a component defined like this,

```javascript
var Form = Cape.createComponentClass({
  render: function(m) {
    m.formFor('user', function(m) {
      m.textField('login_name');
      m.passwordField('password');
    });
  }
});
```

the `jsonFor()` method of its instances returns an object like this:

```javascript
{
  user: {
    login_name: "john",
    password: "p@ssw0rd"
  }
}
```


#### Example

If you have a component defined like this,

```javascript
var Form = Cape.createComponentClass({
  render: function(m) {
    m.formFor('user', function(m) {
      m.textField('login_name');
      m.passwordField('password');
      for (var index = 0; index < 2; i++) {
        m.fieldsFor('addresses', { index: index }, function(m) {
          m.textField('country');
          m.textField('city');
        })
      }
    });
  }
});
```

the `jsonFor()` method of its instances returns an object like this:

```javascript
{
  user: {
    login_name: "john",
    password: "p@ssw0rd",
    addresses: {
      '0': {
        country: "Japan",
        city: "Tokyo"
      },
      '1': {
        country: "USA",
        city: "New York"
      }
    }
  }
}
```

<a class="anchor" id="refresh"></a>
### #refresh()

* **refresh()**

This method rerenders the component by calling its `render()` method.

<a class="anchor" id="root"></a>
### #root

This property refers to the HTML element which the component is mounted on.

Its `data` subproperty holds the values of `data-*` attributes of the root element.

#### Example

The following example shows "Hello, John!" on your browser.

```html
<body>
<div id="main" data-name="John"></div>
<script>
var HelloMessage = Cape.createComponentClass({
  render: function(m) {
    m.p('Hello, ' + this.root.data.name + '!')
  }
});
var component = new HelloMessage();
component.mount('main');
</script>
</body>
```

<a class="anchor" id="unmount"></a>
### #unmount()


#### Usage

* **unmount()**

This method removes the component from the HTML document.

If the component has the `beforeUnmount()` method, it is called before the component is unmounted.
If the component has the `afterUnmount()` method, it is called after the component has been unmounted.

<a class="anchor" id="val"></a>
### #val()

#### Usage

* **val(name)**
* **val(name, value)**
* **val({ name1: value1, name2: value2, ... })**

Get or set the value of a form field.

When the number of arguments is one and that argument is a string,
this method returns the value of the corresponding field.

#### Example

```javascript
render: function(m) {
  m.formFor('user', function(m) {
    m.textField('family_name').sp()
      .textField('given_name');
    m.button('Check', {
      onclick: function(e) {
        console.log(val('user.family_name'));
        console.log(val('user.given_name'));
        return false;
      }
    })
  });
}
```

When the number of arguments is two,
this method sets the value of a field whose name is corresponding
to the first argument to the second argument and returns
the original value of the field.

#### Example

```javascript
render: function(m) {
  m.formFor('message', function(m) {
    m.textField('body');
    m.button('Send', {
      onclick: function(e) {
        var body = val('message.body', ''),
            self = this;
        $.post('/api/messages', { body: body }, function() {
          self.refresh();
        });
        return false;
      }
    });
  });
}
```

When the number of arguments is one and that argument is an object,
this method sets the value of corresponding fields.

#### Example

```javascript
render: function(m) {
  m.formFor('user', function(m) {
    m.textField('family_name').sp()
      .textField('given_name');
    m.button('Check', {
      onclick: function(e) {
        var self = this,
            data = self.formData();
        self.val({ user: { family_name: '', given_name: '' } });
        $.post('/api/users', data, function() {
          self.refresh();
        })
        return false;
      }
    })
  });
}
```

<a class="anchor" id="values-for"></a>
### #valuesFor() <span class="badge alert-info">1.1.0</span>

Thid method sets the field values of a named form by passing an object as the first argument.

The values of this object must be organized in hierarchical structure as explained following examples:

#### Example

If you render a component defined like this,

```javascript
var Form = Cape.createComponentClass({
  init: function() {
    this.valuesFor({
      user: {
        login_name: 'john',
        gender: 'm'
      }
    });
    this.refresh();
  },
  render: function(m) {
    m.formFor('user', function(m) {
      m.textField('login_name');
      m.radioButton('gender', 'm');
      m.radioButton('gender', 'f');
    });
  }
});
```

you will see the only text field is filled with a string "john" and the first
radio button is checked.


#### Example

If you render a component defined like this,

```javascript
var Form = Cape.createComponentClass({
  init: function() {
    this.valuesFor({
      user: {
        login_name: 'john',
        addresses: [
          { country: 'Japan', city: 'Tokyo' },
          { country: 'USA', city: 'New York' }
        ]
      }
    });
    this.refresh();
  },
  render: function(m) {
    m.formFor('user', function(m) {
      m.textField('login_name');
      for (var index = 0; index < 2; i++) {
        m.fieldsFor('addresses', { index: index }, function(m) {
          m.textField('country');
          m.textField('city');
        })
      }
    });
  }
});
```

you will see the all text fields are filled in.
