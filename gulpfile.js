import del from "del";
import gulp from "gulp";
import dartSass from "sass";
import webp from "gulp-webp";
import cssmin from "gulp-csso";
import svg from "gulp-svgstore";
import gulpSass from "gulp-sass";
import concat from "gulp-concat";
import rename from "gulp-rename";
import svgmin from "gulp-svgmin";
import server from "browser-sync";
import plumber from "gulp-plumber";
import postcss from "gulp-postcss";
import htmlmin from "gulp-htmlmin";
import posthtml from "gulp-posthtml";
import uglifyEs from "gulp-uglify-es";
import include from "posthtml-include";
import autoprefixer from "autoprefixer";
import imagemin, { mozjpeg, optipng, svgo } from "gulp-imagemin";

const sass = gulpSass(dartSass);
const uglify = uglifyEs.default;

const prepareStyles = () =>
  gulp
    .src("source/sass/styles.scss")
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([autoprefixer({ Browserslist: ["last 4 version"] })]))
    .pipe(gulp.dest("build/css"))
    .pipe(cssmin())
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest("build/css"))
    .pipe(server.stream());

const prepareScripts = () =>
  gulp
    .src(["!source/js/picturefill.min.js", "source/js/*.js"])
    .pipe(concat("scripts.js"))
    .pipe(gulp.dest("build/js"))
    .pipe(uglify())
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest("build/js"));

const minifyImages = () =>
  gulp
    .src("source/img/**/*.{png,jpg,svg}")
    .pipe(
      imagemin([
        optipng({ optimizationLevel: 3 }),
        mozjpeg({ progressive: true }),
        svgo({
          plugins: [{ name: "removeViewBox", active: true }],
        }),
      ])
    )
    .pipe(gulp.dest("build/img"));

const convertToWebP = () =>
  gulp
    .src("source/img/**/*.{png,jpg}")
    .pipe(webp({ quality: 90 }))
    .pipe(gulp.dest("build/img"));

const createSVGSprite = () =>
  gulp
    .src("source/img/for_sprite/*.svg")
    .pipe(
      svgmin({
        plugins: [{ name: "removeViewBox", active: false }],
      })
    )
    .pipe(svg({ inlineSvg: true }))
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("build/img"));

const minifyHtml = () =>
  gulp
    .src("source/*.html")
    .pipe(posthtml([include()]))
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest("build"));

const copy = () =>
  gulp
    .src(["source/fonts/**/*.{woff,woff2}", "source/js/*.min.js"], {
      base: "source",
    })
    .pipe(gulp.dest("build"));

const clean = () => del("build");

const serve = () => {
  server.init({
    server: "build/",
    notify: false,
    open: true,
    cors: true,
    ui: false,
  });

  gulp.watch("source/sass/**/*.{scss,sass}", prepareStyles);
  gulp.watch("source/js/*.js", prepareScripts).on("change", server.reload);
  gulp.watch("source/*.html", minifyHtml).on("change", server.reload);
};

const build = gulp.series(
  clean,
  gulp.parallel(
    copy,
    minifyImages,
    convertToWebP,
    prepareStyles,
    prepareScripts,
    createSVGSprite
  ),
  minifyHtml
);

export { serve, build };
