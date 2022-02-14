const { src, series, parallel, dest, watch } = require("gulp");

const del = require('del');
const rename = require("gulp-rename");
const htmlminify = require('gulp-html-minify');
const imagemin = require('gulp-imagemin');
const sass = require("gulp-dart-sass");
const cssnano = require("cssnano");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const browsersync = require("browser-sync").create();

// compileer scss, zet sourcemaps aan, autoprefix, minify, rename en schrijf naar dist/css
function compile() {
  return src("src/scss/main.scss", { sourcemaps: true })
    .pipe(sass())
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(rename("style.min.css"))
    .pipe(dest("dist/css", { sourcemaps: "." }));
}

// html minify en schrijven naar dist
function html() {
	return src("src/*.html")
		.pipe(htmlminify())
		.pipe(dest("dist"))
}

// afbeeldingen optimalizeren
function imageminify() {
	return src("src/img/*")
	.pipe(imagemin())
	.pipe(dest("dist" + '/img'))
}

// Javascript concat and minify
function js() {
	return src("src/js/*.js")
	.pipe(concat('main.js'))
	.pipe(uglify())
	.pipe(rename({ suffix: '.min' }))
	.pipe(dest("dist" + '/js'))
}

// live server maken
function sync(cb) {
  browsersync.init({
    server: {
      baseDir: ".",
    },
  });
  cb();
}

// refresh bij iedere wijziging
function syncReload(cb) {
  browsersync.reload();
  cb();
}

// Alles watchen op veranderingen
function watcher() {
	watch(["src/*.html"], series(html, syncReload));
  watch(["src/img/*"], series(imageminify, syncReload));
  watch(["src/scss/**/*.scss"], series(compile, syncReload));
	watch(["src/js/*.js"], series(js, syncReload));
}

// Voer alle taken uit
exports.default = series(compile, html, js, imageminify, sync, watcher)

// individuele taken
exports.compile = compile;
exports.html = html;
exports.images = imageminify;
exports.js = js