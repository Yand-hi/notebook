### Code-Splitting
- entry文件：手动配置多入口文件拆分代码
```js
mode: 'development',
  entry: {
    index: './src/index.js',
    another: './src/another-module.js',
  },
```
- 列出依赖项：dependOn 相同则只一次防止重复
```js
index: {
      import: './src/index.js',
      dependOn: 'shared',
    },
    another: {
      import: './src/another-module.js',
      dependOn: 'shared',
    },
    shared: 'lodash',
// 还需配置这个
optimization: {
    runtimeChunk: 'single',
  },
```
- 插件：SplitChunksPlugin
```js
optimization: {
     splitChunks: {
       chunks: 'all',
     },
   },
```
- 动态导入：通过函数调用导入模块
```js
import()
```