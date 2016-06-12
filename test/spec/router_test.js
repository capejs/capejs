'use strict';

describe('Router', function() {
  describe('constructor', function() {
    it('should have complete set of properties', function() {
      var router = new Cape.Router();

      expect(router.rootContainer).to.equal(window);
      expect(Array.isArray(router.routes)).to.be.true;
      expect(typeof router.params).to.equal('object');
      expect(typeof router.query).to.equal('object');
      expect(typeof router.vars).to.equal('object');
      expect(typeof router.flash).to.equal('object');
    })
  })

  describe('attach', function() {
    it('should register a component as an event listener', function() {
      var router, component;

      router = new Cape.Router();
      component = { reload: sinon.spy() };
      router.attach(component);
      router.notify();

      expect(component.reload.called).to.equal(true);
    })

    it('should not register a component twice', function() {
      var router, component;

      router = new Cape.Router();
      component = { reload: sinon.spy() };
      router.attach(component);
      router.attach(component);

      expect(router._.notificationListeners.length).to.equal(1);
    })

    it('should throw an exception when the listener does not have "reload" method', function() {
      var router, component;

      router = new Cape.Router();
      expect(router.attach.bind(router, {})).to
        .throw('The listener must have the "reload" function.')
    })
  })

  describe('detach', function() {
    it('should unregister a component as an event listener', function() {
      var router, component;

      router = new Cape.Router();
      component = { reload: sinon.spy() };
      router.attach(component);
      router.detach(component);
      router.notify();

      expect(component.reload.called).not.to.equal(true);
    })
  })

  describe('beforeNavigation', function() {
    after(function() {
      window.Top = undefined;
    })

    it('should register a beforeNavigation callback', function() {
      var router, method;

      router = new Cape.Router();
      router.beforeNavigation(function() {})

      expect(router._.beforeNavigationCallbacks.length).to.equal(1);
    })
  })

  describe('start', function() {
    it('should mount a component', function() {
      var router, method;

      window.HomePage = {};
      window.HomePage.Index = function() {};
      window.HomePage.Index.prototype.mount = method = sinon.spy();

      router = new Cape.Router();
      router._.setHash = function() {};
      router.draw(function(m) {
        m.page('', 'home_page.index');
      })
      router.mount('main');
      router.start();

      expect(method.calledWith('main')).to.equal(true);
    })
  })

  describe('stop', function() {
    it('should unmount a component', function() {
      var router, method;

      window.HomePage = {};
      window.HomePage.Index = function() {};
      window.HomePage.Index.prototype.mount = function() {};
      window.removeEventListener = sinon.spy();

      router = new Cape.Router();
      router._.setHash = function() {};
      router.draw(function(m) {
        m.page('', 'home_page.index');
      })
      router.mount('main');
      router.start();
      router.stop();

      expect(window.removeEventListener.calledOnce).to.equal(true);
    })
  })

  describe('constructor', function() {
    it('should specify the root container of components', function() {
      var router, method;

      window.App = {}
      window.App.HomePage = {};
      window.App.HomePage.Index = function() {};
      window.App.HomePage.Index.prototype.mount = method = sinon.spy();

      router = new Cape.Router(window.App);
      router._.setHash = function() {};
      router.draw(function(m) {
        m.page('', 'home_page.index');
      })
      router.mount('main');
      router.start();

      expect(method.calledWith('main')).to.equal(true);
    })
  })

  describe('draw', function() {
    it ('should throw when the first argument is not a function', function() {
      var router = new Cape.Router();

      expect(function() { router.draw("") }).to.throw(/must be a function/);
    })

    it ('should throw when the given function takes no argument', function() {
      var router = new Cape.Router();

      expect(function() { router.draw(function() {}) }).to.throw(/requires an argument/);
    })
  })

  describe('navigateTo', function() {
    afterEach(function() {
      window.TestMessage = undefined;
      window.Members = undefined;
      window.App = undefined;
      window.Admin = undefined;
      window.Adm = undefined;
    })

    it('should mount the matched component', function() {
      var router, method;

      window.TestMessage = function() {};
      window.TestMessage.prototype.mount = method = sinon.spy();
      router = new Cape.Router();
      router._.setHash = function() {};
      router.draw(function(m) {
        m.page('hello', 'test_message');
      })
      router.mount('main');
      router.navigateTo('hello');

      expect(method.calledWith('main')).to.equal(true);
      expect(router.component).to.equal('test_message');
    })

    it('should recognize query part of the URL hash', function() {
      var router, method;

      window.TestMessage = function() {};
      window.TestMessage.prototype.mount = method = sinon.spy();
      router = new Cape.Router();
      router._.setHash = function() {};
      router.draw(function(m) {
        m.page('hello', 'test_message');
      })
      router.mount('main');
      router.navigateTo('hello', { name: 'John', message: 'Goodby'});
      router.navigateTo('hello?name=John&message=Goodby&x');

      expect(method.calledWith('main')).to.equal(true);
      expect(router.component).to.equal('test_message');
      expect(router.query.name).to.equal('John');
      expect(router.query.message).to.equal('Goodby');
      expect(router.query.x).to.equal('');
    })

    it('should take the second argument as query params', function() {
      var router, method;

      window.TestMessage = function() {};
      window.TestMessage.prototype.mount = method = sinon.spy();
      router = new Cape.Router();
      router._.setHash = function() {};
      router.draw(function(m) {
        m.page('hello', 'test_message');
      })
      router.mount('main');
      router.navigateTo('hello', { name: 'John', message: 'Goodby'});

      expect(method.calledWith('main')).to.equal(true);
      expect(router.component).to.equal('test_message');
      expect(router.query.name).to.equal('John');
      expect(router.query.message).to.equal('Goodby');
    })

    it('should mount the matched component and set Router#params', function() {
      var router, method;

      window.Members = {};
      window.Members.Item = function() {};
      window.Members.Item.prototype.mount = method = sinon.spy();
      router = new Cape.Router();
      router._.setHash = function() {};
      router.draw(function(m) {
        m.many('members');
      })
      router.mount('main');
      router.navigateTo('members/123');

      expect(method.calledWith('main')).to.equal(true);
      expect(router.params.id).to.equal('123');
      expect(router.namespace).to.be.null;
      expect(router.resource).to.equal('members');
      expect(router.action).to.equal('show');
      expect(router.container).to.equal('members');
      expect(router.component).to.equal('item');
    })

    it('should mount the nested component and set Router#params', function() {
      var router, method;

      window.Members = {};
      window.Members.Item = function() {};
      window.Members.Item.prototype.mount = method = sinon.spy();
      router = new Cape.Router();
      router._.setHash = function() {};
      router.draw(function(m) {
        m.many('groups', { only: [] }, function(m) {
          m.many('members')
        });
      })
      router.mount('main');
      router.navigateTo('groups/9/members/123');

      expect(method.calledWith('main')).to.equal(true);
      expect(router.params.group_id).to.equal('9');
      expect(router.params.id).to.equal('123');
    })

    it('should unmount the mounted component before remounting', function() {
      var router, method1, method2, method3;

      window.Members = {};
      window.Members.List = function() {};
      window.Members.Item = function() {};
      window.Members.List.prototype.mount = method1 = sinon.spy();
      window.Members.List.prototype.unmount = method2 = sinon.spy();
      window.Members.Item.prototype.mount = method3 = sinon.spy();

      router = new Cape.Router();
      router._.setHash = function() {};
      router.draw(function(m) {
        m.many('members');
      })
      router.mount('main');
      router.navigateTo('members');
      router.navigateTo('members/123');

      expect(method1.calledWith('main')).to.equal(true);
      expect(method2.called).to.equal(true);
      expect(method3.calledWith('main')).to.equal(true);
    })

    it('should mount the component under a namespace', function() {
      var router, method;

      window.Admin = { Members: {} };
      window.Admin.Members.Item = function() {};
      window.Admin.Members.Item.prototype.mount = method = sinon.spy();
      router = new Cape.Router();
      router._.setHash = function() {};
      router.draw(function(m) {
        m.namespace('admin', function(m) {
          m.many('members');
        })
      })
      router.mount('main');
      router.navigateTo('admin/members/123');

      expect(method.calledWith('main')).to.equal(true);
      expect(router.params.id).to.equal('123');
      expect(router.namespace).to.equal('admin');
      expect(router.resource).to.equal('members');
      expect(router.action).to.equal('show');
      expect(router.container).to.equal('admin.members');
      expect(router.component).to.equal('item');
    })

    it('should mount the component under a deeply nested namespace', function() {
      var router, method;

      window.App = { Admin: { Members: {} } };
      window.App.Admin.Members.Item = function() {};
      window.App.Admin.Members.Item.prototype.mount = method = sinon.spy();
      router = new Cape.Router();
      router._.setHash = function() {};
      router.draw(function(m) {
        m.namespace('app', function(m) {
          m.namespace('admin', function(m) {
            m.many('members');
          })
        })
      })
      router.mount('main');
      router.navigateTo('app/admin/members/123');

      expect(method.calledWith('main')).to.equal(true);
      expect(router.params.id).to.equal('123');
    })

    it('should mount the component under a namespace with path option', function() {
      var router, method;

      window.Adm = { Members: {} };
      window.Adm.Members.Item = function() {};
      window.Adm.Members.Item.prototype.mount = method = sinon.spy();
      router = new Cape.Router();
      router._.setHash = function() {};
      router.draw(function(m) {
        m.namespace('adm', { path: 'admin' }, function(m) {
          m.many('members');
        })
      })
      router.mount('main');
      router.navigateTo('admin/members/123');

      expect(method.calledWith('main')).to.equal(true);
      expect(router.params.id).to.equal('123');
    })

    it('should run beforeNavigation callbacks', function(done) {
      var router;

      router = new Cape.Router();
      router._.setHash = function() {};
      router._.mountComponent = function(id) {
        expect(id).to.equal('login');
        done();
      }

      router.draw(function(m) {
        m.page('login', 'sessions.new');
        m.many('members');
      })

      router.beforeNavigation(function(hash) {
        return new Promise(function(resolve, reject) {
          resolve(hash);
        });
      });

      router.beforeNavigation(function(hash) {
        return new Promise(function(resolve, reject) {
          resolve('login');
        });
      });

      router.mount('main');
      router.navigateTo('members');
    })

    it('should run errorHandler', function(done) {
      var router;

      router = new Cape.Router();
      router._.setHash = function() {};

      router.draw(function(m) {
        m.many('members');
      })

      router.beforeNavigation(function(hash) {
        return new Promise(function(resolve, reject) {
          reject('ERROR');
        });
      });

      router.errorHandler(function(err) {
        expect(err).to.equal('ERROR');
        done();
      });

      router.mount('main');
      router.navigateTo('members');
    })

    it ('should call notify()', function() {
      var router, method3;

      window.Members = {};
      window.Members.Item = function() {};
      window.Members.Item.prototype.mount = method3 = sinon.spy();

      router = new Cape.Router();
      router._.setHash = function() {};
      sinon.spy(router, 'notify');
      router.draw(function(m) {
        m.many('members');
      })
      router.mount('main');
      router.navigateTo('members/1')
      router.navigateTo('members/2')

      expect(router.notify.calledOnce)
    })

    it ('should throw when the argument is not a string', function() {
      var router;

      router = new Cape.Router();
      router._.setHash = function() {};
      router.draw(function(m) {
        m.many('members');
      })
      router.mount('main');

      expect(function() { router.navigateTo(0) }).to.throw(/must be a string/);
    })
  })

  describe('redirectTo', function() {
    afterEach(function() {
      window.TestMessage = undefined;
    })

    it('should mount the matched component', function() {
      var router, method;

      window.TestMessage = function() {};
      window.TestMessage.prototype.mount = method = sinon.spy();
      router = new Cape.Router();
      router._.setHash = function() {};
      router.draw(function(m) {
        m.page('hello', 'test_message');
      })
      router.mount('main');
      router.redirectTo('hello');

      expect(method.calledWith('main')).to.equal(true);
      expect(router.component).to.equal('test_message');
    })
  })

  describe('show', function() {
    afterEach(function() {
      window.TestMessage = undefined;
    })

    it('should mount the specified component', function() {
      var router, method;

      window.TestMessage = function() {};
      window.TestMessage.prototype.mount = method = sinon.spy();
      router = new Cape.Router();
      router._.setHash = function() {};
      router.draw(function(m) {
        m.page('hello', 'test_message');
      })
      router.mount('main');
      router.show(window.TestMessage);

      expect(method.calledWith('main')).to.equal(true);
    })
  })
})
