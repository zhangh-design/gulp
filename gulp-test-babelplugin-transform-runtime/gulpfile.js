/**
 * @file gulp 打包配置文件
 * @author zhangh
 */
var gulp = require("gulp");
var concat = require("gulp-concat");
var cleanCss = require("gulp-clean-css");
var clean = require("gulp-clean");
var less = require("gulp-less");
var autoprefixer = require("gulp-autoprefixer");
var del = require("del");
const { series } = require("gulp");
var babel = require("gulp-babel");
var uglify = require("gulp-uglify");
var rename = require("gulp-rename");
var imagemin = require("gulp-imagemin");
var imageCache = require("gulp-cache");
var spriter = require("gulp-css-spriter");
var base64 = require("gulp-base64");
var browserSync = require("browser-sync").create();
var reload = browserSync.reload;

// 静态服务器
gulp.task("dev:server", function() {
  browserSync.init({
    server: {
      baseDir: "./", // 根目录 gulp-fast-element-ui
      index: "./examples/index.html"
    },
    port: 8084
  });
  gulp.watch("./examples/index.html", gulp.series(["reload"]));
});

gulp.task("reload", function() {
  return gulp.src("./examples/index.html").pipe(reload({ stream: true }));
});

//删除dist打包目录
gulp.task("task:del-dist", function(cb) {
  return del(["./dist/*"], cb);
});

// 清空dist打包目录
gulp.task("task:clean-dist", function(cb) {
  return gulp.src(["./dist/*"]).pipe(clean());
});

// 图片压缩
gulp.task("task:images", function() {
  return gulp
    .src("./static/images/*.*")
    .pipe(imageCache(imagemin()))
    .pipe(gulp.dest("./dist/images"));
});

// 图片base64处理
gulp.task("task:base64", function() {
  return gulp
    .src("./dist/theme-default/*.css")
    .pipe(base64({ maxImageSize: 8 * 1024 }))
    .pipe(gulp.dest("./dist/theme-default"));
});

// 处理css （编译less、添加css前缀、压缩css、雪碧图）
gulp.task("task:css", function() {
  return gulp
    .src("./packages/theme-default/*.less")
    .pipe(less())
    .pipe(autoprefixer())
    .pipe(
      spriter({
        // 合并后的雪碧图输出路径
        spriteSheet: "./dist/images/spritesheet.png",
        // 生成样式文件图片引用地址的路径
        // 如下将生产：backgound:url(../images/sprite20324232.png)
        pathToSpriteSheetFromCSS: "../images/spritesheet.png"
      })
    )
    .pipe(cleanCss({ compatibility: "ie8" }))
    .pipe(gulp.dest("./dist/theme-default"));
});

// 处理js
gulp.task("task:js", function() {
  return gulp
    .src("./packages/fast.js")
    .pipe(babel())
    .pipe(concat("all.js"))
    .pipe(uglify())
    .pipe(rename("./all.min.js")) // 注意：这里的路径一定要是相对路径，相对于 all.js 的路径
    .pipe(gulp.dest("dist"));
});

/**
 * @desc 默认task
 * 入口task，会依次调用各个task自动执行构建
 */
gulp.task(
  "default",
  series(["task:clean-dist", "task:images", "task:css", "task:js"], function(
    done
  ) {
    console.log("all done");
    done();
  })
);

/* function defaultTask(cb) {
  // place code for your default task here
  cb();
}

exports.default = defaultTask */
