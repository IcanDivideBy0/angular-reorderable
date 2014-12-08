'use strict';

var gulp = require('gulp');

/**
 * Bump version
 */

gulp.task('bump:major', function(){
  gulp.src(['./package.json', './bower.json'])
  .pipe(require('gulp-bump')({type:'major'}))
  .pipe(gulp.dest('./'));
});

gulp.task('bump:minor', function(){
  gulp.src(['./package.json', './bower.json'])
  .pipe(require('gulp-bump')({type:'minor'}))
  .pipe(gulp.dest('./'));
});

gulp.task('bump:patch', function(){
  gulp.src(['./package.json', './bower.json'])
  .pipe(require('gulp-bump')({type:'patch'}))
  .pipe(gulp.dest('./'));
});

/**
 * Run tests.
 */

gulp.task('test', function () {
  return gulp.src([
    'bower_components/jquery/dist/jquery.js',
    'bower_components/lodash/dist/lodash.js',
    'bower_components/angular/angular.js',
    'bower_components/angular-mocks/angular-mocks.js',
    'src/**/*.js',
    'test/**/*.js'
  ])
  .pipe(require('gulp-karma')({
    configFile: 'karma.conf.js',
    action: 'run'
  }))
  .on('error', function(err) {
    // Make sure failed tests cause gulp to exit non-zero
    throw err;
  });
});

gulp.task('test:watch', function () {
  gulp.src([
    'bower_components/jquery/dist/jquery.js',
    'bower_components/lodash/dist/lodash.js',
    'bower_components/angular/angular.js',
    'bower_components/angular-mocks/angular-mocks.js',
    'src/**/*.js',
    'test/**/*.js'
  ])
  .pipe(require('gulp-karma')({
    configFile: 'karma.conf.js',
    action: 'watch'
  }));
});

/**
 * Lint JS files.
 */

gulp.task('lint', function() {
  var jshint = require('gulp-jshint');

  return gulp.src([
    './gulpfile.js',
    './src/**/*.js',
    './test/**/*.js'
  ])
  .pipe(jshint())
  .pipe(jshint.reporter('jshint-stylish'))
  .pipe(jshint.reporter('fail'));
});
