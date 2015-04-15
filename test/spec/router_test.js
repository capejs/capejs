describe('Router', function() {
  describe('exec', function() {
    it('should mount the matched component and set Router#params', function() {
      var router, method;

      window.Members = { Show: function() {} };
      window.Members.Show.prototype.mount = method = sinon.spy();
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

      window.Members = { Show: function() {} };
      window.Members.Show.prototype.mount = method = sinon.spy();
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

      window.Members = { Index: function() {}, Show: function() {} };
      window.Members.Index.prototype.mount = method1 = sinon.spy();
      window.Members.Index.prototype.unmount = method2 = sinon.spy();
      window.Members.Show.prototype.mount = method3 = sinon.spy();

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
  })
})
