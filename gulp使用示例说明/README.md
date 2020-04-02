
项目目录

```
build  生成环境打包输出文件夹
 |-css
   |-all.css （合并index.less和lib.less）
   |-lib.css （测试图片base4的生成）
 |-images
   |-1.jpg
   |-2.jpg
   |-spritesheet.png （生成的雪碧图）
 |-js
   |-all.js
   |-all.min.js
node_modules
src  源代码和源文件
 |-css （less 编译后存放的目录）
    |-all.css （index.css和lib.css合并后的文件）
    |-index.css
    |-lib.css
 |-images
    |-icon
       |-arrow_1.png
       |-arrow_2.png （雪碧图）
    |-1.jpg （imagemin 压缩）
    |-2.jpg （imagemin 压缩）
    |-walk.png （base64的图片）
 |-less
    |-index.less
    |-lib.less
 |-js
   |-index.js
   |-lib.js
 |-index.html
.editorconfig
.gitignore
gulpfile.js
package.json
README.md
```

```
"devDependencies": {
    "gulp": "^4.0.2",
    "gulp-clean-css": "^4.3.0",
    "gulp-concat": "^2.6.1",
    "gulp-less": "^4.0.1"
}
```

gulp中提供的对外方法：

- task
- src
- pipe
- dest
- watch

#### 1. 任务定义和顺序调用

注意：任务的定义顺序一定要和执行顺序一样，不能随意定义任务的位置。

```
var gulp = require("gulp");
var { series } = require("gulp");
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
```


#### 2. src和dest 读取和写入操作（复制文件命令）-初探

```
var gulp = require("gulp");

gulp.task("default", function(done) {
  // src 读取src目录所有文件到内存中，dest 输出到build文件夹
  gulp.src("./src/**/*") // input 读取操作（读取src目录下的所有文件）
  .pipe(gulp.dest("./build/")) // pipe方法相当于下一步的意思，dest方法则是输出、写入操作output操作
  done();
});
```

#### 3. watch 监控文件

```
var gulp = require("gulp");
var { series } = require("gulp");

gulp.task("watch-file", function(done) {
  // watch 监测 src 目录下的index.html文件的变动，通知task1任务和task2任务
  gulp.watch("./src/index.html", series(["task1", "task2"]));
    // 也可以不调用其它任务，直接触发一个回调函数
  /* gulp.watch("./src/index.html", function(event){
    console.log("发生文件变化了");
    console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
  }); */
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
```

启动任务task：

任务启动后会一直处于等待中，因为watch的命令就是去监测index.html文件的变动然后在调用task1和task2这两个任务，如果此时你把index.html修改然后保存之后watch就会去调用task1和task2（你可以在task1和task2里面做一些编译操作），如果要手动退出watch的话就需要你手动输入ctrl+c命令。

```
E:\gulp\vue-gulp\gulp-test>gulp watch-file

E:\gulp\vue-gulp\gulp-test>"node"  "C:\Users\nickname\AppData\Roaming\npm\\node_modules\gulp-cli\bin\gulp.js" watch-file
[11:19:36] Using gulpfile E:\gulp\vue-gulp\gulp-test\gulpfile.js
[11:19:36] Starting 'watch-file'...
[11:19:36] Finished 'watch-file' after 10 ms
[11:19:46] Starting 'task1'...
index.html发生改变会调用task1任务
[11:19:46] Finished 'task1' after 2.37 ms
[11:19:46] Starting 'task2'...
index.html发生改变会调用task2任务
[11:19:46] Finished 'task2' after 1.26 ms
```


#### 4. less 编译成css

安装：

```
cnpm install gulp-less --save-dev
```

使用：

```
src
 |-css
   |-index.css // 调用 gulp-less 转义的css
   |-lib.css
 |-js
 |-less
   |-index.less
   |-lib.less
 |-index.html
```

```
var gulp = require("gulp");
var { series } = require("gulp");
var less = require("gulp-less");

// less
gulp.task("less", function() {
  // 读取 src/less 目录下的所有 .less 结尾的文件
  return gulp
    .src("./src/less/*.less")
    .pipe(less()) // 调用 less 处理读取出来的 .less 结尾的文件流
    .pipe(gulp.dest("./src/css/")); // 写入到 src/css/ 目录中
});
```

