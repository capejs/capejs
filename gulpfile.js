var concat = require('gulp-concat');
var gulp = require('gulp');

var paths = [
  './lib/cape/vdom_builder.js',
  './lib/cape/data_store.js',
  './lib/cape/component.js',
]

gulp.task('build', function() {
  return gulp.src(paths)
    .pipe(concat('cape.js'))
    .pipe(gulp.dest('.'));
});
