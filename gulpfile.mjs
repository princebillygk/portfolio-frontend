import gulp from 'gulp'
const { series, parallel, src, dest, watch } = gulp
import path from 'path'
import concat from 'gulp-concat'
import rename from 'gulp-rename'
import gh from 'gulp-gh-pages'
import notify from 'gulp-notify'
import del from 'del'
import connect from 'gulp-connect'

import ftp from 'vinyl-ftp'
import gutil from 'gulp-util'
import debug from 'gulp-debug'
import 'dotenv/config'

import imgmin from 'gulp-imagemin'

import gsass from 'gulp-sass'
import dsass from 'sass'
import purify from 'gulp-purifycss'
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
const vendorPath = source('./vendor/**/*')
const jsPath = source('./js/**/*.js')
const htmlPath = source('./**/*.html')
const imgPath = source('./assets/img/**/*.{png,gif,jpg,webp,ico}')
// console.log(scssPath, jsPath, htmlPath, imgPath)


const htmlFiles = source('index.html');
const destHtmlFiles = destination('index.html')

export const clean = (cb) => {
    del('dist')
    return cb();
}

export const vendor = (cb) => {
    src(vendorPath)
        .pipe(dest(destination('./vendor/')))
        .pipe(connect.reload())
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
        .pipe(connect.reload())
    return cb()
}

export const js = (cb) => {
    src(jsPath)
        .pipe(concat('index.js'))
        .pipe(dest(destination('./js/')))
        // .pipe(uglify())
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

export const build = series(js, image, html, vendor,  css)
export default build
export const serve = () => {
    connect.server({
        root: distPath,
        livereload: true
    })
}

export const dev  = series(build, parallel (serve ,() => {
        console.log("Watching: " , htmlFiles, vendorPath, imgPath, jsPath, scssPath)
        watch(htmlPath, series(html, css))
        watch(vendorPath, series(html, vendor))
        watch(imgPath, image)
        watch(jsPath, js)
        watch(scssPath, css)
}))

export const ghpages = (cb) =>{
    src(destination("./**/*"))
        .pipe(debug())
        .pipe(gh())
        .pipe(debug())
    cb()
}

// Uploads website to shared hosting
export const host = (cb) => {
    const conn = ftp.create({
        host:     process.env.FTP_HOST,
        user:     process.env.FTP_USR,
        password: process.env.FTP_PASS,
        parallel: 10,
        log:      gutil.log
    })
 
    conn.rmdir("./cv/", cb)

    src(".publish/**/*",  {buffer: false })
    .pipe(debug())
    .pipe(conn.dest("./cv/"))
    .pipe(debug())
    cb()
}


