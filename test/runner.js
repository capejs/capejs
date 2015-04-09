var isNode = typeof window === 'undefined'

describe('Cape Tests', function() {
  if (isNode) {
    global.$ = require('jquery')
    global.Cape = require('../lib/node')
    global.expect = require('expect.js')
    require('./specs/component_test')
  } else {
    mocha.run()
  }
})
