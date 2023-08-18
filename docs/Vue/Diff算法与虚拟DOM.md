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

# DOM diff算法
- 就是一个函数，称之为 `patch`
- `patches = patch(oldVNode, newVNode)`
- `patches` 就是要运行的 DOM 操作
### 大概逻辑
- Tree diff
1. 新旧对比，找出哪些节点需要更新
2. 如果节点是组件就看 `Component diff`
3. 如果节点是标签就看 `Element diff`
- Component diff
1. 类型不同就直接替换（删除旧的）
2. 类型相同则只更新属性
3. 然后深入组件做 `Tree diff`（递归）
- Element diff
1. 标签名不同直接替换，相同则只更新属性
2. 然后进入标签后代做 `Tree diff`（递归）
### DOM diff缺点
只能一个一个节点对比，不能全局对比，严重依赖唯一的 `key` 值作为每个相同节点的 `id`