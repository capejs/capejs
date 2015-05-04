---
title: "Cape.Component - API Reference"
---

[formData()](#form-data) -
[mount()](#mount) -
[refresh()](#refresh) -
[unmount()](#unmount) -
[val()](#val)

<a class="anchor" id="form-data"></a>
### #formData()

This section is not yet prepared.

<a class="anchor" id="mount"></a>
### #mount()

This section is not yet prepared.

<a class="anchor" id="refresh"></a>
### #refresh()

This section is not yet prepared.

<a class="anchor" id="unmount"></a>
### #unmount()

This section is not yet prepared.

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
