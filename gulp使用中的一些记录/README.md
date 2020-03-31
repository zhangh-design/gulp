gulp使用中的一些记录

1. fs.readFileSync 读取json文件

```
const fs = require('fs');

function asyncAwaitTask() {
  const { version } = fs.readFileSync('package.json');
  console.log(version);
}

exports.default = asyncAwaitTask;
```

2. 选择某种文件

```
gulp.src('./src/styles/*.{scss,css}');
```

3. 排除某些文件

src里面传入一个数组，!表示非。

```
gulp.src([
      src.css + "*.css",
      "!" + src.css + "all.min.css",
      "!" + src.css + "all.css"
    ])
```

gulp使用中的一些记录

1. fs.readFileSync 读取json文件

```
const fs = require('fs');

function asyncAwaitTask() {
  const { version } = fs.readFileSync('package.json');
  console.log(version);
}

exports.default = asyncAwaitTask;
```

2. 选择某种文件

```
gulp.src('./src/styles/*.{scss,css}');
```

3. 排除某些文件

src里面传入一个数组，!表示非。

```
gulp.src([
      src.css + "*.css",
      "!" + src.css + "all.min.css",
      "!" + src.css + "all.css"
    ])
```

4. 输出压缩版和未压缩版

```
gulp.task("css:dev", function(done) {
  gulp
    .src([
      src.css + "*.css",
      "!" + src.css + "all.min.css",
      "!" + src.css + "all.css"
    ])
    .pipe(concat("all.css"))
    .pipe(
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
```

5. 用`package.json`通过`npm`指令调用`gulp`的任务，并且传递参数到`gulp`的任务中

package.json

```
  "scripts": {
    "build:theme": "gulp theme --bbbb"
  }
```

`--`是固定的写法

gulpfile.js

```
gulp.task("clear:theme", function(done) {
  console.info('process.argv ',process.argv);
  // process.argv 可以获取参数
  // 删除lib目录下的所有文件，但保留lib文件夹
  del([baseDir.theme + "theme-default/*.css"]);
  done();
});
```

console.info参数输出列表：

```
process.argv  [
  'F:\\Program Files\\nodejs\\node.exe',
  'E:\\vue-fast-element-ui\\build-fast-element-ui\\node_modules\\_gulp@4.0.2@gulp\\bin\\gulp.js',
  'theme',
  '--bbbb'
]
```

6. `gulp` 指令传递参数


```
gulp bbb --123

gulp.task('bbb', function(done){
  console.info('aaaaaaaa ',process.argv);
  done();
})

// 输出
aaaaaaaa  [
  'F:\\Program Files\\nodejs\\node.exe',
  'F:\\Program Files\\nodejs\\node_global\\node_modules\\gulp-cli\\bin\\gulp.js',
  'bbb',
  '--123'
]

```