#### 5. 把编译出来的多个 css 文件合并成一个 css 文件

安装:

```
cnpm install --save-dev gulp-concat
```

使用：

```
src
 |-css
   |-all.css   // 合并成 all.css
   |-index.css // 调用 gulp-less 转义的css
   |-lib.css
 |-js
 |-less
   |-index.less
   |-lib.less
 |-index.html
```

```
var gulp = require("gulp");
var { series } = require("gulp");
var less = require("gulp-less");
var concat = require('gulp-concat');

// css文件合并
gulp.task("concat", function() {
  // 合并 src/css 目录下的所有css文件
  return gulp
    .src("./src/css/*.css")
    .pipe(concat('all.css', {newLine: ';'})) // 传入一个可选的选项配置，合并成 all.css 这个文件
    .pipe(gulp.dest('./src/css/')); //把 all.css 输出到src/css/目录
});

```

#### 6. css 压缩

安装：

```
cnpm install --save-dev gulp-clean-css
```

使用：

压缩就是去除代码里的 注释和空行等，并且把代码压缩成一行。

```
src
 |-css
   |-all.css   // 合并成 all.css
   |-index.css // 调用 gulp-less 转义的css
   |-lib.css
 |-js
 |-less
   |-index.less
   |-lib.less
 |-index.html
```

all.css

```
.div1{color:red}body{background-color:red}
```

```
// css 压缩
gulp.task("clean-css", function() {
  // 合并 src/css 目录下的所有css文件
  return gulp
    .src("./src/css/*.css")
    .pipe(concat("all.css", { newLine: ";" })) // 传入一个选项配置，合并成 all.css 这个文件
    .pipe(cleanCss({compatibility: 'ie8'})) // 压缩css，可选参数压缩后的css同时兼容ie8
    .pipe(gulp.dest("./src/css/")); //把 all.css 输出到src/css/目录
});
```

#### 7. css自动添加浏览器前缀

针对css3的属性自动添加浏览器前缀。

安装：

```
cnpm install --save-dev gulp-autoprefixer
```

在项目的根目录添加一个浏览器配置文件`.browserslistrc`，用来告诉`gulp-autoprefixer`这个插件哪些针对哪些浏览器添加对于的前缀。

.browserslistrc

```
# Browsers that we support

last 2 version
> 1%
not ie <= 8
ios 7
maintained node versions
not dead
```

index.less （源文件）

```
/* 页面上主要的less */
@import "./lib.less";

body{
    background-color: @bgcolor;
}

.div2 {
    display: flex; // 需要添加兼容性前缀的css3属性
}

```

index.css（使用 gulp-less 编译后的 css 文件）

```
/* 页面上主要的less */
/* 用来存储一些变量和方法 */
.div1 {
  color: #ff0000;
}
body {
  background-color: #ff0000;
}
.div2 {
  display: -webkit-flex; // 自动添加的前缀
  display: flex;
}

```

使用：

```
var gulp = require("gulp");
var { series } = require("gulp");
var less = require("gulp-less");
var concat = require("gulp-concat");
var cleanCss = require("gulp-clean-css");
var autoprefixer = require("gulp-autoprefixer");

// css自动添加浏览器前缀
gulp.task("autoprefixer", function() {
  // 读取 src/less 目录下的所有 .less 结尾的文件
  return gulp
    .src("./src/less/*.less")
    .pipe(less())
    .pipe(autoprefixer()) // 自动添加浏览器前缀
    .pipe(gulp.dest("./src/css/"));
});
```

#### 8. 清空（删除）文件夹

安装：

```
cnpm install --save-dev del
```

使用：

```
var gulp = require("gulp");
var { series } = require("gulp");
var less = require("gulp-less");
var concat = require("gulp-concat");
var cleanCss = require("gulp-clean-css");
var autoprefixer = require("gulp-autoprefixer");
var del = require("del");

// 清空（删除）文件夹
gulp.task("del", function() {
  // 需要删除的文件列表
  return del(["./src/css/*.css", "./build/"]);
});
```

#### 9. js文件的操作（转义、压缩、重命名、改名）

es6->es5

