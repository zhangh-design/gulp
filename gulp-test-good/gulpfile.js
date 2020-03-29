/**
 * @file gulp 打包配置文件
 * @author zhangh
 */
var gulp = require("gulp"); // gulp原生插件
var { series } = require("gulp");
var less = require("gulp-less"); //编译less
var concat = require("gulp-concat"); //合并文件（css、js）
var cleanCss = require("gulp-clean-css"); //压缩css
var autoprefixer = require("gulp-autoprefixer"); //自动添加浏览器前缀
var del = require("del"); //删除文件
var babel = require("gulp-babel"); //编译es6->es5
var uglify = require("gulp-uglify"); //压缩js
var rename = require("gulp-rename"); //重命名
var imagemin = require("gulp-imagemin"); //图片压缩
var spriter = require("gulp-css-spriter"); //精灵图
var base64 = require("gulp-base64"); //base64图片
var browserSync = require("browser-sync").create(); //服务器同步
var reload = browserSync.reload;
var changed = require("gulp-changed"); //文件修改过滤
var rev = require("gulp-rev"); //版本控制
var revCollector = require("gulp-rev-collector"); // 配合 gulp-rev 来一起使用
var notify = require("gulp-notify"); //Gulp项目通知
var runSequence = require("run-sequence"); //任务Task流程控制 task任务的先后顺序

// 生产环境目录配置
var build = {
  basePath: "./build/",
  css: "./build/css/",
  images: "./build/images/",
  js: "./build/js/"
};

// 开发环境目录配置
var src = {
  basePath: "./src/",
  css: "./src/css/",
  images: "./src/images/",
  js: "./src/js/",
  less: "./src/less/"
};

/**
 * 大家注意：
 * 我之前反复强调过说生产环境最好一定是要和开发环境分隔开，那么也就是说开发环境下所有的中间文件呢都要输出到开发环境下，
 * 而不能直接跨域到生产环境下，所以说这个大家注意就是说：我现在编译开发环境下less文件我输出的时候也要输出到开发环境下。
 * 那么什么时候我在从开发环境下把所有有用的文件部署到生产环境下呢？
 * 那当然是在我启动生产环境的服务器的时候才会做，但是在这个之前呢在启动生产环境服务器之前呢所有的操作都要在开发环境下去做，
 * 以便达到开发和生产之间可以完全分离的一个操作。
 */

/************ 开发模式 **************/

// 开发模式下静态服务器
gulp.task("server:dev", function(done) {
  // 初始化browserSync服务器
  browserSync.init({
    server: {
      baseDir: src.basePath,
      index: "index.html" // 指定特定文件名为索引
    },
    port: 8080
  });
  // 监控文件变化
  gulp.watch("src/*.{html, htm}", ["html:dev"]);
  gulp.watch("src/less/*.less", ["less"]);
  gulp.watch("src/css/*.css", ["css:dev"]);
  gulp.watch("src/js/*.js", ["js:dev"]);

  // 先编译 less 任务，然后在并行编译 css:dev和js:dev 这两个任务
  // npm install --save-dev gulp@3.9.1 （想使用 runSequence 请将gulp版本回退到 3.9.1）
  runSequence("less", ["css:dev", "js:dev"]);
  done();
});

gulp.task("html:dev", function(done) {
  gulp
    .src(["./src/*.{html, htm}"])
    .pipe(changed("./src/", { extension: ".html" }))
    .pipe(gulp.dest("./src/"))
    .pipe(reload({ stream: true }));
  done();
});

gulp.task("less", function(done) {
  gulp
    .src(src.less + "*.less")
    .pipe(less()) // 编译开发环境下的less
    .pipe(gulp.dest(src.css)) //输出开发环境下的css
    .pipe(reload({ stream: true }));
  done();
});

