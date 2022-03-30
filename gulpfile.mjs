import gulp from 'gulp'
const { series, parallel, src, dest, watch } = gulp
import path from 'path'
import concat from 'gulp-concat'
import rename from 'gulp-rename'
import gh from 'gulp-gh-pages'
import notify from 'gulp-notify'
import del  from 'del'

import imgmin from 'gulp-imagemin'
import browserSync from 'browser-sync'
const sync = browserSync.create()

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
        .pipe(dest(path.join(distPath, './css')))
        .pipe(pcss([cssnano]))
        .pipe(rename({ suffix: '.min' }))
        .pipe(dest(destination('./css/')))
        .pipe(sync.stream());
    return cb()
}

export const js = (cb) => {
    src(jsPath)
        .pipe(concat('script.js'))
        .pipe(dest(path.join(distPath, './js')))
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(dest(destination('./js/')))
        .pipe(sync.stream());
    return cb()
}


export const html = (cb) => {
    src(htmlPath)
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(dest(distPath))
        .pipe(sync.stream());
    return cb()
}

export const image = (cb) => {
    src(imgPath)
        .pipe(imgmin())
        .pipe(dest(destination('./assets/img/')))
        .pipe(sync.stream());
    return cb()
}

export const live = (cb) => {
    sync.init({
        server: {
            baseDir: "./dist/",
        }
    })
    return cb()
}

export const build = series(html, parallel(js, css))
const all = series(clean, build)
export default all
export const dev = series(all, browserSync,
    (cb) => {
        watch([htmlPath], html)
        watch([imgPath], image)
        watch([jsPath], js)
        watch([scssPath, htmlFiles], css)
        return cb()
    })

export const deploy = series(clean, () =>
    src(path.join(distPath, './**/*'))
        .pipe(gh()))