安装：

```
cnpm install @babel/core --save-dev

cnpm install --save-dev gulp-babel

cnpm install @babel/preset-env --save-dev

```

压缩：

```
cnpm install --save-dev gulp-uglify
```

重命名、改名

```
cnpm install gulp-rename --save-dev
```

在项目的根目录下增加一个.babelrc 的配置文件用于设置babel

.babelrc

```
{
  "presets": ["@babel/preset-env"],
  "plugins": []
}

```

注意：这里我只使用了 `@babel/preset-env` 只转义了es6的词法比如：let 、const和箭头函数等，如果要转义 Promise 等内置的高级函数请在安装`@babel/polyfill`。

我在项目内是把js文件的打包交给了`Webpack`的所以我这里就不安装`@babel/polyfill`了。

index.js

```
let a = 3;
let b = 5;

```

lib.js

```
const abb = (a, b) => a + b;

```

使用：

```
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

gulp.task("js", function() {
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


```

all.js

编译合并后的 all.js 这里我们发现用 gulp 编译后的文件非常的纯净并不像Webpack那样有很多的闭包。

```
"use strict";

var a = 3;
var b = 5;
"use strict";

var abb = function abb(a, b) {
  return a + b;
};
```

all.min.js

```
"use strict";var a=3,b=5,abb=function(r,t){return r+t};
```

#### 10. 图片压缩

安装：

```
cnpm install --save-dev gulp-imagemin
```

使用：

```
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

gulp.task("images", function() {
  return gulp
    .src("./src/images/*.*") // 读取src/images/目录下的所有文件
    .pipe(imagemin())
    .pipe(gulp.dest("./build/images/"));
});

```

#### 10. 雪碧图（sprite image）/ 精灵图 生成

安装：

```
cnpm install --save-dev gulp-css-spriter
```

比较支持 jpg和png的图，对其它格式支持的不是太好。

使用：

```
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

// 雪碧图（sprite image）/ 精灵图 生成
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
    .pipe(gulp.dest("./build/css/"));
});
```

all.css

```
body{background-color:#0f0}.div1{display:-webkit-flex;display:flex;background-image:url(../images/spritesheet.png);background-position:0 0;width:100px;height:100px}.div2{background-image:url(../images/spritesheet.png);background-position:0 0;width:100px;height:100px}.div3{background-image:url(../images/spritesheet.png);background-position:-32px 0;width:100px;height:100px}.div1{color:red}
```

#### 11. base64 处理图片

安装：

```
cnpm install --save-dev gulp-base64
```

使用：

```
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


gulp.task("base64", function() {
  // 读取 src/less 目录下的所有 .less 结尾的文件
  return gulp
    .src("./src/less/lib.less")
    .pipe(less())
    .pipe(base64({ maxImageSize: 8 * 1024 })) // base64处理 小于等于8kb就处理成base64
    .pipe(gulp.dest("./build/css/"));
});

```

#### 12.浏览器实时刷新-browser-sync

安装：

```
cnpm install --save-dev browser-sync
```

使用：

```
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
var changed = require('gulp-changed');

// 开发模式下静态服务器
gulp.task("dev:server", function() {
  browserSync.init({
    server: {
      baseDir: "./", // 根目录 gulp-test
      index: "./src/index.html" // 指定特定文件名为索引
    },
    port: 8080
  });
  // 对文件的修改进行监听
  gulp.watch("./src/*.{html, htm}", gulp.series(["reload"]));
  gulp.watch("./src/less/*.less", gulp.series(["less"]));
  gulp.watch("./src/css/*.css", gulp.series(["sprite-css"]));
  gulp.watch("./src/js/*.js", gulp.series(["js"]));
});

gulp.task("reload", function(done) {
  // 最后别忘了 调用 reload
  gulp
  .src("./src/*.{html, htm}")
  .pipe(changed("./build/", {extension: '.html'})) // 监测 build 目录并且目标文件的扩展名 .html
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


```

#### 13. 补充说明及路径统一

- gulp.watch 监测的文件不能带`./`，否则无法监测新加入的文件（我的 gulp 版本是4.0.2前面带有`./`在新建文件后 gulp.watch 也能监测到）

