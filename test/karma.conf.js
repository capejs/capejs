module.exports = function(config) {
  config.set({
      basePath: '',
      autoWatch: true,
      frameworks: ['mocha'],
      plugins: [
          'karma-mocha',
          'karma-coverage',
          'karma-phantomjs-launcher'
      ],
      files: [
          '../node_modules/mocha/mocha.js',
          '../node_modules/expect.js/index.js',
          '../dist/cape/cape.js',
          'specs/component.js',
      ],
      browsers: ['PhantomJS'],
      reporters: ['progress', 'coverage'],
      preprocessors: {
          '../dist/cape/cape.js': ['coverage']
      },
      coverageReporter: {
          dir: '../coverage/'
      },
      singleRun: true
  })
}
