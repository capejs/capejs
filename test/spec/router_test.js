'use strict'

describe('Router', () => {
  describe('constructor', () => {
    it('should have complete set of properties', () => {
      let router = new Cape.Router()

      expect(router.rootContainer).to.equal(window)
      expect(Array.isArray(router.routes)).to.be.true
      expect(typeof router.params).to.equal('object')
      expect(typeof router.query).to.equal('object')
      expect(typeof router.vars).to.equal('object')
      expect(typeof router.flash).to.equal('object')
    })
  })

  describe('attach', () => {
    it('should register a component as an event listener', () => {
      let router, component

      router = new Cape.Router()
      component = { refresh: sinon.spy() }
      router.attach(component)
      router.notify()

      expect(component.refresh.called).to.equal(true)
    })

    it('should not register a component twice', () => {
      let router, component

      router = new Cape.Router()
      component = { refresh: sinon.spy() }
      router.attach(component)
      router.attach(component)

      expect(router._.notificationListeners.length).to.equal(1)
    })

    it('should throw an exception when the listener does not have "refresh" method', () => {
      let router, component

      router = new Cape.Router()
      expect(router.attach.bind(router, {})).to
        .throw('The listener must have the "refresh" function.')
    })
  })

  describe('detach', () => {
    it('should unregister a component as an event listener', () => {
      let router, component

      router = new Cape.Router()
      component = { refresh: sinon.spy() }
      router.attach(component)
      router.detach(component)
      router.notify()

      expect(component.refresh.called).not.to.equal(true)
    })
  })

  describe('beforeNavigation', () => {
    after(() => {
      window.Top = undefined
    })

    it('should register a beforeNavigation callback', () => {
      let router, method

      router = new Cape.Router()
      router.beforeNavigation(() => {})

      expect(router._.beforeNavigationCallbacks.length).to.equal(1)
    })
  })

  describe('start', () => {
    it('should mount a component', () => {
      let router, method

      window.HomePage = {}
      window.HomePage.Index = class {}
      window.HomePage.Index.prototype.mount = method = sinon.spy()

      router = new Cape.Router()
      router._.setHash = () => {}
      router.draw(function(m) {
        m.page('', 'home_page.index')
      })
      router.mount('main')
      router.start()

      expect(method.calledWith('main')).to.equal(true)
    })
  })

  describe('stop', () => {
    it('should unmount a component', () => {
      let router, method

      window.HomePage = {}
      window.HomePage.Index = class {}
      window.HomePage.Index.prototype.mount = () => {}
      window.removeEventListener = sinon.spy()

      router = new Cape.Router()
      router._.setHash = () => {}
      router.draw(function(m) {
        m.page('', 'home_page.index')
      })
      router.mount('main')
      router.start()
      router.stop()

      expect(window.removeEventListener.calledOnce).to.equal(true)
    })
  })

  describe('constructor', () => {
    it('should specify the root container of components', () => {
      let router, method

      window.App = {}
      window.App.HomePage = {}
      window.App.HomePage.Index = class {}
      window.App.HomePage.Index.prototype.mount = method = sinon.spy()

      router = new Cape.Router(window.App)
      router._.setHash = () => {}
      router.draw(function(m) {
        m.page('', 'home_page.index')
      })
      router.mount('main')
      router.start()

      expect(method.calledWith('main')).to.equal(true)
    })
  })

  describe('draw', () => {
    it ('should throw when the first argument is not a function', () => {
      let router = new Cape.Router()

      expect(() => { router.draw("") }).to.throw(/must be a function/)
    })

    it ('should throw when the given function takes no argument', () => {
      let router = new Cape.Router()

      expect(() => { router.draw(() => {}) }).to.throw(/requires an argument/)
    })
  })

  describe('navigateTo', () => {
    afterEach(() => {
      window.TestMessage = undefined
      window.Members = undefined
      window.App = undefined
      window.Admin = undefined
      window.Adm = undefined
    })

    it('should mount the matched component', () => {
      let router, method

      window.TestMessage = class {}
      window.TestMessage.prototype.mount = method = sinon.spy()
      router = new Cape.Router()
      router._.setHash = () => {}
      router.draw(function(m) {
        m.page('hello', 'test_message')
      })
      router.mount('main')
      router.navigateTo('hello')

      expect(method.calledWith('main')).to.equal(true)
      expect(router.component).to.equal('test_message')
    })

    it('should recognize query part of the URL hash', () => {
      let router, method

      window.TestMessage = class {}
      window.TestMessage.prototype.mount = method = sinon.spy()
      router = new Cape.Router()
      router._.setHash = () => {}
      router.draw(function(m) {
        m.page('hello', 'test_message')
      })
      router.mount('main')
      router.navigateTo('hello', { name: 'John', message: 'Goodby'})
      router.navigateTo('hello?name=John&message=Goodby&x')

      expect(method.calledWith('main')).to.equal(true)
      expect(router.component).to.equal('test_message')
      expect(router.query.name).to.equal('John')
      expect(router.query.message).to.equal('Goodby')
      expect(router.query.x).to.equal('')
    })

    it('should take the second argument as query params', () => {
      let router, method

      window.TestMessage = class {}
      window.TestMessage.prototype.mount = method = sinon.spy()
      router = new Cape.Router()
      router._.setHash = () => {}
      router.draw(function(m) {
        m.page('hello', 'test_message')
      })
      router.mount('main')
      router.navigateTo('hello', { name: 'John', message: 'Goodby' })

      expect(method.calledWith('main')).to.equal(true)
      expect(router.component).to.equal('test_message')
      expect(router.query.name).to.equal('John')
      expect(router.query.message).to.equal('Goodby')
    })

    it('should take the third argument as options', () => {
      let router, method

      router = new Cape.Router()
      router._.setHash = () => {}
      router.draw(function(m) {
        m.page('hello', 'test_message')
      })

      class TestMessage extends Cape.Component {
        init() {
          this.notice = router.flash.notice
          this.alert = router.flash.alert
        }

        mount() { this.init() }
      }
      window.TestMessage = TestMessage

      router.mount('main')
      router.navigateTo('hello', {}, { notice: 'X', alert: 'Y' })

      expect(router.component).to.equal('test_message')
      expect(router._.mountedComponent.notice).to.equal('X')
      expect(router._.mountedComponent.alert).to.equal('Y')
    })

    it('should mount the matched component and set Router#params', () => {
      let router, method

      window.Members = {}
      window.Members.Item = class {}
      window.Members.Item.prototype.mount = method = sinon.spy()
      router = new Cape.Router()
      router._.setHash = () => {}
      router.draw(function(m) {
        m.many('members')
      })
      router.mount('main')
      router.navigateTo('members/123')

      expect(method.calledWith('main')).to.equal(true)
      expect(router.params.id).to.equal('123')
      expect(router.namespace).to.be.null
      expect(router.resource).to.equal('members')
      expect(router.action).to.equal('show')
      expect(router.container).to.equal('members')
      expect(router.component).to.equal('item')
    })

    it('should mount the nested component and set Router#params', () => {
      let router, method

      window.Members = {}
      window.Members.Item = class {}
      window.Members.Item.prototype.mount = method = sinon.spy()
      router = new Cape.Router()
      router._.setHash = () => {}
      router.draw(function(m) {
        m.many('groups', { only: [] }, function(m) {
          m.many('members')
        })
      })
      router.mount('main')
      router.navigateTo('groups/9/members/123')

      expect(method.calledWith('main')).to.equal(true)
      expect(router.params.group_id).to.equal('9')
      expect(router.params.id).to.equal('123')
    })

    it('should unmount the mounted component before remounting', () => {
      let router, method1, method2, method3

      window.Members = {}
      window.Members.List = class {}
      window.Members.Item = class {}
      window.Members.List.prototype.mount = method1 = sinon.spy()
      window.Members.List.prototype.unmount = method2 = sinon.spy()
      window.Members.Item.prototype.mount = method3 = sinon.spy()

      router = new Cape.Router()
      router._.setHash = () => {}
      router.draw(function(m) {
        m.many('members')
      })
      router.mount('main')
      router.navigateTo('members')
      router.navigateTo('members/123')

      expect(method1.calledWith('main')).to.equal(true)
      expect(method2.called).to.equal(true)
      expect(method3.calledWith('main')).to.equal(true)
    })

    it('should mount the component under a namespace', () => {
      let router, method

      window.Admin = { Members: {} }
      window.Admin.Members.Item = class {}
      window.Admin.Members.Item.prototype.mount = method = sinon.spy()
      router = new Cape.Router()
      router._.setHash = () => {}
      router.draw(function(m) {
        m.namespace('admin', function(m) {
          m.many('members')
        })
      })
      router.mount('main')
      router.navigateTo('admin/members/123')

      expect(method.calledWith('main')).to.equal(true)
      expect(router.params.id).to.equal('123')
      expect(router.namespace).to.equal('admin')
      expect(router.resource).to.equal('members')
      expect(router.action).to.equal('show')
      expect(router.container).to.equal('admin.members')
      expect(router.component).to.equal('item')
    })

    it('should mount the component under a deeply nested namespace', () => {
      let router, method

      window.App = { Admin: { Members: {} } }
      window.App.Admin.Members.Item = class {}
      window.App.Admin.Members.Item.prototype.mount = method = sinon.spy()
      router = new Cape.Router()
      router._.setHash = () => {}
      router.draw(function(m) {
        m.namespace('app', function(m) {
          m.namespace('admin', function(m) {
            m.many('members')
          })
        })
      })
      router.mount('main')
      router.navigateTo('app/admin/members/123')

      expect(method.calledWith('main')).to.equal(true)
      expect(router.params.id).to.equal('123')
    })

    it('should mount the component under a namespace with path option', () => {
      let router, method

      window.Adm = { Members: {} }
      window.Adm.Members.Item = class {}
      window.Adm.Members.Item.prototype.mount = method = sinon.spy()
      router = new Cape.Router()
      router._.setHash = () => {}
      router.draw(function(m) {
        m.namespace('adm', { path: 'admin' }, function(m) {
          m.many('members')
        })
      })
      router.mount('main')
      router.navigateTo('admin/members/123')

      expect(method.calledWith('main')).to.equal(true)
      expect(router.params.id).to.equal('123')
    })

    it('should run beforeNavigation callbacks', function(done) {
      let router

      router = new Cape.Router()
      router._.setHash = () => {}
      router._.mountComponent = function(id) {
        expect(id).to.equal('login')
        done()
      }

      router.draw(function(m) {
        m.page('login', 'sessions.new')
        m.many('members')
      })

      router.beforeNavigation(function(hash) {
        return new Promise(function(resolve, reject) {
          resolve(hash)
        })
      })

      router.beforeNavigation(function(hash) {
        return new Promise(function(resolve, reject) {
          resolve('login')
        })
      })

      router.mount('main')
      router.navigateTo('members')
    })

    it('should run errorHandler', function(done) {
      let router

      router = new Cape.Router()
      router._.setHash = () => {}

      router.draw(function(m) {
        m.many('members')
      })

      router.beforeNavigation(function(hash) {
        return new Promise(function(resolve, reject) {
          reject('ERROR')
        })
      })

      router.errorHandler(function(err) {
        expect(err).to.equal('ERROR')
        done()
      })

      router.mount('main')
      router.navigateTo('members')
    })

    it ('should call notify()', () => {
      let router, method3

      window.Members = {}
      window.Members.Item = class {}
      window.Members.Item.prototype.mount = method3 = sinon.spy()

      router = new Cape.Router()
      router._.setHash = () => {}
      sinon.spy(router, 'notify')
      router.draw(function(m) {
        m.many('members')
      })
      router.mount('main')
      router.navigateTo('members/1')
      router.navigateTo('members/2')

      expect(router.notify.calledOnce)
    })

    it ('should throw when the argument is not a string', () => {
      let router

      router = new Cape.Router()
      router._.setHash = () => {}
      router.draw(function(m) {
        m.many('members')
      })
      router.mount('main')

      expect(() => { router.navigateTo(0) }).to.throw(/must be a string/)
    })
  })

  describe('redirectTo', () => {
    afterEach(() => {
      window.TestMessage = undefined
    })

    it('should mount the matched component', () => {
      let router, method

      window.TestMessage = class {}
      window.TestMessage.prototype.mount = method = sinon.spy()
      router = new Cape.Router()
      router._.setHash = () => {}
      router.draw(function(m) {
        m.page('hello', 'test_message')
      })
      router.mount('main')
      router.redirectTo('hello')

      expect(method.calledWith('main')).to.equal(true)
      expect(router.component).to.equal('test_message')
    })

    it('should take the second argument as query params', () => {
      let router, method

      window.TestMessage = class {}
      window.TestMessage.prototype.mount = method = sinon.spy()
      router = new Cape.Router()
      router._.setHash = () => {}
      router.draw(function(m) {
        m.page('hello', 'test_message')
      })
      router.mount('main')
      router.redirectTo('hello', { name: 'John', message: 'Goodby'})

      expect(method.calledWith('main')).to.equal(true)
      expect(router.component).to.equal('test_message')
      expect(router.query.name).to.equal('John')
      expect(router.query.message).to.equal('Goodby')
    })

    it('should take the third argument as options', () => {
      let router, method

      router = new Cape.Router()
      router._.setHash = () => {}
      router.draw(function(m) {
        m.page('hello', 'test_message')
      })

      class TestMessage extends Cape.Component {
        init() {
          this.notice = router.flash.notice
          this.alert = router.flash.alert
        }

        mount() { this.init() }
      }

      window.TestMessage = TestMessage

      router.mount('main')
      router.redirectTo('hello', {}, { notice: 'X', alert: 'Y' })

      expect(router.component).to.equal('test_message')
      expect(router._.mountedComponent.notice).to.equal('X')
      expect(router._.mountedComponent.alert).to.equal('Y')
    })

    // For backward compatibility. This example should be removed on the vertion 2.x.
    it('should take the second argument as options if it has a notice/alert key', () => {
      let router, method

      router = new Cape.Router()
      router._.setHash = () => {}
      router.draw(function(m) {
        m.page('hello', 'test_message')
      })

      class TestMessage extends Cape.Component {
        init() {
          this.notice = router.flash.notice
          this.alert = router.flash.alert
        }

        mount() { this.init() }
      }

      window.TestMessage = TestMessage

      router.mount('main')
      router.redirectTo('hello', { notice: 'X', alert: 'Y' })

      expect(router.component).to.equal('test_message')
      expect(router._.mountedComponent.notice).to.equal('X')
      expect(router._.mountedComponent.alert).to.equal('Y')
    })

    it('should not take the second argument as options if the third argument is given', () => {
      let router, method

      router = new Cape.Router()
      router._.setHash = () => {}
      router.draw(function(m) {
        m.page('hello', 'test_message')
      })

      class TestMessage extends Cape.Component {
        init() {
          this.notice = router.flash.notice
          this.alert = router.flash.alert
        }

        mount() { this.init() }
      }

      window.TestMessage = TestMessage

      router.mount('main')
      router.redirectTo('hello', { notice: 'X', alert: 'Y' }, {})

      expect(router.component).to.equal('test_message')
      expect(router.query.notice).to.equal('X')
      expect(router.query.alert).to.equal('Y')
      expect(router._.mountedComponent.notice).to.be_null
      expect(router._.mountedComponent.alert).to.be_null
    })
  })

  describe('show', () => {
    afterEach(() => {
      window.TestMessage = undefined
    })

    it('should mount the specified component', () => {
      let router, method

      window.TestMessage = class {}
      window.TestMessage.prototype.mount = method = sinon.spy()
      router = new Cape.Router()
      router._.setHash = () => {}
      router.draw(function(m) {
        m.page('hello', 'test_message')
      })
      router.mount('main')
      router.show(window.TestMessage)

      expect(method.calledWith('main')).to.equal(true)
    })

    it('should take the second argument as query params', () => {
      let router, method

      window.TestMessage = class {}
      window.TestMessage.prototype.mount = method = sinon.spy()
      router = new Cape.Router()
      router._.setHash = () => {}
      router.draw(function(m) {
        m.page('hello', 'test_message')
      })
      router.mount('main')
      router.show(window.TestMessage, { name: 'John', message: 'Goodby'})

      expect(method.calledWith('main')).to.equal(true)
      expect(router.query.name).to.equal('John')
      expect(router.query.message).to.equal('Goodby')
    })
  })
})
