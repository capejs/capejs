---
title: "Cape.MarkupBuilder - API Reference"
---

[General notes](#general-notes) -
[#a, #abbr, #address](#a-abbr-address-etc) -
[#area, #base, #br](#area-base-br-etc) -
[#attr](#attr) -
[#checkBox](#check-box) -
[#class](#class) -
[#data](#data) -
[#elem](#elem) -
[#fa](#fa) -
[#fieldsFor](#fields-for) -
[#formFor](#form-for) -
[#hiddenField](#hidden-field) -
[#labelFor](#label-for)

<a class="anchor" id="general-notes"></a>
### General notes

All instance methods of `Cape.MarkupBuilder` are *chainable.*
Each method returns the instance itself.

#### Example

```
var HelloMessage = Cape.createComponentClass({
  render: function(m) {
    m.p(function(m) {
      m.text('Hello,').sp().text(this.guest.name).text('!');
      // The above single statement is equivalent to the
      // following four statement;
      //   m.text('Hello,');
      //   m.sp();
      //   m.text(this.guest.name);
      //   m.text('!');
    })
  }
})
```

<a class="anchor" id="a-abbr-address-etc"></a>
### #a, #abbr, #address, etc.

#### Usage

* **a(content [, options])**
* **a([options,] function)**
* **abbr(content [, options])**
* **abbr([options,] function)**
* **address(content [, options])**
* **address([options,] function)**
* *etc.*

Following HTML 5 elements can be added to the virtual dom tree by the markup builder's
method with the same name:

> a, abbr, address, article, aside, audio, b, bdi, bdo,
  blockquote, body, button, canvas, caption, cite, code,
  colgroup, datalist, dd, del, details, dfn, dialog, div,
  dl, dt, em, embed, fieldset, figcaption, figure, footer,
  h1, h2, h3, h4, h5, h6, head, header, html,
  i, iframe, ins, kbd, label, legend, li, main, map, mark,
  menu, menuitem, meter, nav, noscript, object, ol, optgroup,
  option, output, p, pre, progress, q, rp, rt, ruby, s,
  samp, script, section, select, small, span, strong, style,
  sub, summary, sup, table, tbody, td, textarea, tfoot,
  th, thead, time, title, tr, u, ul, var, video

When the first argument is a string, it becomes the content of element.
When the last argument is a function, it creates a dependent virtual dom tree.

#### Example

```
var HelloMessage = Cape.createComponentClass({
  render: function(m) {
    m.article(function(m) {
      m.p('The agenda for the meeting is as follows:');
      m.ul(function(m) {
        m.li('Performance of business');
        m.li('Challenges on business');
        m.li('Our next goal');
      })
    })
  }
});
```

You can pass a hash object as *options* to these methods to set the attribute values
of the element. The position of this argument should be after the string argument
and before the function argument.


#### Example

```javascript
var HelloMessage = Cape.createComponentClass({
  render: function(m) {
    m.article({ id: 'agenda' }, function(m) {
      m.p('The agenda for the meeting is as follows:',
        { className: 'statement' });
      m.ul({ style: 'color: blue' }, function(m) {
        m.li('Performance of business');
        m.li('Challenges on business');
        m.li('Our next goal');
      })
    })
  }
});
```

<a class="anchor" id="area-base-br-etc"></a>
### #area, #base, #br, etc.

#### Usage

* **area([options])**
* **base([options])**
* **br([options])**
* *etc.*

Following HTML 5 *void* elements can be added to the virtual dom tree by the markup builder's
method with the same name:

> area, base, br, col, embed, hr, img, input, keygen,
link, menuitem, meta, param, source, track, wbr

They don't take a string argument nor a function argument, though.
They only accept a hash object to set the attribute values of the element.

#### Example

```javascript
var LogoMark = Cape.createComponentClass({
  render: function(m) {
    m.div({ id: 'agenda' }, function(m) {
      m.img({ src: '../images/logo.png', alt: 'Logo Image' })
    })
  }
});
```

<a class="anchor" id="attr"></a>
### #attr

#### Usage

* **attr(name, value)**

Set the value of attributes for the element which will be added nextly.

#### Example

```javascript
render: function(m) {
  m.attr('alt', 'Logo Image');
  m.img({ src: '../images/logo.png' });
  // These two statements are equivalent to the following
  // single statement:
  //   m.img({ src: '../images/logo.png',
  //           alt: 'Logo Image' })
}
```

The attribute values are set cumulatively.

#### Example

```javascript
render: function(m) {
  m.attr('alt', 'Logo Image');
  m.attr('width', '180');
  m.attr('height', '120');
  m.attr('title', 'Cape.JS');
  m.img({ src: '../images/logo.png' });
  // These two statements are equivalent to the following
  // single statement:
  //   m.img({ src: '../images/logo.png',
  //           alt: 'Logo Image',
  //           width: '180', height: '120',
  //           title: 'Cape.JS' })
}
```

The values set by `#attr` does not affect the elements created after the next element.

#### Example

```javascript
render: function(m) {
  m.attr('alt', 'Logo Image');
  m.img({ src: '../images/logo.png' });
  m.img({ src: '../images/download.png' });
  // The last statement creates a <img> tag without
  // alt attribute.
}
```

<a class="anchor" id="check-box"></a>
### #checkBox

#### Usage

* **checkBox(name, [options,] function)**

Create a `<input type="checkbox">` tag tailored for form manipulation.
Its first argument is the base of `name` attribute value.
If the surrounding `<form>` tag has a name `"user"`,
then the `name` attribute becomes `"user.name"`.
See [#formFor](#formFor) for details.

#### Example

```javascript
render: function(m) {
  m.formFor('user', function(m) {
    m.labelOf('privileged', function(m) {
      m.checkBox('privileged');
    });
  });
  // The above code generates the following HTML tags:
  //   <form name="user">
  //     <label for="user-field-privileged">
  //       <input type="checkbox" name="user.privileged"
  //         id="user-field-privileged">
  //     </label>
  //   </form>
}
```

<a class="anchor" id="class"></a>
### #class

#### Usage

* **class(name, value)**

Set the `class` attribute value for the element which will be added nextly.

#### Example

```javascript
render: function(m) {
  m.class('container');
  m.div(function(m) {
    m.p('Hello, World!')
  });
  // The above code generates the following HTML tags
  //   <div class="container">
  //     <p>Hello, World!</p>
  //   </div>
}
```

As [#attr](#attr), the `#class` method add classes cumulatively and
affects only the nextly added element.

<a class="anchor" id="data"></a>
### #data

#### Usage

* **data(name, value)**

Set the `data-*` attribute value for the element which will be added nextly.

#### Example

```javascript
render: function(m) {
  m.data('id', '7');
  m.div(function(m) {
    m.p('Hello, World!')
  });
  // The above code generates the following HTML tags
  //   <div data-id="7">
  //     <p>Hello, World!</p>
  //   </div>
}
```

As [#attr](#attr), the `#data` method sets attribute values cumulatively and
affects only the nextly added element.

<a class="anchor" id="elem"></a>
### #elem

#### Usage

* **elem(content [, options])**
* **elem([options,] function)**

Create an HTML element. The first argument is a CSS selector, such as `"div.container"`.

When the second argument is a string, it becomes the content of element.
When the last argument is a function, it creates a dependent virtual dom tree.

#### Example

```javascript
render: function(m) {
  m.elem('div#wrapper', function(m) {
    m.elem('div.container', function(m) {
      m.elem('div.row', function(m) {
        m.elem('div.col-md-6', 'Hello');
        m.elem('div.col-md-6', 'World');
      })
    })
  })
  // The above code generates the following HTML tags
  //   <div id="wrapper">
  //     <div class="container">
  //       <div class="row">
  //         <div class="col-md-6">Hello</div>
  //         <div class="col-md-6">World</div>
  //       </div>
  //     </div>
  //   </div>
}
```

You can pass a hash object as *options* to these methods to set the attribute values
of the element. The position of this argument should be after the string argument
and before the function argument.

#### Example

```javascript
render: function(m) {
  m.elem('div#wrapper', { style: 'margin-top: 10px' },
    function(m) {
    m.elem('div.container', function(m) {
      m.elem('div.row', function(m) {
        m.elem('div.col-md-6', 'Hello',
          { style: 'font-weight: bold' });
        m.elem('div.col-md-6', 'World');
      })
    })
  })
  // The above code generates the following HTML tags
  //   <div id="wrapper" style="margin-top: 10px">
  //     <div class="container">
  //       <div class="row">
  //         <div class="col-md-6"
  //           style="font-weight: bold">Hello</div>
  //         <div class="col-md-6">World</div>
  //       </div>
  //     </div>
  //   </div>
}
```

<a class="anchor" id="fa"></a>
### #fa

#### Usage

* **fa(name [, options])**

Add a [font awesome](http://fortawesome.github.io/Font-Awesome/) icon
(actually, it is just an empty `<i>` tag) to the virtual dom tree.
Its first argument is the icon's name, such as `"download"`, `"gear"`, etc.
You can pass a hash object as the optional second argument to set the
attribute values of `<i>` tag.

#### Example

```javascript
render: function(m) {
  m.a({ href: './download.html' }, function(m) {
    m.fa('download').text(' Download');
  })
  // The above code generates the following HTML tags
  //   <a href="./download.html">
  //     <i class="fa fa-download"></i> Download</a>
}
```

<a class="anchor" id="fields-for"></a>
### #fieldsFor

#### Usage

* **fieldsFor(name, [options,] function)**

Create a scope for nested forms. In this scope, a prefix is
addded to the name of each form control.


#### Example

```javascript
render: function(m) {
  m.form(function(m) {
    m.textField('name');
    m.fieldsFor('home_address', function(m) {
      m.textField('city');
      m.textField('street');
    })
  })
  // The above code generates the following HTML tags
  //   <form>
  //     <input type="text" name="name">
  //     <input type="text" name="home_address/city">
  //     <input type="text" name="home_address/street">
  //   </form>
}
```

If you pass the `index` option to this method, the prefix is numbered:

#### Example

```javascript
render: function(m) {
  m.form(function(m) {
    m.textField('name');
    m.fieldsFor('address', { index: 1 } function(m) {
      m.textField('city');
      m.textField('street');
    })
    m.fieldsFor('address', { index: 2 } function(m) {
      m.textField('city');
      m.textField('street');
    })
  })
  // The above code generates the following HTML tags
  //   <form>
  //     <input type="text" name="name">
  //     <input type="text" name="address/1/city">
  //     <input type="text" name="address/1/street">
  //     <input type="text" name="address/2/city">
  //     <input type="text" name="address/2/street">
  //   </form>
}
```

<a class="anchor" id="form-for"></a>
### #formFor

#### Usage

* **formFor(name, [options,] function)**

Create a `<form>` tag whose name attribute is *name*.

Using this method instead of `#form`, the form name prefix is
added to the `name` attribute of subordinate form controls.

The `id` attribute is set automatically. When the form name is `'foo'`,
the `id` attribute of a form control whose name is `bar` becomes `'foo-field-bar'`.

#### Example

```javascript
render: function(m) {
  m.formFor('user', function(m) {
    m.textField('name');
    m.checkBox('privileged');
  })
  // The above code generates the following HTML tags
  //   <form name="user">
  //     <input type="text" name="user.name"
  //       id="user-field-name">
  //     <input type="hidden" name="user.privileged"
  //       value="0">
  //     <input type="checkbox" name="user.privileged"
  //       id="user-field-privileged" value="1">
  //   </form>
}
```

<a class="anchor" id="hidden-field"></a>
### #hiddenField

#### Usage

* **hiddenField(name, [options,] function)**

Create a `<input type="hidden">` tag tailored for form manipulation.
Its first argument is the base of `name` attribute value.
If the surrounding `<form>` tag has a name `"user"`,
then the `name` attribute becomes `"user.name"`.

#### Example

```javascript
render: function(m) {
  m.formFor('user', function(m) {
    m.hiddenField('privileged');
  });
  // The above code generates the following HTML tags:
  //   <form name="user">
  //     <input type="hidden" name="user.privileged"
  //       id="user-field-privileged">
  //   </form>
}
```

<a class="anchor" id="label-for"></a>
### #labelFor

#### Usage

* **labelFor(name, label)**

Create a `<label>` tag whose `name` attribute is `name`.
Its `for` attribute is set appropriately.

#### Example

```javascript
render: function(m) {
  m.formFor('user', function(m) {
    m.div(function(m) {
      m.labelFor('name', 'User name').sp().textField('name');
    });
    m.fieldsFor('home_address', function(m) {
      m.div(function(m) {
        m.labelFor('city', 'City').sp().textField('city');
      });
      m.div(function(m) {
        m.labelFor('street', 'Street').sp().textField('street');
      });
    });
  });
  // The above code generates the following HTML tags:
  //   <form name="user">
  //     <div>
  //       <label for="user-field-name">User name</label>
  //       <input type="text" name="user.name"
  //         id="user-field-name">
  //     </div>
  //     <div>
  //       <label for="user-field-home-address-city">
  //         City</label>
  //       <input type="text" name="user.home-address/city"
  //         id="user-field-home-address-city">
  //     </div>
  //     <div>
  //       <label for="user-field-home-address-street">
  //         Street</label>
  //       <input type="text"
  //         name="user.home-address/street"
  //         id="user-field-home-address-street">
  //     </div>
  //   </form>
}
```
