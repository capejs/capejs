module.exports = function(config) {
  config.set({
    basePath: '',
    autoWatch: true,
    frameworks: ['mocha'],
    plugins: [
      'karma-mocha',
      'karma-chrome-launcher'
    ],
    browsers: ['Chrome'],
    reporters: ['progress'],
    singleRun: true,
    files: [
      '../node_modules/chai/chai.js',
      '../node_modules/sinon/pkg/sinon.js',
      '../dist/cape.js',
      '../test/chai.js',
      '../demo/hello_message/*.js',
      '../demo/hello_message2/*.js',
      '../demo/click_counter/*.js',
      '../demo/todo_list/*.js',
      '../demo/partials/*.js',
      'integration/*.js',
      'helpers.js',
      'spec/*.js'
    ]
  })
}
