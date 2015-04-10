module.exports = function(config) {
  config.set({
      basePath: '',
      autoWatch: true,
      frameworks: ['mocha'],
      plugins: [
          'karma-mocha',
          'karma-coverage',
          'karma-chrome-launcher'
      ],
      browsers: ['Chrome'],
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
