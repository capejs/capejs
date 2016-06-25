"use strict";

var DataAttribute = Cape.createComponentClass({
  render: function(m) {
    m.h1('Hello!', { data: { hello: 'hello' } });
  }
});
