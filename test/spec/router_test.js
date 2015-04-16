describe('Router', function() {
  describe('exec', function() {
    it('should mount the matched component and set Router#params', function() {
      var router, method;

      window.MembersShow = function() {};
      window.MembersShow.prototype.mount = method = sinon.spy();
      router = new Cape.Router();
      router.draw(function(m) {
        m.resources('members');
      })
      router.mount('main');
      router.exec('members/123');

      expect(method.calledWith('main')).to.be(true);
      expect(router.params.id).to.be('123');
    })

    it('should mount the nested component and set Router#params', function() {
      var router, method;

      window.MembersShow = function() {};
      window.MembersShow.prototype.mount = method = sinon.spy();
      router = new Cape.Router();
      router.draw(function(m) {
        m.resources('groups', { only: [] }, function(m) {
          m.resources('members')
        });
      })
      router.mount('main');
      router.exec('groups/9/members/123');

      expect(method.calledWith('main')).to.be(true);
      expect(router.params.group_id).to.be('9');
      expect(router.params.id).to.be('123');
    })

    it('should unmount the mounted component before remounting', function() {
      var router, method1, method2, method3;

      window.MembersIndex = function() {};
      window.MembersShow = function() {};
      window.MembersIndex.prototype.mount = method1 = sinon.spy();
      window.MembersIndex.prototype.unmount = method2 = sinon.spy();
      window.MembersShow.prototype.mount = method3 = sinon.spy();

      router = new Cape.Router();
      router.draw(function(m) {
        m.resources('members');
      })
      router.mount('main');
      router.exec('members');
      router.exec('members/123');

      expect(method1.calledWith('main')).to.be(true);
      expect(method2.called).to.be(true);
      expect(method3.calledWith('main')).to.be(true);
    })

    it('should mount the component under a namespace', function() {
      var router, method;

      window.AdminMembersShow = function() {};
      window.AdminMembersShow.prototype.mount = method = sinon.spy();
      router = new Cape.Router();
      router.draw(function(m) {
        m.namespace('admin', function(m) {
          m.resources('members');
        })
      })
      router.mount('main');
      router.exec('admin/members/123');

      expect(method.calledWith('main')).to.be(true);
      expect(router.params.id).to.be('123');
    })

    it('should mount the component under a namespace with module option', function() {
      var router, method;

      window.AdmMembersShow = function() {};
      window.AdmMembersShow.prototype.mount = method = sinon.spy();
      router = new Cape.Router();
      router.draw(function(m) {
        m.namespace('admin', { module: 'adm' }, function(m) {
          m.resources('members');
        })
      })
      router.mount('main');
      router.exec('admin/members/123');

      expect(method.calledWith('main')).to.be(true);
      expect(router.params.id).to.be('123');
    })
  })
})
