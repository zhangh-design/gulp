前端自动化最佳构建实践&&Gulp流程控制

这个项目我使用的`gulp`的版本是`3.9.1`对应的文档是旧版的文档。

```
npm install --save-dev gulp@3.9.1
```

因为gulp新的`4`以上的版本无法使用`run-sequence`这个插件。

大家注意：

 我之前反复强调过说生产环境最好一定是要和开发环境分隔开，那么也就是说开发环境下所有的中间文件呢都要输出到开发环境下，
 而不能直接跨域到生产环境下，所以说这个大家注意就是说：我现在编译开发环境下less文件我输出的时候也要输出到开发环境下。
 那么什么时候我在从开发环境下把所有有用的文件部署到生产环境下呢？
 那当然是在我启动生产环境的服务器的时候才会做，但是在这个之前呢在启动生产环境服务器之前呢所有的操作都要在开发环境下去做，
以便达到开发和生产之间可以完全分离的一个操作。


项目目录

```
build 生产环境下的打包后的代码和文件
src 开发环境下的所有源代码和源文件
 |-css （通过gulp转义less之后存放css的目录）
 |-js
   |-01.js
   |-02.js
 |-less
    |-01.less
    |-02.less
index.html
page2.html
page3.html
```

run-sequence 任务Task流程控制 task任务的先后顺序

```
cnpm install --save-dev run-sequence
```

控制我们各项任务的流程：

它里面可以接受很多参数，那么在一个中括号之内的这样的一个任务呢，它是并行的操作那么在中括号和中括号之间呢是一个同步的操作，那么所谓同步的操作呢就是说必须前面一个完成之后才能执行它。

那么这个 runSequence 呢主要是引入我们叫一个`run-sequence`这样的一个插件。


```
runSequence(
    ["imagesmin", "publish:html", "publish:css", "publish:js"],
    "rev"
  );
```

控制我们各项任务的流程

它里面可以接受很多参数，那么在一个中括号之内的这样的一个任务呢，它是并行的异步操作，那么在中括号和中括号之间呢是一个同步的操作，那么所谓同步的操作呢就是说必须前面一个完成之后才能执行它，那么这个`runSequence` 呢主要是引入我们叫一个`run-sequence`这样的一个插件。

然后使用起来呢也非常的简单，比如说：你在这个生产模式下的服务器的时候呢你希望先并行处理`["imagesmin", "publish:html", "publish:css", "publish:js"]` 这么一大推操作，然后处理这么一大推操作完事了之后，
最后在处理文件版本路径替换的操作`rev`，那你可以把这么一大推操作放在一个中括号里然后呢在逗号`,`一个`rev`就可以了。

























