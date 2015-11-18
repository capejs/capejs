---
title: "Cape.Partial - API Reference"
---

<span class="badge alert-info">1.3</span>

[checkedOn()](#checked-on) -
[formData()](#form-data) -
[jsonFor()](#json-for) -
[paramsFor()](#params-for) -
[refresh()](#refresh) -
[val()](#val) -
[valuesFor()](#values-for)

<a class="anchor" id="checked-on"></a>
### #checkedOn()

#### Usage

* **checkedOn(name)**

This method returns:

* `true` if the check box whose name is `name` is checked.
* `false` if the check box whose name is `name` exists but is not checked.
* `undefined` if the check box whose name is `name` does not exist.

#### Example

```javascript
render: function(m) {
  m.form(function(m) {
    m.checkBox('done');
    m.button('Check', {
      onclick: function(e) {
        console.log(this.checkedOn('done'));
        return false;
      }
    })
  });
}
```

When the form has a `name` attribute, you should prepend its value and a dot
to the name of check box.

#### Example

```javascript
render: function(m) {
  m.formFor('task', function(m) {
    m.checkBox('done');
    m.button('Check', {
      onclick: function(e) {
        console.log(this.checkedOn('task.done'));
        return false;
      }
    })
  });
}
```


<a class="anchor" id="form-data"></a>
### #formData()

#### Usage

* **formData()**

This method returns a JavaScript object that represents the values of
all form controls within the partial's root component.

The values are organized in hierarchical structure as explained following examples:

#### Example

If you have a partial defined like this,

```javascript
var Form = Cape.createPartialClass({
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

If you have a partial defined like this,

```javascript
var Form = Cape.createPartialClass({
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
### #jsonFor()

#### Usage

* **jsonFor(formName)**

Thid method returns a JSON string that represents the field values of
a named form.

The values are organized in hierarchical structure as explained following examples:

#### Example

If you have a component defined like this,

```javascript
var Form = Cape.createPartialClass({
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

If you have a partial defined like this,

```javascript
var Form = Cape.createPartialClass({
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
{"user": {"login_name": "john", "password": "p@ssw0rd"}, "addresses": [{"country": "Japan", "city": "Tokyo" }, {"country": "USA", "city": "New York"}]}
```

<a class="anchor" id="params-for"></a>
### #paramsFor()

Thid method returns an object that represents the field values of
a named form.

The returned object is organized in hierarchical structure
so that you can pass it to the [ajax()](http://api.jquery.com/jquery.ajax/) method of jQuery.


#### Example

Suppose that you have a partial defined like this:

```javascript
var Form = Cape.createPartialClass({
  render: function(m) {
    m.formFor('user', function(m) {
      m.textField('name');
      m.passwordField('password');
      m.btn('Sign in', { onclick: function(e) { this.save(); } });
    });
  },
  save: function() {
    $.ajax({
      url: '/sessions/',
      method: 'POST',
      data: this.paramsFor('user')
    }).done(function(data) {
      // Do something.
    });
  }
});
```

When you fill in `name` field with 'john' and `password` field with `1234`
and click the 'Sign in' button, `this.paramsFor('user')` passes
to the `data` option of the `ajax()` the following object:

```javascript
{
  user: {
    name: "john",
    password: "1234"
  }
}
```

Note that jQuery converts this object to a query string like this:

```
user[name]=john&user[password]=1234
```


#### Example

Suppose that you have a partial defined like this:

```javascript
var Form = Cape.createPartialClass({
  init: function() {
    this.user_id = 123;
    this.setValues({
      user: {
        name: 'john',
        addresses: [
          { country: 'Japan', city: 'Tokyo' },
          { country: 'USA', city: 'New York' }
        ]
      }
    });
  },
  render: function(m) {
    m.formFor('user', function(m) {
      m.textField('name');
      for (var index = 0; index < 2; i++) {
        m.fieldsFor('addresses', { index: index }, function(m) {
          m.textField('country');
          m.textField('city');
        });
      }
      m.btn('Save', { onclick: function(e) { this.save(); } });
    });
  },
  save: function() {
    $.ajax({
      url: '/sessions/' + this.user_id,
      method: 'PATH',
      data: this.paramsFor('user')
    }).done(function(data) {
      // Do something.
    });
  }
});
```

When you change the value of `name` field from 'john' to 'mike' and click 'Save'
button, `this.paramsFor('user')` passes to the `data` option of the `ajax()`
the following object:

```javascript
{
  user: {
    name: "mike",
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

Note that jQuery converts this object to a query string like this:

```
user[name]=mike&user[addresses][0][country]=Japan&user[addresses][0][city]=Tokyo&user[addresses][1][country]=USA&user[addresses][1][city]=New+York
```


<a class="anchor" id="refresh"></a>
### #refresh()

* **refresh()**

This method rerenders the partial's root component by calling its `render()` method.

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
        console.log(this.val('user.family_name'));
        console.log(this.val('user.given_name'));
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
        var body = this.val('message.body', ''),
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
    });
  });
}
```

<a class="anchor" id="values-for"></a>
### #valuesFor()

Thid method sets the field values of a named form by passing an object as the first argument.

The values of this object must be organized in hierarchical structure as explained following examples:

#### Example

If you render a component defined like this,

```javascript
var Form = Cape.createPartialClass({
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
var Form = Cape.createPartialClass({
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
