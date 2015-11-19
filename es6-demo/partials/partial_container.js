(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.ES6PartialContainer = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var ES6PartialContainer = (function (_Cape$Component) {
  function ES6PartialContainer() {
    _classCallCheck(this, ES6PartialContainer);

    if (_Cape$Component != null) {
      _Cape$Component.apply(this, arguments);
    }
  }

  _inherits(ES6PartialContainer, _Cape$Component);

  _createClass(ES6PartialContainer, [{
    key: 'init',
    value: function init() {
      this.area1 = new ES6ClickableArea(this);
      this.area2 = new ES6ClickableArea(this);
      this.refresh();
    }
  }, {
    key: 'render',
    value: function render(m) {
      var _this = this;

      m.div({ 'class': 'partial-container' }, function (m) {
        m.div({ id: 'total' }, function (m) {
          m.text(String(_this.area1.counter));
          m.text(' + ');
          m.text(String(_this.area2.counter));
          m.text(' = ');
          m.text(String(_this.area1.counter + _this.area2.counter));
        });
        _this.area1.render(m);
        _this.area2.render(m);
      });
    }
  }]);

  return ES6PartialContainer;
})(Cape.Component);

module.exports = ES6PartialContainer;

},{}]},{},[1])(1)
});