```
gulp.task("dev:server", function() {
  browserSync.init({
    server: {
      baseDir: "./", // 根目录 gulp-test
      index: "./src/index.html" // 指定特定文件名为索引
    },
    port: 8080
  });
  gulp.watch("src/*.{html, htm}", gulp.series(["reload"]));
  gulp.watch("src/less/*.less", gulp.series(["less"]));
  gulp.watch("src/css/*.css", gulp.series(["sprite-css"]));
  gulp.watch("src/js/*.js", gulp.series(["js"]));
});
```

- gulp-changed （仅通过更改的文件）

`gulp-changed`插件的作用，是用来过滤未被修改过的文件，只有修改后的文件才能通过管道。这样做的好处是，只处理修改后的文件，减少后续程序的执行时间。

安装：

```
cnpm install gulp-changed --save-dev
```

使用：

```
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
var changed = require('gulp-changed');

// 开发模式下静态服务器
gulp.task("dev:server", function() {
  browserSync.init({
    server: {
      baseDir: "./", // 根目录 gulp-test
      index: "./src/index.html" // 指定特定文件名为索引
    },
    port: 8080
  });
  gulp.watch("./src/*.{html, htm}", gulp.series(["reload"]));
});

// 这里引入了 changed 过滤不处理未修改过的文件
gulp.task("reload", function(done) {
  // 最后别忘了 调用 reload
  gulp
    .src("./src/*.{html, htm}")
    .pipe(changed("./build/", {extension: '.html'})) // 监测 build 目录并且目标文件的扩展名 .html
    .pipe(gulp.dest("./build/"))
    .pipe(reload({ stream: true }));
  done();
});

```

- 路径统一配置

我们在 gulp 的配置文件 gulpfile.js 中要写很多的路径，哪天如果我们想要修改构建的路径了
，那么我们就非常的麻烦会要在这个 gulpfile.js 里去批量的去更改我们的文件路径。

使用：

```
var gulp = require("gulp");

// 定义路径变量

// 生产环境目录配置
var build = {
  css: './build/css/',
  images: './build/images/',
  js: './build/js/'
};

// 开发环境目录配置
var src = {
  css: './src/css/',
  images: './src/images/',
  js: './src/js/',
  less: './src/less/'
};

// 下面的构建就可以使用配置对象中的参数

```

#### 14. 版本控制

安装：

```
// 版本控制
cnpm install gulp-rev --save-dev

// 修改文件中的版本号替换新生成的版本文件名称
cnpm install gulp-rev-collector --save-dev
```

使用：

```
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

// 版本控制
gulp.task("rev-css", function() {
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
    .pipe(rev()) // 发布新版本
    .pipe(gulp.dest("./build/css/"));
});

```

```
build
 |-css
    |-all-a453b36b23.css // 会新生成一个带 hash 的文件
    |-all.css
    |-lib.css
```

执行`gulp rev-css`命令后会在`./build/css/`目录新生成一个`all-a453b36b23.css`带版本号的文件。

但是我们生成这个带版本号的文件之后呢还没完，因为我们之后呢是要调用这个文件名的这个名字的文件的，我们
既然呢已经生成了一个不一样的`all-a453b36b23.css`这个css我们需要在这个`index.html`里改变`link`标签里的引入名称啊：

index.html

```
<link rel="stylesheet" href="../build/css/all.css">
```

要把`all.css`修改成`all-a453b36b23.css`这个最新的打包文件

当需要有这个操作的时候呢配合`gulp-rev`需要去进行一个`mini`的这样一个文件映射的操作，需要让系统知道就是说你当前生成的是从什么版本到什么版本的一个情况，所以呢我们需要这样的一个文件就是一个映射文件。

那么这个映射文件`gulp-rev`也可以做到：

```
// 版本控制
gulp.task("rev-css", function() {
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
    .pipe(rev()) // 发布新版本
    .pipe(gulp.dest("./build/css/"))
    .pipe(rev.manifest())
    .pipe(gulp.dest('./rev/css/')); // 生成一个配置文件，写入到rev/css/目录
});
```

```
build
node_modules
rev
 |-css
    |-rev-manifest.json
src
```

rev-manifest.json

```
{
  "all.css": "all-a453b36b23.css"
}
```

