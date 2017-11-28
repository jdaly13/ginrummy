'use strict';
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var watchify = require('watchify');
var babel = require('babelify');
var browserSync = require('browser-sync');
var sass = require('gulp-sass');
//var replace = require('gulp-replace-task');
var del = require('del');
var exit = require('gulp-exit');
var minify = require('gulp-minify');
//var configuration = getConfigFile(process.env.ENV);

var browserifyOpts = {
  entries: ['./src/js/scripts.js'],
  debug: true
};

function bundle(b) {
  return b.bundle()
    .on('error', function(err) { console.error(err + 'error'); this.emit('end'); })
    .pipe(source('build.js'))
    .pipe(buffer())
    .pipe(gulp.dest('./.tmp'));
}


gulp.task('bundle', ()=> {
  bundle(browserify(browserifyOpts.entries[0], { debug: true }).transform(babel, {presets: ["es2015"]}));
});


gulp.task('watchify', () => {
  let b = watchify(browserify(browserifyOpts.entries[0], { debug: true }).transform(babel, {presets: ["es2015"]}));

  b.on('update', () => {
    return bundle(b);
  });

  return bundle(b);
});

gulp.task('browserSync', () => {
  browserSync.init(null, {
    files: ['./.tmp/*.html', './.tmp/*.js'],
    browser: ['google chrome'],
    port: 7002,
    server: {
      baseDir: './.tmp'
    },
    //proxy: '',
    online: true,
    open: 'local'
  });
});

gulp.task('replace', () => {
  return gulp.src('./src/index.html')
  .pipe(gulp.dest('./.tmp'));

});

gulp.task('sass', function() {
  return gulp.src('./src/scss/style.scss')
    .pipe(sass({
      includePaths: [
          "node_modules/reset-css"
        ]
    }))
    .pipe(gulp.dest('./.tmp/css'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('copy_image', () => {
  return gulp.src('./src/images/{*,/}*')
  .pipe(gulp.dest('./.tmp/images'))
  .pipe(browserSync.reload({
    stream: true
  }));
});


gulp.task('clean', function() {
  return del.sync(['./.tmp', 'live']);
});


gulp.task('watchFiles', ()=> {
    gulp.watch('./src/scss/**/*.scss', ['sass']);
    gulp.watch('./src/index.*', ['replace']);
    gulp.watch('./src/images/{*,/}*', ['copy_image']);
  })
  
  gulp.task('build', ['clean', 'sass', 'replace', 'copy_image', 'icons', 'copy_fonts', 'bundle'], () => {
    gulp.src('./live/*.js')
    .pipe(minify())
    .pipe(gulp.dest(alive))
    .pipe(exit())
  });
  
  gulp.task('start', ['replace', 'copy_image', 'sass', 'watchify', 'browserSync', 'watchFiles']);
  gulp.task('panorama',['browsersyncpanorama'])
