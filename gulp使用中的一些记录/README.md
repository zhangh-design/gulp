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























