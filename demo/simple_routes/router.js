'use strict'

let simple_router = new Cape.Router()
simple_router.draw(m => {
  m.root('top_page')
  m.page('about', 'about_page')
  m.page('help', 'help_page')
})

if (typeof module !== 'undefined' && module.exports) module.exports = simple_router
