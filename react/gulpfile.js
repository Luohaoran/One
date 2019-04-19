// 获取 gulp
var gulp = require('gulp');
// 获取 uglify 模块（用于压缩 JS）
var uglify = require('gulp-uglify');
// 压缩 js 文件
// 在命令行使用 gulp script 启动此任务
gulp.task('js', function() {
    // 1. 找到文件
    return gulp.src('js/*.js')
    // 2. 压缩文件
        .pipe(babel({
            presets: ['es2015'] // es5检查机制
        }))
        .on('error', function(err) {
            gutil.log(gutil.colors.red('[Error]'), err.toString());
        })
        .pipe(uglify())
        // 3. 另存压缩后的文件
        .pipe(gulp.dest('dist/js'));
});
