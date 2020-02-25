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

gulp.task('html', function() {
    return gulp.src("src/*.html")
        .pipe(htmlmin({collapseWhitespase: true }))
        .pipe(gulp.dest("docs/"));
});

gulp.task('scripts', function() {
    return gulp.src("src/js/*.js")
        .pipe(gulp.dest("docs/js"));
});

gulp.task('fonts', function() {
    return gulp.src("src/fonts/**/*")
        .pipe(gulp.dest("docs/fonts"));
});

gulp.task('images', function() {
    return gulp.src("src/img/*")
        .pipe(imagemin())
        .pipe(gulp.dest("docs/img"));
});

gulp.task('vendor', function() {
    return gulp.src("src/vendor/*")
        .pipe(gulp.dest("docs/vendor"));
});

gulp.task('default', gulp.parallel('styles','watch', 'html', 'scripts', 'fonts', 'images', 'vendor'));