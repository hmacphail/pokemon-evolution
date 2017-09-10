gulp = require('gulp');
browserSync = require('browser-sync').create();
less = require('gulp-less');
nodemon = require('gulp-nodemon');
runSequence = require('run-sequence');
useref = require('gulp-useref');
browserify = require('browserify');
transform = require('vinyl-transform');
uglify = require('gulp-uglify');
gulpIf = require('gulp-if');
cssnano = require('gulp-cssnano');
del = require('del');

// Development Process
// -------------------
gulp.task('browserify', function () {

  var browserified = transform(function(filename) {
    var b = browserify(filename);
    return b.bundle();
  });

  return gulp.src(['./src/*.js'])
    .pipe(browserified)
    .pipe(uglify())
    .pipe(gulp.dest('./dist'));
});

gulp.task('default', ['watch', 'browserify']);




gulp.task('less', function() {
  return gulp.src('app/less/**/*.less')
    .pipe(less())
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('watch', ['less'], function() {
  gulp.watch('app/less/**/*.less', ['less']);
});

// Build Optimization
// ------------------
gulp.task('clean:dist', function() {
  return del.sync('dist');
});

gulp.task('useref', function(){
  return gulp.src('app/**/*.html')
    .pipe(useref())
    .pipe(gulpIf('*.js', uglify())) // Minifies only JS files
    .pipe(gulpIf('*.css', cssnano())) // Minifies only CSS files
    .pipe(gulp.dest('dist'));
});

gulp.task('fonts', function() {
  return gulp.src('app/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'));
});

gulp.task('build', function (callback) {
  runSequence('clean:dist',
    ['less', 'useref', 'fonts'],
    callback
  );
});