var gulp = require('gulp');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var uglify = require('gulp-uglify');
var run = require('gulp-run');
var rename = require('gulp-rename');
var watch = require('gulp-watch');
var Server = require('karma').Server;

gulp.task('build', function() {
  return run('browserify --standalone Cape lib/cape.js > dist/cape.js').exec()
});

gulp.task('minify', function() {
  return gulp.src('dist/cape.js')
  .pipe(uglify())
  .pipe(rename('cape.min.js'))
  .pipe(gulp.dest('./dist'));
})

gulp.task('watch', function() {
  gulp.watch('./lib/**/*.js', ['build']);
});

var testFiles = [
  'node_modules/chai/chai.js',
  'node_modules/sinon/pkg/sinon.js',
  'node_modules/whatwg/fetch.js',
  'dist/cape.js',
  'test/chai.js',
  'demo/**/*.js',
  'es6-demo/hello_message/*.js',
  'es6-demo/todo_list/*.js',
  'es6-demo/partials/*.js',
  'test/integration/*.js',
  'test/integration/es6/*.js',
  'test/helpers.js',
  'test/spec/*.js'
];

gulp.task('test', function (done) {
  new Server({
    configFile: __dirname + '/test/karma.conf.js',
    singleRun: true
  }, function(exitCode) {
    process.exit(exitCode)
  }).start();
});

gulp.task('default', ['build']);
