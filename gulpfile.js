"use strict";

var gulp = require("gulp");
var sass = require("gulp-sass");
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var server = require("browser-sync").create();
var svgmin = require("gulp-svgmin");
var svgstore = require("gulp-svgstore");
var inject = require("gulp-inject");
var rename = require("gulp-rename");


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
    .pipe(server.stream());
});

gulp.task("svg-store", function() {
  return gulp.src("img/svg-img/**/*.svg")
    .pipe(svgmin())
    .pipe(svgstore({
      inlineSvg : true
    }))
    .pipe(rename("symbols.svg"))
    .pipe(gulp.dest("img"));
});

gulp.task('svg-inject', function () {

    function fileContents (filePath, file) {
        return file.contents.toString();
    }

    return gulp.src("*.html")
        .pipe(inject(gulp.src("img/symbols.svg"), { transform: fileContents }))
        .pipe(gulp.dest("."));
});

gulp.task("serve", ["style"], function() {
  server.init({
    server: ".",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("sass/**/*.{scss,sass}", ["style"]);
  gulp.watch("*.html").on("change", server.reload);
});
