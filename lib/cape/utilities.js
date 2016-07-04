'use strict'

let Cape = {}

// Merge the properties of two or more objects together into the first object.
Cape.extend = function() {
  let i, key

  for (i = 1; i < arguments.length; i++)
    for (key in arguments[i])
      if (arguments[i].hasOwnProperty(key))
        arguments[0][key] = arguments[i][key]
  return arguments[0]
}

// Merge the properties of two or more objects together into the first object recursively.
Cape.deepExtend = function() {
  let i, key

  for (i = 1; i < arguments.length; i++)
    for (key in arguments[i])
      if (arguments[i].hasOwnProperty(key)) {
        if (typeof arguments[0][key] === 'object' && typeof arguments[i][key] === 'object')
          global.Cape.deepExtend(arguments[0][key], arguments[i][key])
        else
          arguments[0][key] = arguments[i][key]
      }
  return arguments[0]
}

// Merge (but not override) the properties of two or more objects together
// into the first object
Cape.merge = function() {
  let i, key

  for (i = 1; i < arguments.length; i++)
    for (key in arguments[i])
      if (!arguments[0].hasOwnProperty(key) && arguments[i].hasOwnProperty(key))
        arguments[0][key] = arguments[i][key]
  return arguments[0]
}

module.exports = Cape
