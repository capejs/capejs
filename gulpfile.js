var gulp = require('gulp');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var uglify = require('gulp-uglify');
var exec = require('child_process').exec;
var rename = require('gulp-rename');
var watch = require('gulp-watch');
var Server = require('karma').Server;
var fs = require('fs');

gulp.task('build', function(cb) {
  exec('browserify --transform babelify --standalone Cape lib/cape.js > dist/cape.js', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  })
});

gulp.task('minify', function() {
  return gulp.src('dist/cape.js')
  .pipe(uglify().on('error', function(e) {
    console.log(e)
  }))
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

// Before excute this task, create a file named `.codeclimate_repo_token` and run:
//   export CODECLIMATE_REPO_TOKEN=`cat .codeclimate_repo_token`
gulp.task('report', function(cb) {
  exec('codeclimate-test-reporter < coverage/lcov.info', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  })
});

gulp.task('default', ['build']);
