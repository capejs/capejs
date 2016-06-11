var gulp = require('gulp');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var uglify = require('gulp-uglify');
var exec = require('child_process').exec;
var rename = require('gulp-rename');
var watch = require('gulp-watch');
var Server = require('karma').Server;

gulp.task('build', function(cb) {
  exec('browserify --transform babelify --standalone Cape lib/cape.js > dist/cape.js', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  })
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

gulp.task('test', ['build'], function (done) {
  new Server({
    configFile: __dirname + '/test/karma.conf.js',
    singleRun: true
  }, function(exitCode) {
    process.exit(exitCode)
  }).start();
});

gulp.task('default', ['build']);
