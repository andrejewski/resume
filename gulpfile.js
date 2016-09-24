const path = require('path');
const gulp = require('gulp');
const del = require('del');
const pug = require('gulp-pug');
const postcss = require('gulp-postcss');
const less = require('gulp-less');
const cssnano = require('cssnano');
const autoprefixer = require('autoprefixer');
const reporter = require('postcss-reporter');
const runSequence = require('run-sequence');
const sourcemaps = require('gulp-sourcemaps');

const assetDest = path.join(__dirname, 'docs');
const processors = [
  autoprefixer({browsers: ['last 2 versions']}),
  reporter({clearMessages: true})
];

gulp.task('default', ['build']);
gulp.task('watch', ['build'], () => {
  gulp.watch('src/**/*', ['build']);
});

gulp.task('build', ['clean'], done => {
  runSequence(['pages', 'stylesheets', 'static'], done);
});

gulp.task('clean', () => {
  return del(['docs'], {force: true});
});

gulp.task('pages', () => {
  return gulp
    .src('src/pages/**/*.pug', {base: 'src/pages'})
    .pipe(pug())
    .pipe(gulp.dest(assetDest));
});

gulp.task('stylesheets', () => {
  return gulp
    .src('src/stylesheets/**/*.less', {base: 'src'})
    .pipe(sourcemaps.init())
    .pipe(less().on('error', function(error) {
      gutil.log(error);
      this.emit('end');
    }))
    .pipe(postcss(processors))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(assetDest));
});

gulp.task('static', () => {
  return gulp
    .src('src/static/**/*', {base: 'src/static'})
    .pipe(gulp.dest(assetDest));
});