执行`gulp rev-css`这个命令后会在根目录生成一个`rev`的文件夹，在这个`rev-manifest.json`里面呢它告诉了我们它把这个`all.css`这个原始版本改成了`all-a453b36b23.css`这个版本，所以说呢这里面呢就是一个映射文件。

那么最后呢我们需要根据这个映射文件所指定的这个改变呢去替换我们`index.html`中的`<link rel="stylesheet" href="../build/css/all.css">`这个东西也就是去进行一个字符串的替换，这个字符串的替换它是需要安装另一个gulp的插件

那么这个插件的名称呢叫`gulp-rev-collector`正好是和这个`gulp-rev`是配合去使用的。

安装：

```
cnpm install gulp-rev-collector --save-dev
```

使用：

```
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
var revCollector = require("gulp-rev-collector");

// 版本控制
gulp.task("rev-css", function() {
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
    .pipe(rev()) // 发布新版本
    .pipe(gulp.dest("./build/css/"))
    .pipe(rev.manifest())
    .pipe(gulp.dest('./rev/css/')); // 生成一个配置文件，写入到rev/css/目录

// 根据映射文件的配置更改我们index.html中的路径
gulp.task("rev-collector", function(done) {
  // 读取映射文件，去替换src目录下的所有.html文件
  // 这里的src中接收的是一个数组，表示读取和替换，这是 gulp-rev-collector 的语法
  gulp
    .src(["./rev/**/*.json", "./src/*.html"])
    .pipe(revCollector({}))
    .pipe(gulp.dest("./src/"));
  done();
});

```

我们在写一个`gulp rev-collector`的任务专门去用于版本的替换操作。


#### 15. 项目通知

gulp项目中如何进行项目通知的操作

那么在我们做项目的时候呢我们经常会需要运用这个`browser-sync`进行浏览器和服务器的同步，那么有的时候呢我们在做完一些gulp操作的时候呢我们需要gulp项目对我们进行通知。

那么现在阶段呢这个gulp项目中主要是通过就是命令行的这个控制台输出对我们进行一些通知。比如说：

```
E:\gulp\vue-gulp\gulp-test>gulp rev-collector

E:\gulp\vue-gulp\gulp-test>"node"  "C:\Users\nickname\AppData\Roaming\npm\\node_modules\gulp-cli\bin\gulp.js" rev-collector
[12:54:05] Using gulpfile E:\gulp\vue-gulp\gulp-test\gulpfile.js
[12:54:05] Starting 'rev-collector'...
[12:54:05] Finished 'rev-collector' after 29 ms
```

`Starting`和`Finished`，那么有的时候我们是需要它能够实时就是到这个浏览器里去通知的。

那么 这个时候我们需要去安装一个插件，这个插件的名字呢`gulp-notify`

安装：

```
cnpm install gulp-notify --save-dev
```

`gulp-notify` 主要就是如何在浏览器实时同步的情况下进行一个通知的操作。

使用：

注意：使用的时候一定要开启`browser-sync`服务器

```
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

gulp.task("dev:server", function() {
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

```

`gulp-notify` 主要就是如何在浏览器实时同步的情况下进行一个通知的操作。

#### 16. gulp-cheerio 以标签形式内联css、js到html页面

安装：

```
cnpm install --save-dev gulp-cheerio
```

使用：

```
var gulp = require("gulp");
var cheerio = require("gulp-cheerio"); // 以标签形式内联css、js到html页面

**
 * @desc html文件
 */
gulp.task("html:dev", function() {
  var themeName = "theme-default"; // 默认主题库
  if (process.argv[3]) {
    themeName = process.argv[3].replace("--", "") + "/";
  }
  return gulp
    .src("./public/index.html")
    .pipe(
      cheerio(function($) {
        $("script").remove();
        $("link").remove();
        $("body").append('<script src="./fast-element-ui.common.js"></script>');
        $("head").append(
          '<link rel="stylesheet" href="./'+themeName+'index.css">'
        );
        $("head").append(
          '<link rel="Shortcut Icon" href="./favicon.ico" type="image/x-icon" />'
        );
      })
    )
    .pipe(gulp.dest("./public/"));
});
```
