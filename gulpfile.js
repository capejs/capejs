var concat = require('gulp-concat');
var gulp = require('gulp');
var watch = require('gulp-watch');
var karma = require('gulp-karma');

var paths = [
  './lib/cape/markup_builder.js',
  './lib/cape/component.js',
  './lib/cape/data_store.js',
  './lib/cape/router.js'
]

var build = function() {
  gulp.src(paths)
    .pipe(concat('cape.js'))
    .pipe(gulp.dest('./dist'));
}

gulp.task('build', function() {
  build();
});

gulp.task('watch', function() {
  watch('./lib/**/*.js', build);
});

var testFiles = [
  'node_modules/expect.js/index.js',
  'node_modules/jquery/dist/jquery.min.js',
  'node_modules/virtual-dom/dist/virtual-dom.js',
  'lib/cape/*.js',
  'demo/hello_message/hello_message.js',
  'demo/click_counter/click_counter.js',
  'demo/todo_list/todo_list.js',
  'demo/form_manipulator/form_manipulator.js',
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
