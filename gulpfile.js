// Include section
var
    gulp = require('gulp'),

    autoprefixer = require('gulp-autoprefixer'),
    concat = require('gulp-concat'),
    connect = require('gulp-connect'),
    less = require('gulp-less')


gulp.task('html', function(){
    gulp.src('./**/*.html')
        .pipe(gulp.dest('../dev/'))
        .pipe(connect.reload());
});

gulp.task('less', function(){
    gulp.src('./assets/styles/*.less')
        .pipe(less())
        .on('error', console.log)
        .pipe(autoprefixer())
        .pipe(gulp.dest('../dev/assets/styles'))
        .pipe(connect.reload());
});

gulp.task('js', function(){
    gulp.src(['./assets/scripts/**/*.js'])
        .pipe(concat('script.js'))
        .pipe(gulp.dest('../dev/assets/scripts'))
        .pipe(connect.reload());
});

gulp.task('img', function(){
    gulp.src('./assets/images/**/*')
        .pipe(gulp.dest('../dev/assets/images'))
        .pipe(connect.reload());
});

gulp.task('vendors', function(){
    gulp.src('./assets/vendors/**/*')
        .pipe(gulp.dest('../dev/assets/vendors'))
        .pipe(connect.reload());
});


gulp.task('connect', function() {
    connect.server({
        root: '../dev',
        livereload: true
    });
});

gulp.task('watch', function() {
    gulp.watch('./**/*.html', ['html']);
    gulp.watch('./assets/styles/**/*.less', ['less']);
    gulp.watch('./assets/scripts/**/*.js', ['js']);
    gulp.watch('./assets/images/**/*', ['img']);
    gulp.watch('./assets/vendors/**/*', ['vendors']);
});


gulp.task('default', ['connect', 'html', 'less', 'js', 'img', 'vendors', 'watch']);