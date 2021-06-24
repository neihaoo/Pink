const Fiber = require('fibers');
const { src, dest, watch, series, parallel } = require('gulp');
const sass = require('gulp-sass');
const plumber = require('gulp-plumber');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssmin = require('gulp-csso');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const rename = require('gulp-rename');
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const svg = require('gulp-svgstore');
const svgmin = require('gulp-svgmin');
const posthtml = require('gulp-posthtml');
const include = require('posthtml-include');
const htmlmin = require('gulp-htmlmin');
const del = require('del');
const run = require('run-sequence');
const server = require('browser-sync').create();

sass.compiler = require('sass');

const prepareStyles = () => src('source/sass/styles.scss')
  .pipe(plumber())
  .pipe(sass({
    fiber: Fiber,
  }))
  .pipe(postcss([
    autoprefixer({
      Browserslist: [
        'last 4 version'
      ]})
  ]))
  .pipe(dest('build/css'))
  .pipe(cssmin())
  .pipe(rename({suffix: '.min'}))
  .pipe(dest('build/css'))
  .pipe(server.stream());

const prepareScripts = () => src(['!source/js/picturefill.min.js', 'source/js/*.js'])
    .pipe(concat('scripts.js'))
    .pipe(dest('build/js'))
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(dest('build/js'));

const minifyImages = () => src('source/img/**/*.{png,jpg,svg}')
  .pipe(imagemin([
    imagemin.optipng({
      optimizationLevel: 3
    }),
    imagemin.mozjpeg({
      progressive: true
    }),
    imagemin.svgo({
      plugins: [{
        removeViewBox: false
      }]
    })
  ]))
  .pipe(dest('build/img'));

const convertToWebP = () => src('source/img/**/*.{png,jpg}')
  .pipe(webp({
    quality: 90
  }))
  .pipe(dest('build/img'));

const createSVGSprite = () => src('source/img/for_sprite/*.svg')
  .pipe(svgmin({
    plugins: [{
      removeViewBox: false
    }]
  }))
  .pipe(svg({
    inlineSvg: true
  }))
  .pipe(rename('sprite.svg'))
  .pipe(dest('build/img'));

const minifyHtml = () => src('source/*.html')
  .pipe(posthtml([
    include()
  ]))
  .pipe(htmlmin({
    collapseWhitespace: true
  }))
  .pipe(dest('build'));

const copy = () => src([
    'source/fonts/**/*.{woff,woff2}',
    'source/js/*.min.js'
  ], {
    base: 'source'
  })
  .pipe(dest('build'));

const clean = () => del('build');

const serve = () => {
  server.init({
    server: 'build/',
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  watch('source/sass/**/*.{scss,sass}', prepareStyles);
  watch('source/js/*.js', prepareScripts).on('change', server.reload);
  watch('source/*.html', minifyHtml).on('change', server.reload);
};

exports.serve = serve;
exports.build = series(clean,
                       parallel(copy,
                                minifyImages,
                                convertToWebP,
                                prepareStyles,
                                prepareScripts,
                                createSVGSprite),
                       minifyHtml);
