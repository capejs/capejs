describe('Router', function() {
  describe('attach', function() {
    it('should register a component as an event listener', function() {
      var router, component;

      router = new Cape.Router();
      component = { refresh: sinon.spy() };
      router.attach(component);
      router.notify();

      expect(component.refresh.called).to.equal(true);
    })

    it('should not register a component twice', function() {
      var router, component;

      router = new Cape.Router();
      component = { refresh: sinon.spy() };
      router.attach(component);
      router.attach(component);

      expect(router._.attachedComponents.length).to.equal(1);
    })
  })

  describe('detach', function() {
    it('should unregister a component as an event listener', function() {
      var router, component;

      router = new Cape.Router();
      component = { refresh: sinon.spy() };
      router.attach(component);
      router.detach(component);
      router.notify();

      expect(component.refresh.called).not.to.equal(true);
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
        m.page('hello', 'test_message');
      })
      router.mount('main');
      router.navigate('hello');

      expect(method.calledWith('main')).to.equal(true);
      expect(router.component).to.equal('test_message');
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
      router.navigate('members/123');

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
      router.navigate('groups/9/members/123');

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
      router.navigate('members');
      router.navigate('members/123');

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
      router.navigate('admin/members/123');

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
      router.navigate('app/admin/members/123');

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
      router.navigate('admin/members/123');

      expect(method.calledWith('main')).to.equal(true);
      expect(router.params.id).to.equal('123');
    })
  })
})
