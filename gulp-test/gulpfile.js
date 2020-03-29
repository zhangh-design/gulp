/**
 * @file gulp 打包配置文件
 * @author zhangh
 */
var gulp = require("gulp");
var { series } = require("gulp");
var less = require("gulp-less");
var concat = require("gulp-concat");
var cleanCss = require("gulp-clean-css");
var autoprefixer = require("gulp-autoprefixer");
var del = require("del");
var babel = require("gulp-babel");
var uglify = require("gulp-uglify");
var rename = require("gulp-rename");
var imagemin = require("gulp-imagemin");
var spriter = require("gulp-css-spriter");
var base64 = require("gulp-base64");
var browserSync = require("browser-sync").create();
var reload = browserSync.reload;
var changed = require("gulp-changed");
var rev = require("gulp-rev");
var revCollector = require("gulp-rev-collector"); // 配合 gulp-rev 来一起使用
var notify = require("gulp-notify");

// 开发环境和生产环境 输出路径配置
/* var build = {
  css: './build/css/',
  images: './build/images/',
  js: './build/js/'
};

var src = {
  css: './src/css/',
  images: './src/images/',
  js: './src/js/',
  less: './src/less/'
}; */

/*
基本任务调用 任务的顺序一定要定义在调用之前
gulp.task("task3", function(done) {
  console.log("我是task3");
  done();
});

gulp.task(
  "task2",
  series(["task3"], function(done) {
    console.log("我是task2");
    done();
  })
);

gulp.task(
  "task1",
  series(["task2"], function(done) {
    console.log("我是task1");
    done();
  })
);

// 默认任务 gulp
gulp.task(
  "default",
  series(["task1"], function(done) {
    console.log("我是default任务");
    done();
  })
);
 */

// src和dest 读取和写入操作（复制文件命令
// gulp.task("default", function(done) {
//   // src 读取文件到内存中，dest 输出到build文件夹
//   gulp.src("./src/**/*") // input 读取操作
//   .pipe(gulp.dest("./build/")) // pipe方法相当于下一步的意思，dest方法则是输出、写入操作output操作
//   done();
// });

/*
// watch 监控文件
gulp.task("watch-file", function(done) {
  // watch 监测 src 目录下的index.html文件的变动，通知task1任务和task2任务
  //   gulp.watch("./src/index.html", series(["task1", "task2"]));
  // 也可以不调用其它任务，直接触发一个回调函数
  //   gulp.watch("./src/index.html", function(event){
  //     console.log("发生文件变化了");
  //     console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
  //   });
  done();
});

gulp.task("task1", function(done) {
  console.log("index.html发生改变会调用task1任务");
  done();
});

gulp.task("task2", function(done) {
  console.log("index.html发生改变会调用task2任务");
  done();
});
 */

// less
/* gulp.task("less", function() {
  // 读取 src/less 目录下的所有 .less 结尾的文件
  return gulp
    .src("./src/less/*.less")
    .pipe(less())
    .pipe(gulp.dest("./src/css/"));
}); */

// css文件合并
/* gulp.task("concat", function() {
  // 合并 src/css 目录下的所有css文件
  return gulp
    .src("./src/css/*.css")
    .pipe(concat('all.css', {newLine: ';'})) // 传入一个选项配置，合并成 all.css 这个文件
    .pipe(gulp.dest('./src/css/')); //把 all.css 输出到src/css/目录
}); */

// css 压缩
/* gulp.task("clean-css", function() {
  // 合并 src/css 目录下的所有css文件
  return gulp
    .src("./src/css/*.css")
    .pipe(concat("all.css", { newLine: ";" })) // 传入一个选项配置，合并成 all.css 这个文件
    .pipe(cleanCss({compatibility: 'ie8'})) // 压缩css，可选参数压缩后的css同时兼容ie8
    .pipe(gulp.dest("./src/css/")); //把 all.css 输出到src/css/目录
});
 */

// css自动添加浏览器前缀
/* gulp.task("autoprefixer", function() {
  // 读取 src/less 目录下的所有 .less 结尾的文件
  return gulp
    .src("./src/less/*.less")
    .pipe(less())
    .pipe(autoprefixer()) // 自动添加浏览器前缀
    .pipe(gulp.dest("./src/css/"));
}); */

// 清空（删除）文件夹
/* gulp.task("del", function() {
  // 需要删除的文件列表
  return del(["./src/css/*.css", "./build/"]);
});
 */

// js转义
/* gulp.task("js", function() {
  // pipe的操作都是在内存中进行的，这样呢就会在项目构建的过程中性能非常高
  return gulp
    .src("./src/js/*.js") // 读取
    .pipe(babel()) // 转义
    .pipe(concat("all.js")) //合并
    .pipe(gulp.dest("./build/js/")) // 输出
    .pipe(uglify())
    .pipe(rename("./all.min.js")) // 这里一定要加上 ./ 表示 all.js 的相对路径
    .pipe(gulp.dest("./build/js/"));
});
 */

// 图片压缩
/* gulp.task("images", function() {
  return gulp
    .src("./src/images/*.*") // 读取src/images/目录下的所有文件
    .pipe(imagemin())
    .pipe(gulp.dest("./build/images/"));
});
 */

