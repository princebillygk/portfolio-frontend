import gulp from 'gulp'
const { series, src, dest} = gulp
import path from 'path'
import concat from 'gulp-concat'
import rename from 'gulp-rename'
import notify from 'gulp-notify'
import del from 'del'

import 'dotenv/config'

import imgmin from 'gulp-imagemin'

import gsass from 'gulp-sass'
import dsass from 'sass'
import purify from 'gulp-purifycss'
import cssnano from 'cssnano'
import pcss from 'gulp-postcss'

import htmlmin from 'gulp-htmlmin'


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
const vendorPath = source('./vendor/**/*')
const jsPath = source('./js/**/*.js')
const htmlPath = source('./**/*.html')
const imgPath = source('./assets/img/**/*.{png,gif,jpg,webp,ico}')


const htmlFiles = source('index.html');
const destHtmlFiles = destination('index.html')

export const clean = (cb) => {
    del('dist')
    return cb();
}

export const vendor = (cb) => {
    src(vendorPath)
        .pipe(dest(destination('./vendor/')))
    return cb()
}

export const css = (cb) => {
    src(scssPath)
        .pipe(sass())
        .on('error', notify.onError(function (e) {
            return 'Sass Compilation Error: ' + e
        }))
        .pipe(concat('style.css'))
        .pipe(purify([htmlPath,jsPath]))
        .pipe(dest(destination('./css')))
        .pipe(pcss([cssnano]))
        .pipe(rename({ suffix: '.min' }))
        .pipe(dest(destination('./css/')))
    return cb()
}

export const js = (cb) => {
    src(jsPath)
        .pipe(concat('index.js'))
        .pipe(dest(destination('./js/')))
        // .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(dest(destination('./js/')))
    return cb()
}


export const html = (cb) => {
    src(htmlPath)
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(dest(distPath))
        .pipe(rename({ extname: '.tmpl' }))
    return cb()
}

export const image = (cb) => {
    src(imgPath)
        .pipe(imgmin())
        .pipe(dest(destination('./assets/img/')))
    return cb()
}

export const build = series(js, image, html, vendor,  css)
export default build
