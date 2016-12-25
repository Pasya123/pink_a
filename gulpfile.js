"use strict";

var gulp = require("gulp");
var sass = require("gulp-sass");
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");

var autoprefixer = require("autoprefixer");
var cssnano = require('gulp-cssnano');
var concatCSS = require('gulp-concat-css');
var mqpacker = require("css-mqpacker");


var server = require("browser-sync").create();
var del = require("del");
var run = require("run-sequence");


var svgmin = require("gulp-svgmin");
var svgstore = require("gulp-svgstore");
var inject = require("gulp-inject");
var imagemin = require("gulp-imagemin");

var rename = require("gulp-rename");
var uglify = require("gulp-uglifyjs");


/* CSS */

gulp.task("style", function() {
  gulp.src("sass/style.sass")
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer({browsers: [
        "last 2 versions"
      ]})
    ]))
    .pipe(gulp.dest("css"))
    .pipe(cssnano())
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest("css"))
    .pipe(server.stream());
});

gulp.task("style-build", function() {

  return gulp.src("sass/style.sass")
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer({browsers: [
        "last 2 versions"
      ]}),
      mqpacker({
        sort : true
      })
    ]))
    .pipe(cssnano())
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest("build/css"));
});

/* Scripts */

gulp.task("scripts", function() {
  return gulp.src("js/app.js")
    .pipe(uglify())
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest("js"));
});

gulp.task("scripts-build", function() {
  return gulp.src(["js/**/*.js", "!js/**/*.min.js"])
    .pipe(uglify())
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest("build/js"));
});


/* Graphics */

gulp.task("symbols", function() {
  return gulp.src("img/svg-img/**/*.svg")
    .pipe(svgmin())
    .pipe(svgstore({
      inlineSvg : true
    }))
    .pipe(rename("symbols.svg"))
    .pipe(gulp.dest("img"));
});

gulp.task("symbols-build", function () {

    function fileContents (filePath, file) {
        return file.contents.toString();
    }

    return gulp.src("*.html")
        .pipe(inject(gulp.src("img/symbols.svg"), { transform: fileContents }))
        .pipe(gulp.dest("."));
});


gulp.task("images-build", function() {
  return gulp.src(["img/**/*.{png,jpg,gif,svg}", "!img/svg-img{,/**}"])
    .pipe(imagemin([
      imagemin.optipng({ optimizationLevel: 3 }),
      imagemin.jpegtran({ progressive: true })
    ]))
    .pipe(gulp.dest("build/img"));
});


/* Build project */

gulp.task("copy-files", function() {

  return gulp.src([
      "fonts/**/*.{woff,woff2}",
      "*.html"
    ], {
      base : "."
    })
    .pipe(gulp.dest("build"));
});


gulp.task("clean", function() {
  return del("build");
});


gulp.task("build", function(fn) {

  run("clean",
    "symbols",
    "symbols-build",
    "copy-files",
    "style-build",
    "scripts-build",
    "images-build",
    fn);
});


/* Dev server */

gulp.task("serve", ["style"], function() {
  server.init({
    server: ".",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("sass/**/*.{scss,sass}", ["style"]);
  gulp.watch(["js/**/*.js", "!js/*.min.js"], ["scripts"]);
  gulp.watch("*.html").on("change", server.reload);
});
