# 虚拟DOM
### 优点
1. 减少 DOM 操作
- 多次 DOM 操作合并为一次；
- 可以借助 diff算法将该多余的操作省略；
2. 跨平台
- 不仅可以变成 DOM，还可以变成小程序、安卓应用；
- 因为虚拟 DOM 本质上是一个对象
### 缺点
需要额外的创建函数来创建
- Vue 中为 `render` 函数中的 `h` 函数；一般在 template 标签中写，通过 `vue-loader` 转译；
- React 中为 `createElement` 函数，一般通过 JSX 语法 return 出去，通过 babel 直接转译
- 严重依赖打包工具，需要构建过程进行转译语法。