var isNode = typeof window === 'undefined'

describe('Cape Tests', function() {
  if (isNode) {
    global.jsdom = require('jsdom').jsdom
    global.document = jsdom()
    global.window = document.defaultView
    global.navigator = window.navigator

    global.virtualDom = require('virtual-dom')
    global.Inflector = require('inflected')
    global.expect = require('chai').expect
    global.sinon = require('sinon')
    global.fetch = require('node-fetch')

    global.Cape = require('../lib/cape.js')
    global.stubFetchAPI = require('./helpers.js').stubFetchAPI
    global.ClickCounter = require('../demo/click_counter/click_counter.js')
    global.ClickCounterStore = require('../demo/double_click_counters/click_counter_store.js')
    global.ModularClickCounter = require('../demo/double_click_counters/modular_click_counter.js')
    global.HelloMessage = require('../demo/hello_message/hello_message.js')
    global.HelloMessage2 = require('../demo/hello_message2/hello_message2.js')
    global.ClickableArea = require('../demo/partials/clickable_area.js')
    global.PartialContainer = require('../demo/partials/partial_container.js')
    global.TodoList = require('../demo/todo_list/todo_list.js')
    global.FormManipulator = require('../demo/form_manipulator/form_manipulator.js')
    global.FormControls = require('../demo/mixins/form_controls.js')
    global.SimpleForm = require('../demo/mixins/simple_form.js')
  } else {
    global = window
    mocha.run()
  }
})
