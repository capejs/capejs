var gulp = require('gulp');
var run = require('gulp-run');

gulp.task('push', function() {
  return run('hugo; cd ../gh-pages; git add .; git ci -m "automatic update"; git push').exec()
});