gulp.task("css:dev", function(done) {
  gulp
    .src([
      src.css + "*.css",
      "!" + src.css + "all.min.css",
      "!" + src.css + "all.css"
    ])
    .pipe(concat("all.css"))
    .pipe(
      // 精灵图替换
      spriter({
        // 合并后的雪碧图输出路径
        spriteSheet: src.images + "spritesheet.png",
        // 生成样式文件图片引用地址的路径
        // 如下将生产：backgound:url(../images/sprite20324232.png)
        pathToSpriteSheetFromCSS: "../images/spritesheet.png"
      })
    )
    .pipe(gulp.dest(src.css)) // 输出一个未压缩版
    .pipe(cleanCss())
    .pipe(rename("./all.min.css")) // 这里的路径要注意 ./相对于未压缩版的路径
    .pipe(gulp.dest(src.css)) // 输出一个压缩版本
    .pipe(reload({ stream: true }));
  done();
});

gulp.task("js:dev", function(done) {
  gulp
    .src([src.js + "*.js", !+src.js + "all.js", !+src.js + "all.min.js"])
    .pipe(babel())
    .pipe(concat("all.js"))
    .pipe(gulp.dest(src.js)) // 输出一个未压缩版
    .pipe(uglify())
    .pipe(rename("all.min.js"))
    .pipe(gulp.dest(src.js)) // 输出一个压缩版
    .pipe(reload({ stream: true }));
  done();
});

/************ 生产模式 **************/

// 生产模式下的服务器
gulp.task("server:prod", function(done) {
  // 控制我们各项任务的流程
  // 它里面可以接受很多参数，那么在一个中括号之内的这样的一个任务呢，它是并行的异步操作
  // 那么在中括号和中括号之间呢是一个同步的操作，那么所谓同步的操作呢就是说必须前面一个完成之后才能执行它
  // 那么这个 runSequence 呢主要是引入我们叫一个`run-sequence`这样的一个插件。
  // 然后使用起来呢也非常的简单，比如说：你在这个生产模式下的服务器的时候呢你希望先并行处理
  // ["imagesmin", "publish:html", "publish:css", "publish:js"] 这么一大推操作，然后处理这么一大推操作完事了之后，
  // 最后在处理文件版本路径替换的操作`rev`，那你可以把这么一大推操作放在一个中括号里然后呢在逗号`,`一个`rev`就可以了。
  // npm install --save-dev gulp@3.9.1 （想使用 runSequence 请将gulp版本回退到 3.9.1）
  runSequence(
    ["imagesmin", "publish:html", "publish:css", "publish:js"],
    "rev"
  );
  // 初始化browserSync服务器
  browserSync.init({
    server: {
      baseDir: build.basePath,
      index: "index.html" // 指定特定文件名为索引
    },
    port: 8081
  });
  done();
});

// 压缩图片，只限png和jpg
gulp.task("imagesmin", function(done) {
  gulp
    .src(src.images + "*.*")
    .pipe(imagemin())
    .pipe(gulp.dest(build.images));
  done();
});

// html文件处理
gulp.task("publish:html", function(done) {
  gulp.src(src.basePath + "*.html").pipe(gulp.dest(build.basePath));
  done();
});

gulp.task("publish:css", function(done) {
  gulp
    .src(src.css + "all.min.css")
    .pipe(rev()) // 发布新版本，带hash后缀的css文件
    .pipe(gulp.dest(build.css))
    .pipe(rev.manifest()) // 创建一个css新版本的配置文件
    .pipe(gulp.dest("./rev/css/"));
  done();
});

gulp.task("publish:js", function(done) {
  gulp
    .src(src.js + "all.min.js")
    .pipe(rev()) // 发布新版本，带hash后缀的js文件
    .pipe(gulp.dest(build.js))
    .pipe(rev.manifest()) // 创建一个js新版本的配置文件
    .pipe(gulp.dest("./rev/js/"));
  done();
});

gulp.task("del:build", function(done) {
  del([build.basePath]);
  done();
});

gulp.task("rev", function(done) {
  // 替换我们新生成的所有的版本配置文件
  return gulp
    .src(["./rev/**/*.json", build.basePath + "*.html"])
    .pipe(revCollector({})) // 替换
    .pipe(gulp.dest(build.basePath));
});
