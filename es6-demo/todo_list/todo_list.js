(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.ES6TodoList = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var ES6TodoList = (function (_Cape$Component) {
  function ES6TodoList() {
    _classCallCheck(this, ES6TodoList);

    if (_Cape$Component != null) {
      _Cape$Component.apply(this, arguments);
    }
  }

  _inherits(ES6TodoList, _Cape$Component);

  _createClass(ES6TodoList, [{
    key: 'render',
    value: function render(m) {
      var _this = this;

      m.ul(function (m) {
        _this.items.forEach(function (item) {
          return _this.renderItem(m, item);
        });
      });
      this.renderForm(m);
    }
  }, {
    key: 'renderItem',
    value: function renderItem(m, item) {
      var _this2 = this;

      m.li(function (m) {
        m.label({ 'class': { completed: item.done } }, function (m) {
          m.input({
            type: 'checkbox',
            checked: item.done,
            onclick: function onclick(e) {
              return _this2.toggle(item);
            }
          });
          m.sp().text(item.title);
        });
      });
    }
  }, {
    key: 'renderForm',
    value: function renderForm(m) {
      var _this3 = this;

      m.on('submit', function (e) {
        _this3.addItem();return false;
      });
      m.formFor('item', function (m) {
        m.onkeyup(function (e) {
          return _this3.refresh();
        }).textField('title');
        m.onclick(function (e) {
          return _this3.addItem();
        }).attr({ disabled: _this3.val('item.title') === '' }).btn('Add');
      });
    }
  }, {
    key: 'init',
    value: function init() {
      this.items = [{ title: 'Foo', done: false }, { title: 'Bar', done: true }];
      this.refresh();
    }
  }, {
    key: 'toggle',
    value: function toggle(item) {
      item.done = !item.done;
      this.refresh();
    }
  }, {
    key: 'addItem',
    value: function addItem() {
      this.items.push({ title: this.val('item.title'), done: false });
      this.val('item.title', '');
      this.refresh();
    }
  }]);

  return ES6TodoList;
})(Cape.Component);

module.exports = ES6TodoList;

},{}]},{},[1])(1)
});