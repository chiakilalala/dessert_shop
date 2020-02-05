var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var browserSync = require('browser-sync');
var autoprefixer = require('autoprefixer');


// 合併多支 js 檔案
gulp.task('vendorJs', function() {
    return gulp.src([
            './node_modules/jquery/dist/jquery.slim.min.js',
            './node_modules/bootstrap/dist/js/bootstrap.bundle.min.js',
            './source/javascripts/all.js'
        ])
        .pipe($.concat('vendor.js'))
        .pipe(gulp.dest('./public/javascripts'))
})

// 編譯 sass scss 檔案
gulp.task('sass', function() {
    // PostCSS AutoPrefixer
    var processors = [
        autoprefixer({
            browsers: ['last 5 version'],
        })
    ];

    return gulp.src(['./source/stylesheets/**/*.sass', './source/stylesheets/**/*.scss'])
        .pipe($.plumber())
        .pipe($.sourcemaps.init())
        .pipe($.sass({
                outputStyle: 'nested',
                includePaths: ['./node_modules/bootstrap/scss']
            })
            .on('error', $.sass.logError))
        .pipe($.postcss(processors))
        // .pipe($.if(options.env === 'production', $.minifyCss())) // 假設開發環境則壓縮 CSS
        .pipe($.sourcemaps.write('.'))
        .pipe(gulp.dest('./public/stylesheets'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

//複製檔案到 public 資料夾
gulp.task('copy', function() {
    gulp.src(['./source/**/**', '!source/stylesheets/**/**'])
        .pipe(gulp.dest('./public/'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

// 瀏覽器同步檢視
gulp.task('browserSync', function() {
    browserSync.init({
        server: { baseDir: './public' },
        reloadDebounce: 2000
    })
});

// 監看變動
gulp.task('watch', function() {
    gulp.watch(['./source/stylesheets/**/*.sass', './source/stylesheets/**/*.scss'], ['sass']); // 監看 scss 有更動，就呼叫 sass。
    gulp.watch(['./source/javascripts/*.js'], ['vendorJs']); //監看javascript變動
    gulp.watch(['./source/**/**', '!/source/stylesheets/**/**'], ['copy']); //監看 source 資料夾，有更新就複製到 public資料夾
});


gulp.task('default', ['copy', 'sass', 'vendorJs', 'browserSync', 'watch']);