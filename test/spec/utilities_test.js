describe('Cape', function() {
  describe('extend', function() {
    it('merge the properties of objects into the first.', function() {
      var obj1 = { a: 1, b: 2, c: 3 };
      var obj2 = { a: 4, d: 5 };
      var obj3 = { d: 6, e: 7 };

      window.Cape.extend(obj1, obj2, obj3);
      expect(obj1.a).to.be(4);
      expect(obj1.b).to.be(2);
      expect(obj1.c).to.be(3);
      expect(obj1.d).to.be(6);
      expect(obj1.e).to.be(7);
    })
  })

  describe('deepExtend', function() {
    it('merge the properties of objects into the first recursively.', function() {
      var obj1 = { a: { b: { c: 1, d: 2 } }, x: { y: 3 } };
      var obj2 = { a: { b: { d: 4 } }, x: { z: 5 } };
      var obj3 = { a: { b: { e: { f: 6 } } }, x: { } };

      window.Cape.deepExtend(obj1, obj2, obj3);
      expect(obj1.a.b.c).to.be(1);
      expect(obj1.a.b.d).to.be(4);
      expect(obj1.a.b.e.f).to.be(6);
      expect(obj1.x.y).to.be(3);
      expect(obj1.x.z).to.be(5);
    })
  })
})
