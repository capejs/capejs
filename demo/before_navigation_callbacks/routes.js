var router = new Cape.Router()

router.draw(m => {
  m.root('component_x')
  m.page('y', 'component_y')
  m.page('z', 'component_z')
})

router.beforeNavigation(
  (hash) => {
    return new Promise((resolve, reject) => {
      var func = setInterval(() => {
        clearInterval(func)
        var cb = document.getElementById('causing-error')
        if (cb.checked)
          reject(Error('Something is wrong.'))
        else
          resolve(hash)
      }, 200)
    })
  }
)

router.beforeNavigation(
  (hash) => {
    if (hash === '') return ''
    return new Promise((resolve, reject) => {
      let func = setInterval(() => {
        clearInterval(func)
        var cb = document.getElementById('redirect')
        if (cb.checked)
          resolve('z')
        else
          resolve(hash)
      }, 100)
    })
  }
)

router.errorHandler(
  error => {
    let func = setInterval(() => {
      clearInterval(func)
      router.show(ErrorMessage)
    }, 1000)
  }
)

router.mount('main')
router.start()