// 雪碧图（sprite image）/ 精灵图 生成
/* gulp.task("sprite-css", function() {
  return gulp
    .src("./src/less/*.less")
    .pipe(less())
    .pipe(concat("all.css"))
    .pipe(autoprefixer())
    .pipe(
      spriter({
        // 合并后的雪碧图输出路径
        spriteSheet: "./build/images/spritesheet.png",
        // 生成样式文件图片引用地址的路径
        // 如下将生产：backgound:url(../images/sprite20324232.png)
        pathToSpriteSheetFromCSS: "../images/spritesheet.png"
      })
    )
    .pipe(cleanCss({ compatibility: "ie8" }))
    .pipe(gulp.dest("./build/css/"));
});
 */

// base64
/* gulp.task("base64", function() {
  // 读取 src/less 目录下的所有 .less 结尾的文件
  return gulp
    .src("./src/less/lib.less")
    .pipe(less())
    .pipe(base64({ maxImageSize: 8 * 1024 })) // base64处理 小于等于8kb就处理成base64
    .pipe(gulp.dest("./build/css/"));
}); */

// 开发模式下静态服务器
/* gulp.task("dev:server", function() {
  browserSync.init({
    server: {
      baseDir: "./", // 根目录 gulp-test
      index: "./src/index.html" // 指定特定文件名为索引
    },
    port: 8080
  });
  gulp.watch("./src/*.{html, htm}", gulp.series(["reload"]));
  gulp.watch("./src/less/*.less", gulp.series(["less"]));
  gulp.watch("./src/css/*.css", gulp.series(["sprite-css"]));
  gulp.watch("./src/js/*.js", gulp.series(["js"]));
});

gulp.task("reload", function(done) {
  // 最后别忘了 调用 reload
  gulp
    .src("./src/*.{html, htm}")
    .pipe(changed("./build/", { extension: ".html" })) // 监测 build 目录并且目标文件的扩展名 .html
    .pipe(gulp.dest("./build/"))
    .pipe(reload({ stream: true }));
  done();
});

gulp.task("less", function() {
  // 读取 src/less 目录下的所有 .less 结尾的文件
  return gulp
    .src("./src/less/*.less")
    .pipe(less())
    .pipe(gulp.dest("./src/css/"));
});

gulp.task("sprite-css", function() {
  return gulp
    .src("./src/less/*.less")
    .pipe(less())
    .pipe(concat("all.css"))
    .pipe(autoprefixer())
    .pipe(
      spriter({
        // 合并后的雪碧图输出路径
        spriteSheet: "./build/images/spritesheet.png",
        // 生成样式文件图片引用地址的路径
        // 如下将生产：backgound:url(../images/sprite20324232.png)
        pathToSpriteSheetFromCSS: "../images/spritesheet.png"
      })
    )
    .pipe(cleanCss({ compatibility: "ie8" }))
    .pipe(gulp.dest("./build/css/"))
    .pipe(reload({ stream: true }));
});

gulp.task("js", function() {
  // pipe的操作都是在内存中进行的，这样呢就会在项目构建的过程中性能非常高
  return gulp
    .src("./src/js/*.js") // 读取
    .pipe(babel()) // 转义
    .pipe(concat("all.js")) //合并
    .pipe(gulp.dest("./build/js/")) // 输出
    .pipe(uglify())
    .pipe(rename("./all.min.js")) // 这里一定要加上 ./ 表示 all.js 的相对路径
    .pipe(gulp.dest("./build/js/"))
    .pipe(reload({ stream: true }));
});
 */

// 版本控制
// gulp.task("rev-css", function() {
//   return gulp
//     .src("./src/less/*.less")
//     .pipe(less())
//     .pipe(concat("all.css"))
//     .pipe(autoprefixer())
//     .pipe(
//       spriter({
//         // 合并后的雪碧图输出路径
//         spriteSheet: "./build/images/spritesheet.png",
//         // 生成样式文件图片引用地址的路径
//         // 如下将生产：backgound:url(../images/sprite20324232.png)
//         pathToSpriteSheetFromCSS: "../images/spritesheet.png"
//       })
//     )
//     .pipe(cleanCss({ compatibility: "ie8" }))
//     .pipe(rev()) // 发布新版本
//     .pipe(gulp.dest("./build/css/"))
//     .pipe(rev.manifest())
//     .pipe(gulp.dest("./rev/css/")); // 生成一个配置文件，写入到rev/css/目录
// });

// gulp.task("rev-collector", function(done) {
//   // 读取映射文件，去替换src目录下的所有.html文件
//   // 这里的src中接收的是一个数组，表示读取和替换，这是 gulp-rev-collector 的语法
//   gulp
//     .src(["./rev/**/*.json", "./src/*.html"])
//     .pipe(revCollector({}))
//     .pipe(gulp.dest("./src/"));
//   done();
// });

// 项目通知
/* gulp.task("dev:server", function() {
  browserSync.init({
    server: {
      baseDir: "./", // 根目录 gulp-test
      index: "./src/index.html" // 指定特定文件名为索引
    },
    port: 8080
  });
  gulp.watch("./src/*.{html, htm}", gulp.series(["reload"]));
});

gulp.task("reload", function(done) {
  // 最后别忘了 调用 reload
  gulp
    .src("./src/*.{html, htm}")
    .pipe(changed("./build/", { extension: ".html" })) // 监测 build 目录并且目标文件的扩展名 .html
    .pipe(gulp.dest("./build/"))
    .pipe(reload({ stream: true }))
    // .pipe(notify("已经做完了html的更新")); // 最简单就是 pipe一个notify
    .pipe(notify("Found file: <%= file.relative %>!")) // 哪个文件发生改变
  done();
});
 */