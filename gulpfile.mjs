import gulp from 'gulp'
const { series, parallel, src, dest, watch } = gulp
import path from 'path'
import concat from 'gulp-concat'
import rename from 'gulp-rename'
import gh from 'gulp-gh-pages'
import notify from 'gulp-notify'
import del from 'del'
import connect from 'gulp-connect'

import imgmin from 'gulp-imagemin'

import gsass from 'gulp-sass'
import dsass from 'sass'
import uncss from 'postcss-uncss'
import cssnano from 'cssnano'
import pcss from 'gulp-postcss'

import htmlmin from 'gulp-htmlmin'

import uglify from 'gulp-uglify'

const sass = gsass(dsass)

const srcPath = './src'
const distPath = './dist'

const source = (loc) => {
    return path.join(srcPath, loc)
}

const destination = (loc) => {
    return path.join(distPath, loc)
}

const scssPath = source('./scss/**/*.{scss,css}')
const jsPath = source('./js/**/*.js')
const htmlPath = source('./**/*.html')
const imgPath = source('./assets/img/**/*.{png,gif,jpg,webp}')
// console.log(scssPath, jsPath, htmlPath, imgPath)


const htmlFiles = source('index.html')

export const clean = (cb) => {
    del('dist')
    return cb();
}

export const css = (cb) => {
    src(scssPath)
        .pipe(sass())
        .on('error', notify.onError(function (e) {
            return 'Sass Compilation Error: ' + e
        }))
        .pipe(concat('style.css'))
        .pipe(pcss([uncss({ html: htmlFiles })]))
        .pipe(dest(destination('./css')))
        .pipe(pcss([cssnano]))
        .pipe(rename({ suffix: '.min' }))
        .pipe(dest(destination('./css/')))
        .pipe(connect.reload())
    return cb()
}

export const js = (cb) => {
    src(jsPath)
        .pipe(concat('index.js'))
        .pipe(dest(destination('./js/')))
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(dest(destination('./js/')))
        .pipe(connect.reload())
    return cb()
}


export const html = (cb) => {
    src(htmlPath)
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(dest(distPath))
        .pipe(connect.reload())
    return cb()
}

export const image = (cb) => {
    src(imgPath)
        .pipe(imgmin())
        .pipe(dest(destination('./assets/img/')))
        .pipe(connect.reload())
    return cb()
}

export const build = series(html, parallel(js, css))
export default series(clean, build)
export const serve = () => {
    connect.server({
        root: distPath,
        livereload: true
    })
}

export const dev  = series(clean , build, parallel (serve ,() => {
        console.log("Watching: " , htmlFiles, imgPath, jsPath, scssPath)
        watch(htmlPath, series(html, css))
        watch(imgPath, image)
        watch(jsPath, js)
        watch(scssPath, css)
}))

export const deploy = series(clean, () =>
    src(path.join(distPath, './**/*'))
        .pipe(gh()))

