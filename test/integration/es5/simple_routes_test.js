'use strict';

describe('Demo', function() {
  describe('SimpleRoutes', function() {
    before(function() {
      var div = document.createElement('div');
      div.id = "main";
      document.body.appendChild(div);
    })

    after(function() {
      var element = document.getElementById('main');
      document.body.removeChild(element);
    })

    it('should switch components', function() {
      var main, p;

      simple_router._.setHash = function() {};
      simple_router.mount('main');
      simple_router.start();

      main = document.getElementById('main');
      p = main.getElementsByTagName('p')[0];
      expect(p.textContent).to.equal('This is the top page.')

      simple_router.navigate('about');
      main = document.getElementById('main');
      p = main.getElementsByTagName('p')[0];
      expect(p.textContent).to.equal('This is the about page.')

      simple_router.navigate('help');
      main = document.getElementById('main');
      p = main.getElementsByTagName('p')[0];
      expect(p.textContent).to.equal('This is the help page.')

      simple_router.navigate('');
      main = document.getElementById('main');
      p = main.getElementsByTagName('p')[0];
      expect(p.textContent).to.equal('This is the top page.')

      simple_router.stop();
    })
  })
})
