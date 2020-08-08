const gulp = require("gulp");
const $ = require('gulp-load-plugins')();
const jade = require('gulp-jade');
const sass = require('gulp-sass');
const plumber = require('gulp-plumber');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const mainBowerFiles = require('main-bower-files');

gulp.task('copyhtml', function(){
    return gulp.src('./source/**/*.html')
        .pipe(gulp.dest('./public/'))
});

gulp.task('jade', function() {
    // var YOUR_LOCALS = {};
   
    gulp.src('./source/*.jade')
      .pipe(plumber())
      .pipe($.data(function(){
        let mrtData = require('./source/data/stations.json');
        let menu = require('./source/data/list.json');
        let source = {
          'mrtData': mrtData,
          'menu': menu
        }
        return source;
      }))
      .pipe(jade({
        pretty: true
      }))
      .pipe(gulp.dest('./public/'))
  });

  gulp.task('sass', function () {
    return gulp.src('./source/scss/**/*.scss')
      .pipe(plumber())
      .pipe(sourcemaps.init())
      .pipe(sass().on('error', sass.logError))
      // 編譯完成 CSS
      .pipe(postcss([ autoprefixer() ]))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest('./public/css'));
  });
  
  gulp.task('babel', () =>
    gulp.src('./source/js/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(concat('all.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./public/js'))
  );

  gulp.task('bower', function() {
    return gulp.src(mainBowerFiles())
        .pipe(gulp.dest('./.tmp/vendors'))
  });

  gulp.task('vendorJs', ['bower'], function(){
    return gulp.src('./.tmp/vendors/**/*.js')
      .pipe(concat('vendors.js'))
      .pipe(gulp.dest('./public/js'))
  });

  gulp.task('watch', function () {
    gulp.watch('./source/scss/**/*.scss', ['sass']);
    gulp.watch('./source/**/*.jade', ['jade']);
    gulp.watch('./source/**/*.js', ['babel']);
  });

  gulp.task('default', ['jade', 'sass', 'babel', 'vendorJs' ,'watch']);
