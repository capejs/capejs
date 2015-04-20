describe('Router', function() {
  describe('attach', function() {
    it('should register a component as an event listener', function() {
      var router, component;

      router = new Cape.Router();
      component = { refresh: sinon.spy() };
      router.attach(component);
      router._.notify();

      expect(component.refresh.called).to.be(true);
    })

    it('should not register a component twice', function() {
      var router, component;

      router = new Cape.Router();
      component = { refresh: sinon.spy() };
      router.attach(component);
      router.attach(component);

      expect(router._.components.length).to.be(1);
    })
  })

  describe('detach', function() {
    it('should unregister a component as an event listener', function() {
      var router, component;

      router = new Cape.Router();
      component = { refresh: sinon.spy() };
      router.attach(component);
      router.detach(component);
      router._.notify();

      expect(component.refresh.called).not.to.be(true);
    })
  })

  describe('beforeNavigation', function() {
    after(function() {
      window.Top = undefined;
    })

    it('should register a beforeNavigation callback', function() {
      var router, method;

      window.Top = {};
      window.Top.Index = function() {};
      window.Top.Index.prototype.mount = function() {};
      method = sinon.spy();

      router = new Cape.Router();
      router._.setHash = function() {};
      router.draw(function(m) {
        m.match('', 'top/index');
      })
      router.beforeNavigation(method);
      router.mount('main');
      router.start();

      expect(method.called).to.be(true);
    })
  })

  describe('start', function() {
    after(function() {
      window.Top = undefined;
    })

    it('should mount a component', function() {
      var router, method;

      window.Top = {};
      window.Top.Index = function() {};
      window.Top.Index.prototype.mount = method = sinon.spy();

      router = new Cape.Router();
      router._.setHash = function() {};
      router.draw(function(m) {
        m.match('', 'top/index');
      })
      router.mount('main');
      router.start();

      expect(method.calledWith('main')).to.be(true);
    })
  })

  describe('navigate', function() {
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
        m.match('hello', 'test_message');
      })
      router.mount('main');
      router.navigate('hello');

      expect(method.calledWith('main')).to.be(true);
      expect(router.component).to.be('test_message');
    })

    it('should mount the matched component and set Router#params', function() {
      var router, method;

      window.Members = {};
      window.Members.Show = function() {};
      window.Members.Show.prototype.mount = method = sinon.spy();
      router = new Cape.Router();
      router._.setHash = function() {};
      router.draw(function(m) {
        m.resources('members');
      })
      router.mount('main');
      router.navigate('members/123');

      expect(method.calledWith('main')).to.be(true);
      expect(router.params.id).to.be('123');
      expect(router.namespace).to.be('members');
      expect(router.component).to.be('show');
    })

    it('should mount the nested component and set Router#params', function() {
      var router, method;

      window.Members = {};
      window.Members.Show = function() {};
      window.Members.Show.prototype.mount = method = sinon.spy();
      router = new Cape.Router();
      router._.setHash = function() {};
      router.draw(function(m) {
        m.resources('groups', { only: [] }, function(m) {
          m.resources('members')
        });
      })
      router.mount('main');
      router.navigate('groups/9/members/123');

      expect(method.calledWith('main')).to.be(true);
      expect(router.params.group_id).to.be('9');
      expect(router.params.id).to.be('123');
    })

    it('should unmount the mounted component before remounting', function() {
      var router, method1, method2, method3;

      window.Members = {};
      window.Members.Index = function() {};
      window.Members.Show = function() {};
      window.Members.Index.prototype.mount = method1 = sinon.spy();
      window.Members.Index.prototype.unmount = method2 = sinon.spy();
      window.Members.Show.prototype.mount = method3 = sinon.spy();

      router = new Cape.Router();
      router._.setHash = function() {};
      router.draw(function(m) {
        m.resources('members');
      })
      router.mount('main');
      router.navigate('members');
      router.navigate('members/123');

      expect(method1.calledWith('main')).to.be(true);
      expect(method2.called).to.be(true);
      expect(method3.calledWith('main')).to.be(true);
    })

    it('should mount the component under a namespace', function() {
      var router, method;

      window.Admin = { Members: {} };
      window.Admin.Members.Show = function() {};
      window.Admin.Members.Show.prototype.mount = method = sinon.spy();
      router = new Cape.Router();
      router._.setHash = function() {};
      router.draw(function(m) {
        m.namespace('admin', function(m) {
          m.resources('members');
        })
      })
      router.mount('main');
      router.navigate('admin/members/123');

      expect(method.calledWith('main')).to.be(true);
      expect(router.params.id).to.be('123');
    })

    it('should mount the component under a deeply nested namespace', function() {
      var router, method;

      window.App = { Admin: { Members: {} } };
      window.App.Admin.Members.Show = function() {};
      window.App.Admin.Members.Show.prototype.mount = method = sinon.spy();
      router = new Cape.Router();
      router._.setHash = function() {};
      router.draw(function(m) {
        m.namespace('app', function(m) {
          m.namespace('admin', function(m) {
            m.resources('members');
          })
        })
      })
      router.mount('main');
      router.navigate('app/admin/members/123');

      expect(method.calledWith('main')).to.be(true);
      expect(router.params.id).to.be('123');
    })

    it('should mount the component under a namespace with path option', function() {
      var router, method;

      window.Adm = { Members: {} };
      window.Adm.Members.Show = function() {};
      window.Adm.Members.Show.prototype.mount = method = sinon.spy();
      router = new Cape.Router();
      router._.setHash = function() {};
      router.draw(function(m) {
        m.namespace('adm', { path: 'admin' }, function(m) {
          m.resources('members');
        })
      })
      router.mount('main');
      router.navigate('admin/members/123');

      expect(method.calledWith('main')).to.be(true);
      expect(router.params.id).to.be('123');
    })

    it('should skip beforeNavigationCallbacks', function() {
      var router, method;

      window.TestMessage = function() {};
      window.TestMessage.prototype.mount = function() {};
      router = new Cape.Router();
      router._.setHash = function() {};
      router.draw(function(m) {
        m.match('hello', 'test_message');
      })
      method = sinon.spy();
      router.beforeNavigation(method);
      router.mount('main');
      router.navigate('hello', true);

      expect(method.called).to.be(false);
    })

    it('should not mount the route is waiting', function() {
      var router, method;

      window.TestMessage = function() {};
      window.TestMessage.prototype.mount = method = sinon.spy();
      router = new Cape.Router();
      router._.setHash = function() {};
      router.draw(function(m) {
        m.match('hello', 'test_message');
      })
      router.beforeNavigation(function() {
        this.waiting = true;
      });
      router.mount('main');
      router.navigate('hello');

      expect(method.called).to.be(false);
    })
  })
})
