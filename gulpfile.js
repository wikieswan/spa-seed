var // shared plugins
    gulp = require('gulp'),
    cache = require('gulp-cache'),
    remember = require('gulp-remember'),
    changed = require('gulp-changed'),
    size = require('gulp-size'),
    del = require('del'),
    lazypipe = require('lazypipe'),
    gulpif = require('gulp-if'),
    sass = require('gulp-sass'),


    browsersync = require('browser-sync'),
    reload = browsersync.reload,
    wait = require('gulp-wait'),

    shell = require('gulp-shell'),
    debug = require('gulp-debug'),
// available colors: black red green yellow blue magenta cyan white gray
    gutil = require('gulp-util'),

// avoid node exit when error occurs
    plumber = require('gulp-plumber'),

// use for restarting gulp service when gulpfile updated
    argv = require('yargs').argv,
    cp = require('child_process'),

// for css
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),

// for javascript
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish'),
    uglify = require('gulp-uglify'),
    uglifyinline = require('gulp-uglify-inline'),
    concat = require('gulp-concat'),
    beautify = require('gulp-beautify'),
    rjs = require('gulp-requirejs'),

// for images
    imagemin = require('gulp-imagemin'),

// for html
    minifyhtml = require('gulp-minify-html'),
    usemin = require('gulp-usemin'),
    minifyCss = require('gulp-minify-css'),
    connect = require('gulp-connect'),
    rename = require('gulp-rename');

var path = {};
path.root="./";
path.app = path.root + 'front/';
path.build = 'build/';
path.scss  = path.app + 'scss/**/*.scss';
path.css   = path.app + 'css/';
path.js    = path.app + 'js/**/*.js';
path.images= path.app + 'images/**/*.*';
path.html  = path.app + '**/*.html';
path.copyFile = []

var lzLint = lazypipe()
    .pipe(jshint)
    .pipe(jshint.reporter, stylish);

// clean dist directory
gulp.task('clean', function (callback) {
    // use a callback to ensure the task finishes before exiting.
    return del([path.build + '*'], callback);
});

// copy base files from src to dist
gulp.task('copy', function () {
    return gulp.src(path.copyFile, {base: path.app })
        .pipe(gulp.dest(path.build));
});

//css sass
gulp.task('sass', function(done) {
    gulp.src(path.scss)
        .pipe(sass({
            errLogToConsole: true
        }))
        .pipe(gulp.dest(path.css))
        .pipe(minifyCss({
            keepSpecialComments: 0
        }))
        .on('end', done);
});
//css sass-build
gulp.task('sass-build', function(done) {
    gulp.src(path.scss)
        .pipe(sass({
            errLogToConsole: true
        }))
        .pipe(minifyCss({
            keepSpecialComments: 0
        }))
        .pipe(gulp.dest(path.build+'css'))
        .on('end', done);
});

// js scripts
gulp.task('js', function () {
    return gulp.src(path.js, { base: path.app })
        .pipe(plumber())
        .pipe(changed(path.build))
        .pipe(lzLint())
        .pipe(size())
        .pipe(reload({stream: true}));
});
// js scripts-build
gulp.task('js-build', function () {
    return gulp.src(path.js, { base: path.app })
        .pipe(plumber())
        .pipe(changed(path.build))
        .pipe(lzLint())
        .pipe(size())
        .pipe(uglify())
        .pipe(gulp.dest(path.build))
        .pipe(size())
        .pipe(reload({stream: true}));
});
//html-minify
gulp.task('html', function() {
    return gulp.src(path.html, { base: path.app })
        .pipe(minifyhtml({
            conditionals: true,
            spare:true
        }))
        .pipe(gulp.dest(path.build));
});
// compress images
gulp.task('images', function () {
    return gulp.src(path.images, { base: path.app })
        .pipe(size())
        .pipe(changed(path.build))
        .pipe(imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        }))
        .pipe(gulp.dest(path.build))
        .pipe(size())
        .pipe(reload({stream: true}));
});

//build
gulp.task('build', ['clean'], function () {
    return gulp.start(['js-build','sass-build','html','images'], function() {
        gutil.log( gutil.colors.green('All Done!') );
    });
});
//dev serve
gulp.task('connect', function() {
    connect.server({
        root: path.root + 'front/',
        port: 8000,
        livereload: true
    });
});
//build serve
gulp.task('connect-build',['build'], function() {
    connect.server({
        root: path.root + 'build',
        port: 8000,
        livereload: true
    });
});

gulp.task('reload',function() {
    gulp.src([path.html])
        .pipe(connect.reload());
});

gulp.task('watch', function () {
    gulp.watch([path.scss], ['sass']);
    gulp.watch([path.js], ['js']);
    gulp.watch([path.html,path.scss,path.js],['reload']);
});


gulp.task('default', ['watch','connect']);

