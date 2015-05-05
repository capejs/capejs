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
    singleRun: true
  })
}
