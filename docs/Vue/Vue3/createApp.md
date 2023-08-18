Vue 2 没有“app”的概念，我们定义的应用只是通过 `new Vue()` 创建的根 Vue 实例。从同一个 Vue 构造函数创建的每个根实例共享相同的全局配置

# createApp
```js
import { createApp } from 'vue'

const app = createApp({})
```
# 挂载 App 实例
```js
import { createApp } from 'vue'
import MyApp from './MyApp.vue'

const app = createApp(MyApp)
app.mount('#app')
```
# render() 渲染函数
`<template/>` 之外的选择，可以写成 JSX/TSX 形式；
用法示例：
```html
<div id="app" class="demo">
    <Demo title="hello world"></Demo>
</div>
```
```js
const {createApp, h} = Vue
const app = createApp({})
app.component('Demo', {
    render() {
        return h(
            'h1',   // 标签名称
            this.title  // 标签内容
        )
    },
    props: {
        title: {
            type: String,
            required: true
        }
    }
})
app.mount('#app')
```
### 注意
render 函数的优先级高于根据 template 选项或挂载元素的 DOM 内 HTML 模板编译的渲染函数。