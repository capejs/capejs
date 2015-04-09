var concat = require('gulp-concat');
var gulp = require('gulp');
var watch = require('gulp-watch');

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

gulp.task('default', ['build']);
