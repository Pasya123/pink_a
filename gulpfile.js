"use strict";

var gulp = require("gulp");
var less = require("gulp-less");
var plumber = require("gulp-plumber");
var autoprefixer = require("autoprefixer");

var server = require("browser-sync").create();
var minify = require("gulp-csso");
var rename = require("gulp-rename");
var run = require("run-sequence");


gulp.task("less", function() {

  return gulp.src("less/style.less")
    .pipe(plumber())
    .pipe(less())
    .pipe(autoprefixer({
      browsers: [
      "last 3 versions",
      "> 2%",
      "ie >= 10"
      ], cascade: true
    }))
    .pipe(gulp.dest("css"));
});

gulp.task("style", function() {

  return gulp.src("css/style.css")
    .pipe(minify())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("css"))
    .pipe(server.stream());
});

gulp.task("serve", function() {
  server.init({
    server: ".",
    notify: false,
    open: true,
    ui: false
  });

  gulp.watch("*.html").on("change", server.reload);

  gulp.watch("less/**/*.less").on("change", function(fn) {
    run("less", "style", fn);
  });

});
