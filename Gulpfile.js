/**
 * Imports
*/
const gulp = require('gulp');
const runSequence = require('run-sequence');
const del = require('del');
const rename = require('gulp-rename');
const plumber = require('gulp-plumber');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const cssnano = require('gulp-cssnano');
const strip = require('gulp-strip-comments');
const fs = require("fs");
const inject = require('gulp-inject-string');

/**
 *  Delete dist folder content
*/
gulp.task('del:dist', function () {
    return del([
      'dist'
    ]);
  });

/***
 * Create /dist folder
 * */ 
gulp.task('create-dist', function () {
    return gulp.src('*.*', {read: false})
        .pipe(gulp.dest('./dist'))
        .pipe(gulp.dest('./dist/fonts'));
});

/**
 * Copy main.css to /dist
*/
gulp.task('init-css', function () {
    return gulp.src('./src/css/main.scss')
        .pipe(sass())
        .pipe(gulp.dest('./dist'));
});


/**
 * Copy fonts to /dist/fonts
*/
gulp.task('fonts', function () {
    return gulp.src('./src/css/fonts/**/*')
        .pipe(gulp.dest('./dist/fonts'));
});

/**
 * Copy images to /dist/img
*/
gulp.task('images', function () {
    return gulp.src('./src/images/**/*')
        .pipe(rename({ dirname: '' }))
        .pipe(gulp.dest('./dist/img'));
});

// SASS compilation
gulp.task('sass', function () {
    return gulp.src([
            './src/css/main.scss',
            './src/css/custom.scss'
        ])
        .pipe(plumber())
        .pipe(sass())
        .pipe(cssnano())
        .pipe(concat('main.css'))
        .pipe(gulp.dest('./dist'));
});

/** HTML FILE GENERATION
 * inject css into amp-custom
 * write file to /dist
 **/
gulp.task('html', function () {
    var cssContent = fs.readFileSync("./dist/main.css", "utf8");
    return gulp.src("./src/html/*.html")
        .pipe(inject.after('style amp-custom>', cssContent))
        .pipe(gulp.dest("./dist"))
        .pipe(reload({
            stream: true
        }));
});

// BrowserSync
var browser = require('browser-sync');
var reload = browser.reload;
gulp.task('serve', function () {
    browser({
        port: 3000,
        open: false,
        ghostMode: false,
        server: {
            baseDir: './dist'
        }
    });
});

// Watch task
gulp.task('watch', function () {
    gulp.watch("./src/css/**", ['sass','html']);
    gulp.watch("./src/html/**", ['html']);
});

gulp.task('clean-html', function () {
    return gulp.src('dist/index.html')
      .pipe(strip())
      .pipe(gulp.dest('dist'));
});


/**
 * Serve local development
 */
gulp.task('dev', function(callback) {
    runSequence(
        'del:dist', 
        'create-dist', 
        'init-css', 
        'fonts', 
        'sass', 
        'images', 
        'html', 
        'watch', 
        'serve',
        callback);
});

/**
 * Build for deployment
 */
gulp.task('build', function(callback) {
    runSequence(
        'del:dist', 
        'create-dist', 
        'init-css', 
        'fonts', 
        'sass', 
        'images', 
        'html', 
        'clean-html',
        callback);
});