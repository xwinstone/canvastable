const gulp = require('gulp')
const babel = require('gulp-babel')
const through2 = require('through2')
const sass = require('gulp-sass')
const base64 = require('gulp-base64')
const ts = require('gulp-typescript')
const path = require('path')
const merge2 = require('merge2')
const del = require('del')
const fs = require('fs')

const tsDefaultReporter = ts.reporter.defaultReporter()
const cwd = process.cwd()
const distDir = path.join(cwd, './dist')
const babelrc = fs.readFileSync('./.babelrc', 'utf-8')
const babelConfig = JSON.parse(babelrc)

// const tsConfig = require(path.join(cwd,'./tsconfig.json'))
const { series } = gulp

function babelify (js) {
  console.log('compiling js...')
  return js
    .pipe(babel(babelConfig))
    .pipe(through2.obj(function z (file, encoding, next) {
      this.push(file.clone())
      file.contents = Buffer.from(file.contents.toString().replace(/\.scss/g, '.css'))
      this.push(file)
      next()
    }))
    .pipe(gulp.dest(distDir))
}

function compileScss () {
  console.log('compiling css...')
  return gulp
    .src(['src/**/*.scss'])
    .pipe(base64())
    .pipe(sass())
    .pipe(gulp.dest(distDir))
}
function compile () {
  // assets
  const assets = gulp
    .src(['src/**/*.@(png|svg|jpg|ico)'])
    .pipe(gulp.dest(distDir))

  // typescript
  const tsSource = [
    'src/**/*.{ts,tsx}',
    '!src/test/*.{ts,tsx}',
    'typings/**/*.d.ts'
  ]
  const jsSource = [
    'src/**/*.{js,jsx}'
  ]
  const css = compileScss()
  let error = 0
  // allow jsx file in components/xxx/
  // if (tsConfig.compilerOptions.allowJs) {
  //   source.unshift('src/**/*.{js,jsx}')
  // }
  console.log('compiling ts...')
  const tsProject = ts.createProject(path.join(cwd, './tsconfig.json'))
  const tsResult = gulp.src(tsSource)
    .pipe(tsProject({
      error (e) {
        tsDefaultReporter.error(e)
        error = 1
      },
      finish: tsDefaultReporter.finish
    }))

  function check () {
    if (error) {
      process.exit(1)
    } else {
      console.log('Compiled!')
    }
  }

  tsResult.on('finish', check)
  tsResult.on('end', check)
  const jsFilesStream = babelify(merge2([tsResult.js, gulp.src(jsSource)]))
  const tsd = tsResult.dts.pipe(gulp.dest(distDir))
  return merge2([css, jsFilesStream, tsd, assets])
}

function cleanDist () {
  return del([
    'dist/**/*'
  ])
}

exports.default = series(
  cleanDist,
  compile
)

// gulp.task('compile', done => {
//   console.log('Compile to js...')
//   compile().on('finish', done)
// })
