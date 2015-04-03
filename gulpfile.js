var concat = require('gulp-concat');
var gulp = require('gulp');

gulp.task('build', function() {
  return gulp.src(['./lib/vdom_builder.js', './lib/cape_data_store.js', './lib/cape_component.js'])
    .pipe(concat('cape.js'))
    .pipe(gulp.dest('.'));
});

