const gulp = require('gulp');
const through2 = require('through2');
const sass = require('gulp-sass');
const base64 = require('gulp-base64');
const clean = require('gulp-clean');
const ts = require('gulp-typescript');

function typescript () {
  return gulp.src(['src/**/*.ts', 'src/**/*.tsx', '!src/test.tsx'])
    .pipe(ts.createProject('tsconfig.json')())
    .pipe(through2.obj(function z (file, encoding, next) {
      this.push(file.clone());
      file.contents = Buffer.from(file.contents.toString().replace(/\.scss/g, '.css'));
      this.push(file);
      next()
    }))
    .pipe(gulp.dest('dist'))
}

function typescriptDeclare() {
  return gulp.src(['src/**/*.d.ts'])
    .pipe(gulp.dest('dist'))
}

function style () {
  return gulp.src('src/**/*.scss')
    .pipe(base64())
    .pipe(sass())
    .pipe(gulp.dest('dist'))
}

function cleanDist () {
  return gulp.src('dist', {read: false, allowEmpty: true})
    .pipe(clean())
}

exports.default = gulp.series(cleanDist, typescript, typescriptDeclare, style);
