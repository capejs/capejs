var concat = require('gulp-concat');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var watch = require('gulp-watch');
var karma = require('gulp-karma');

var paths = [
  './lib/cape/utilities.js',
  './lib/cape/markup_builder.js',
  './lib/cape/component.js',
  './lib/cape/data_store.js',
  './lib/cape/routing_mapper.js',
  './lib/cape/router.js'
]

var build = function() {
  browserify({
    entries: ['./lib/cape.js'],
    standalone: 'Cape'
  })
  .bundle()
  .pipe(source('cape.js'))
  .pipe(gulp.dest('./dist'));
}

gulp.task('build', function() {
  build();
});

gulp.task('watch', function() {
  watch('./lib/**/*.js', build);
});

var testFiles = [
  'node_modules/sinon/pkg/sinon.js',
  'node_modules/expect.js/index.js',
  'dist/cape.js',
  'demo/**/*.js',
  'es6-demo/hello_message/*.js',
  'test/integration/*.js',
  'test/spec/*.js'
];

gulp.task('test', function() {
  return gulp.src(testFiles)
    .pipe(karma({
      configFile: 'test/karma.conf.js',
      action: 'run'
    }))
    .on('error', function(err) {
      throw err;
    });
});

gulp.task('default', ['build']);
