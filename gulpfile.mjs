import gulp from 'gulp'
const { series, parallel, src, dest, watch } = gulp
import path from 'path'
import concat from 'gulp-concat'
import rename from 'gulp-rename'
import liveReload from 'gulp-livereload'
import gh from 'gulp-gh-pages'
import notify from 'gulp-notify'

import imgmin from 'gulp-imagemin'

import gsass from 'gulp-sass'
import dsass from 'sass'
import uncss from 'uncss'
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

const scssPath = source('./scss/**/*.scss')
const jsPath = source('./js/**/*.js')
const htmlPath = source('./**/*.html')
const imgPath = source('./assets/img/**/*.{png,gif,jpg,webp}')


const htmlFiles = 'index.html'

export const clean = (cb) => {
    console.log('Clean')
    cb()
}

export const css = (cb) => {
    console.log(scssPath)
    src(scssPath)
        .pipe(sass())
        .on('error', notify.onError(function (e) {
            return 'Sass Compilation Error: ' + e
        }))
        .pipe(concat('style.css'))
        .pipe(pscss([uncss(htmlFiles)]))
        .pipe(dest(path.join(distPath, './css')))
        .pipe(pcss([cssnano]))
        .pipe(rename({ suffix: '.min' }))
        .pipe(dest(destination('./css/')))
        .pipe(liveReload())
    cb()
}

export const js = (cb) => {
    console.log(jsPath)
    src(jsPath)
        .pipe(concat('script.js'))
        .pipe(dest(path.join(distPath, './js')))
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(dest(destination('./js/')))
        .pipe(liveReload())
    cb()
}


export const html = (cb) => {
    console.log(htmlPath)
    src(htmlPath)
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(dest(distPath))
        .pipe(liveReload())
    cb()
}

export const image = (cb) => {
    console.log(imgPath)
    src(imgPath)
        .pipe(imgmin())
        .pipe(dest(destination('./assets/img/')))
        .pipe(liveReload())
    cb()
}

export const areyouthere = (cb) => {
    console.log("Yes I am here")
    cb()
}
export const build = () => parallel(js, css, html)
const all =  () => series(clean, build)
export default all
export const dev = () => series(all, (cb) => {
    liveReload.listen()
    watch([scssPath, htmlFiles], css)
    watch([jsPath], js)
    watch([htmlPath], html)
    watch([imgPath], image)
    cb()
})
export const deploy = () => series(clean, (cb) => {
    src(path.join(distPath, './**/*'))
        .pipe(gh())
    cb()
})