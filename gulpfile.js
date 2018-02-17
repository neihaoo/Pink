'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var plumber = require('gulp-plumber');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var cssmin = require('gulp-csso');
var concat = require('gulp-concat');
var jsmin = require('gulp-uglify');
var rename = require('gulp-rename');
var imagemin = require('gulp-imagemin');
var webp = require('gulp-webp');
var svg = require('gulp-svgstore');
var svgmin = require('gulp-svgmin');
var posthtml = require('gulp-posthtml');
var include = require('posthtml-include');
var htmlmin = require('gulp-htmlmin');
var del = require('del');
var run = require('run-sequence');
var server = require('browser-sync').create();

gulp.task('style', function() {
  gulp.src('source/sass/style.scss')
  .pipe(plumber())
  .pipe(sass())
  .pipe(postcss([
    autoprefixer({
      browsers: [
        'last 4 version'
      ]})
  ]))
  .pipe(gulp.dest('build/css'))
  .pipe(cssmin())
  .pipe(rename('style.min.css'))
  .pipe(gulp.dest('build/css'))
  .pipe(server.stream());
});

gulp.task('scripts', function() {
  return gulp.src(['!source/js/picturefill.min.js', 'source/js/*.js'])
    .pipe(concat('script.js'))
    .pipe(gulp.dest('build/js'))
    .pipe(jsmin())
    .pipe(rename('script.min.js'))
    .pipe(gulp.dest('build/js'));
});

gulp.task('images', function() {
  gulp.src('source/img/**/*.{png,jpg,svg}')
  .pipe(imagemin([
    imagemin.optipng({
      optimizationLevel: 3
    }),
    imagemin.jpegtran({
      progressive: true
    }),
    imagemin.svgo({
      plugins: [{
        removeViewBox: false
      }]
    })
  ]))
  .pipe(gulp.dest('build/img'));
});

gulp.task('webp', function() {
  return gulp.src('source/img/**/*.{png,jpg}')
  .pipe(webp({
    quality: 90
  }))
  .pipe(gulp.dest('build/img'));
});

gulp.task('sprite', function() {
  gulp.src('source/img/for_sprite/*.svg')
  .pipe(svgmin({
    plugins: [{
      removeViewBox: false
    }]
  }))
  .pipe(svg({
    inlineSvg: true
  }))
  .pipe(rename('sprite.svg'))
  .pipe(gulp.dest('build/img'));
});

gulp.task('html', function() {
  return gulp.src('source/*.html')
  .pipe(posthtml([
    include()
  ]))
  .pipe(htmlmin({
    collapseWhitespace: true
  }))
  .pipe(gulp.dest('build'));
});

gulp.task('copy', function() {
  return gulp.src([
    'source/fonts/**/*.{woff,woff2}',
    'source/js/*.min.js'
  ], {
    base: 'source'
  })
  .pipe(gulp.dest('build'));
});

gulp.task('clean', function() {
  return del('build');
});

gulp.task('build', function(done) {
  run(
    'clean',
    ['copy', 'images', 'webp', 'style', 'scripts', 'sprite'],
    'html',
    done
  );
});

gulp.task('serve', function() {
  server.init({
    server: 'build/',
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch('source/sass/**/*.{scss,sass}', ['style']);
  gulp.watch('source/js/*.js', ['scripts']).on('change', server.reload);
  gulp.watch('source/*.html', ['html']).on('change', server.reload);
});
