var gulp = require('gulp'),
fs = require('fs'),
sass = require('gulp-sass'),
babelify = require('babelify'),
browserify = require('browserify'),
batch = require('gulp-batch'),
webpack = require('webpack'),
watch = require('gulp-watch');

gulp.task("default", [ "build", "build:sass" ]);

// gulp.task("build", function() {
//   browserify('./src/react-main.js')
//   .transform(babelify)
//   .bundle()
//   .pipe(fs.createWriteStream('./dist/react-main.js'));
// });

// gulp.task("build", function() {
//   return gulp.src('./src/react-main.js')
//   .pipe(webpack(require('./webpack.config.js')))
//   .pipe(gulp.dest('dist/'));
// })

gulp.task("watch", function() {
  watch('./src/jsx/**/*.js',
  batch(function(events, done) {
    gulp.start('build', done);
  }));
  watch('./src/sass/**/*.sass',
  batch(function(events, done) {
    gulp.start('build:sass', done);
  }));
});

gulp.task("build:sass", function() {
  gulp.src('./src/sass/**/*.sass')
  .pipe(sass().on('Error', sass.logError))
  .pipe(gulp.dest('./dist/css'));
})
