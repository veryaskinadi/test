const gulp        = require('gulp');
const sass        = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
const rename = require("gulp-rename");
const imagemin = require('gulp-imagemin');
const htmlmin = require('gulp-htmlmin');
const cssImport = require('gulp-cssimport');

gulp.task('styles', function() {
    return gulp.src("src/scss/*.+(scss|sass)")
        .pipe(cssImport())
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(rename({suffix: '.min', prefix: ''}))
        .pipe(autoprefixer())
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest("src/css"))
        .pipe(gulp.dest("docs/css"));
});

gulp.task('watch', function() {
    gulp.watch("src/scss/*.+(scss|sass)", gulp.parallel('styles'));
});

gulp.task('default', gulp.parallel('styles','watch'));