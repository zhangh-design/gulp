# gulp
gulp 知识点记录+示例项目

- gulp-test gulp自动化构建工具测试使用示例（less css js browser-sync notify rev gulp-rev-collector）
- gulp-test-babelplugin-transform-runtime 有babel的高级使用配置 （@babel/polyfill @babel/plugin-transform-runtime）
- gulp-test-goods gulp前端自动化最佳构建实践&&Gulp流程控制

环境依赖：

```
cnpm install --save-dev @babel/core @babel/preset-env browser-sync del gulp gulp-autoprefixer gulp-babel gulp-base64 gulp-changed gulp-clean-css gulp-concat gulp-css-spriter gulp-imagemin gulp-less gulp-notify gulp-rename gulp-rev gulp-rev-collector gulp-uglify run-sequence
```

```
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


```

Gulp 前端项目构建最佳实践

1. 建立站点文件

```
   1.1 开发环境，src 文件夹
   1.2 生成环境，build文件夹
   1.3 Gulp环境搭建 ：npm install --save-dev gulp
```

2. 开发环境向生成模式输出

```
   2.1 清空（删除）文件夹：del
   2.2 复制文件：src -> dest
   2.3 less文件编译：gulp-less
   2.4 css合并：gulp-concat
   2.5 css压缩：gulp-clean-css
   2.6 js es6 -> es5：gulp-babel
   2.7 js合并：gulp-concat
   2.8 js压缩：gulp-uglify，文件改名：gulp-rename
   2.9 图片压缩：gulp-imagemin，gulp-cache
  2.10 雪碧图（Sprite Image）/ 精灵图：gulp-css-spriter （jpg、png）
  2.11 base64：gulp-base64
```

3. 浏览器（服务器）同步：
   
```
   3.1 建立服务器：browser-sync （http://www.browsersync.cn/）
   3.2 浏览器实时刷新 browser对象的.reload
```

4. Gulp项目自动化配置

```
   4.1 路径统一修改&配置
   4.2 版本控制 ：gulp-rev和gulp-rev-collector
   4.3 Gulp操作流程控制： run-sequence
   4.4 Gulp项目通知： gulp-notify
```
