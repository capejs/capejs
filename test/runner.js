var isNode = typeof window === 'undefined'

describe('Cape Tests', function() {
  if (isNode) {
    global.jsdom = require('jsdom').jsdom
    global.document  = jsdom('<html><body></body></html>')
    global.window    = document.defaultView
    global.navigator = window.navigator

    global.virtualDom = require('virtual-dom')
    global.Inflector = require('inflected')
    global.expect = require('chai').expect
    global.sinon = require('sinon')
    global.fetch = require('node-fetch')

    global.Cape = require('../lib/cape.js')
  } else {
    global = window
    mocha.run()
  }
})
