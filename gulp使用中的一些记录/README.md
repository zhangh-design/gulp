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






















