(function(global) {
  "use strict";

  if (!global.Cape) {
    var Cape = {};
    if ("process" in global) module.exports = Cape;
    global.Cape = Cape;
  }

  // Users may store arbitrary data to this hash.
  global.Cape.session = {};

})((this || 0).self || global);
