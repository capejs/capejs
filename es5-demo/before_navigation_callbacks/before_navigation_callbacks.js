"use strict";

var ComponentX = Cape.createComponentClass({
  render: function(m) {
    m.p('This is component X.')
  }
});

var ComponentY = Cape.createComponentClass({
  render: function(m) {
    m.p('This is component Y.')
  }
});

var ComponentZ = Cape.createComponentClass({
  render: function(m) {
    m.p('This is component Z.')
  }
});

var ErrorMessage = Cape.createComponentClass({
  render: function(m) {
    m.p('Something is wrong!')
  }
});
