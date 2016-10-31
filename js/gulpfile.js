var gulp = require('gulp');
var gutil = require('gulp-util'); // for console logging build process.
var source = require('vinyl-source-stream'); // from sending file from one part of
// part of build process to another part.
var browserify = require('browserify'); // for dependency and load order.
var watchify = require('watchify'); // tool for rerun gulp when code changes.
var reactify = require('reactify'); // works with browserify to convert jsx to js.

gulp.task('default', function() {
  var bundler = watchify(browserify({
    entries: ['./src/app.jsx'],
    transform: [reactify],
    extensions: ['.jsx'],
    debug: false,
    cache: {},
    packageCache: {},
    fullPaths: false
  }));

  function build(file) {
    if (file) gutil.log('Recompiling ' + file);
    return bundler
      .bundle()
      .on('error', gutil.log.bind(gutil, 'Browserify Error'))
      .pipe(source('application.js'))
      .pipe(gulp.dest('../static/js'));
  }
  build();
  bundler.on('update', build);
});
