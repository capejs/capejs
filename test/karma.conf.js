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
      '../es6-demo/hello_message/*.js',
      '../es6-demo/hello_message2/*.js',
      '../es6-demo/todo_list/*.es6',
      '../es6-demo/partials/*.js',
      'integration/es6/*.js',
      'helpers.js',
      'spec/*.js'
    ]
  })
}
