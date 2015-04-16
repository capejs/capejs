(function(global) {
  "use strict";

  if (!global.Cape) {
    var Cape = {};
    if ("process" in global) module.exports = Cape;
    global.Cape = Cape;
  }

  // Users may store arbitrary data to this hash.
  global.Cape.session = {};

  // Merge the properties of two or more objects together into the first object.
  global.Cape.extend = function() {
    var i, key;

    for(i = 1; i < arguments.length; i++)
      for(key in arguments[i])
        if(arguments[i].hasOwnProperty(key))
          arguments[0][key] = arguments[i][key];
    return arguments[0];
  }

  // Merge the properties of two or more objects together into the first object recursively.
  global.Cape.deepExtend = function() {
    var i, key;

    for(i = 1; i < arguments.length; i++)
      for(key in arguments[i])
        if(arguments[i].hasOwnProperty(key)) {
          if (typeof arguments[0][key] === 'object' && typeof arguments[i][key] === 'object')
            global.Cape.deepExtend(arguments[0][key], arguments[i][key]);
          else
            arguments[0][key] = arguments[i][key];
        }
    return arguments[0];
  }

})((this || 0).self || global);
