var Cape = {};

// Users may store arbitrary data to this hash.
Cape.session = {};

// Merge the properties of two or more objects together into the first object.
Cape.extend = function() {
  var i, key;

  for(i = 1; i < arguments.length; i++)
    for(key in arguments[i])
      if(arguments[i].hasOwnProperty(key))
        arguments[0][key] = arguments[i][key];
  return arguments[0];
}

// Merge the properties of two or more objects together into the first object recursively.
Cape.deepExtend = function() {
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

Cape.createComponentClass = function(methods) {
  var klass = function() { Cape.Component.apply(this, arguments) };
  Cape.extend(klass.prototype, Cape.Component.prototype, methods);
  return klass;
}

Cape.createDataStoreClass = function(methods) {
  var klass = function() { Cape.DataStore.apply(this, arguments) };
  Cape.extend(klass.prototype, Cape.DataStore.prototype, methods);
  klass.create = Cape.DataStore.create;
  return klass;
}

module.exports = Cape;
