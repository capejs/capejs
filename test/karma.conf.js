module.exports = function(config) {
  config.set({
      basePath: '',
      autoWatch: true,
      frameworks: ['mocha'],
      plugins: [
          'karma-mocha',
          'karma-coverage',
          'karma-chrome-launcher',
          'karma-phantomjs-launcher'
      ],
      browsers: ['Chrome', 'PhantomJS'],
      reporters: ['progress', 'coverage'],
      preprocessors: {
          '../lib/cape/*.js': ['coverage']
      },
      coverageReporter: {
          dir: '../coverage/'
      },
      singleRun: true
  })
}
