---
title: "Cape.MarkupBuilder - API Reference"
---

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
      // The above single statement is equivalent to the following four statement;
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

Following HTML 5 elments can be added to the virtual dom tree by the markup builder's
method has equivalent name:

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

**Note:** The `<form>` element is treated specially in Cape.JS. See [#form](#form) and [#formFor](#form).

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
      m.p('The agenda for the meeting is as follows:', { className: 'statement' });
      m.ul({ style: 'color: blue' }, function(m) {
        m.li('Performance of business');
        m.li('Challenges on business');
        m.li('Our next goal');
      })
    })
  }
});
```

Following HTML 5 *void* elments also can be created in the same way:

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

This method sets the value of attributes for the element which will be added nextly.

#### Example

```javascript
render: function(m) {
  m.attr('alt', 'Logo Image');
  m.img({ src: '../images/logo.png' });
  // These two statements are equivalent to the following single statement:
  //   m.img({ src: '../images/logo.png', alt: 'Logo Image' })
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
  // These two statements are equivalent to the following single statement:
  //   m.img({ src: '../images/logo.png', alt: 'Logo Image',
  //           width: '180', height: '120', title: 'Cape.JS' })
}
```

The values set by `#attr` does not affect the elements created after the next element.

#### Example

```javascript
render: function(m) {
  m.attr('alt', 'Logo Image');
  m.img({ src: '../images/logo.png' });
  m.img({ src: '../images/download.png' });
  // The last statement creates a <img> tag without alt attribute.
}
```
