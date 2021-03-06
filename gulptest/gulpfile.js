const gulp = require('gulp'),
    uglify = require("gulp-uglify"),//压缩js
    babel = require("gulp-babel"),//es6转5
    merge = require("merge-stream"),
    es2015Preset = require("babel-preset-es2015"),//es6转5
    cssUglify = require('gulp-minify-css'),//压缩css
    concat = require('gulp-concat'),   //合并文件
    rename = require('gulp-rename'),   //文件重命名
    jshint = require('gulp-jshint'),   //js检查
    notify = require('gulp-notify'),   //提示
    imageMin = require('gulp-imagemin'),//图片压缩
    htmlmin = require('gulp-htmlmin'),//html压缩
    gulpRemoveHtml = require('gulp-remove-html'), //标签清除，参考：https://www.npmjs.com/package/gulp-remove-html
    removeEmptyLines = require('gulp-remove-empty-lines'), //清除空白行，参考：https://www.npmjs.com/package/gulp-remove-empty-lines
    gutil=require('gulp-util');

gulp.task('default', async () => {//默认执行
    gulp.start('js');
});


gulp.task("js", async () => {//这是压缩但不合并  多个文件夹的js同时压缩
    var js = gulp.src("js/*.js")
    // .pipe(jshint())//js语法检测
    // .pipe(jshint.reporter('default'))
        .pipe(babel({presets: [es2015Preset]}))
        .pipe(uglify(
            {
                mangle: true,//类型：Boolean 默认：true 是否修改变量名
                compress: true,//类型：Boolean 默认：true 是否完全压缩
                // preserveComments: 'false' //保留所有注释
            }
        ))
        .on('error', function(err) {
            gutil.log(gutil.colors.red('[Error]'), err.toString());
        })
        .pipe(gulp.dest("dist"))
        .pipe(notify({message: "js task ok"}));
    var lib = gulp.src("js/lib/*.js")
    // .pipe(jshint())
    // .pipe(jshint.reporter('default'))
        .pipe(babel({presets: [es2015Preset]}))
        .pipe(uglify(
            {
                mangle: true,//类型：Boolean 默认：true 是否修改变量名
                compress: true,//类型：Boolean 默认：true 是否完全压缩
                // preserveComments: 'false' //保留所有注释
            }
        ))
        .on('error', function(err) {
            gutil.log(gutil.colors.red('[Error]'), err.toString());
        })
        .pipe(gulp.dest("dist/lib"))
        .pipe(notify({message: "lib task ok"}));
    return merge(js, lib)
});

gulp.task('css', async () => {
    return gulp.src('css/*.css')      //设置css
    // .pipe(concat('order_query.css'))      //合并css文件到"order_query"
    //     .pipe(gulp.dest('dist/css'))           //设置输出路径
    // .pipe(rename({suffix: '.min'}))         //修改文件名
        .pipe(cssUglify())                    //压缩文件
        .pipe(gulp.dest('dist'))            //输出文件目录
        .pipe(notify({message: 'css task ok'}));   //提示成功
});


// gulp.task('js', async () => {
//     return gulp.src('public/assets/js/*.js')  //选择合并的JS
//         .pipe(concat('order_query.js'))   //合并js
//         .pipe(gulp.dest('dist/js'))         //输出
//         .pipe(rename({suffix: '.min'}))     //重命名
//         .pipe(babel({presets: [es2015Preset]}))
//         .pipe(uglify())                    //压缩
//         .pipe(gulp.dest('dist/assets/js'))            //输出
//         .pipe(notify({message: "js task ok"}));    //提示
// });


gulp.task('css', async () => {
    return gulp.src('public/assets/css/*.css')      //设置css
    // .pipe(concat('order_query.css'))      //合并css文件到"order_query"
        .pipe(gulp.dest('dist/css'))           //设置输出路径
        // .pipe(rename({suffix: '.min'}))         //修改文件名
        .pipe(cssUglify())                    //压缩文件
        .pipe(gulp.dest('dist/assets/css'))            //输出文件目录
        .pipe(notify({message: 'css task ok'}));   //提示成功
});


gulp.task('image', async () => {//压缩图片
    gulp.src('public/images/*.*')
        .pipe(imageMin({progressive: true}))
        .pipe(gulp.dest('dist/images'))
});


gulp.task('html', function () {//压缩html
    var options = {
        removeComments: true,//清除HTML注释
        collapseWhitespace: true,//压缩HTML
        collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
        minifyJS: true,//压缩页面JS
        minifyCSS: true//压缩页面CSS
    };
    gulp.src('*.html')
        .pipe(gulpRemoveHtml())//清除特定标签
        .pipe(removeEmptyLines({removeComments: true}))//清除空白行
        .pipe(htmlmin(options))
        .pipe(gulp.dest('dist/html'))
        .pipe(notify({message: 'html task ok'}));   //提示成功
});



