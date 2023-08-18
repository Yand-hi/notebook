使用工具：Webpack@5 Vue@2

## 目录结构
首先要明确最终项目的目录结构
```
vue2webpackconfig
├── dist
│   ├── bundle.js
│   └── index.html
├── package-lock.json
├── package.json
├── src
│   ├── App.vue
│   ├── main.js
│   ├── pages
│   │   ├── About.vue
│   │   └── Home.vue
│   └── router
│       └── index.js
└── webpack.config.js
```
>dist 目录：最终 webpack 打包后的目录；
src 目录：被打包的文件目录;
package.json 文件：包含了项目所有依赖的信息及配置；
package-lock.json 文件：锁定上传包的版本；
webpack.config.js 文件：webpack 配置文件。
#### 目标
- 配置 webpack 从 src 目录下的 main.js 文件打包至 dist 目录下生成的 bundle.js
- 配置 vue 项目模板，能够成功编译运行;
- 使用 vue-router 实现页面多组件跳转
## 第一步：准备工作
- 建立 src 目录，dist 目录，在 src 目录下新建文件 main.js 为 webpack 打包入口文件；
- dist 目录下新建文件 index.html 并且引入 bundle.js（打包出口，配置后自动生成）
```html
//  index.html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
</head>
<body>
    // vue 根实例绑定
    <div id="app"></div>
    <script src="bundle.js"></script>
</body>
</html>
```
## 第二步：安装项目依赖
1. 安装项目依赖
```
npm i vue vue-router axios element-ui  
```
2. 安装开发依赖
```
npm i -D webpack webpack-cli vue-loader vue-template-compiler sass sass-loader css-loader style-loader babel-loader @babel/core @babel/preset-env
```
>webpack: 打包工具，使用的是 webpack5;
webpack-cli: 提供 webpack 终端命令去调用 webpack;
vue-loader: 将 vue 文件代码转换为 js;
vue-template-compiler: vue 模板编译器，将 template 内容转换为 HTML;
sass-loader、css-loader、style-loader: 将 sass => css => 处理 css => 通过 style 标签插入到 HTML;
babel-loader: 将 es6+ 语法转换为老语法，浏览器兼容;
@babel/core: babel 核心库;
@babel/preset-env: babel 预设配置集合;
## 第三步：配置文件
1. 配置 webpack.config.js
```javascript
const path = require('path')
const { VueLoaderPlugin } = require('vue-loader')

module.exports = {
// 定义入口文件路径
    entry: './src/main.js',
// 定义出口文件路径，为绝对路径 __dirname 为当前目录，通过引入 path 模块拼接路径
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
// 配置 loader
    module: {
        rules: [
            {
                test: /\.vue$/,
                use: 'vue-loader'
            },
            {
                test: /\.s[ca]ss$/,
                use: ['style-loader', 'css-loader', 'sass-loader']
            },
            {
                test: /\.m?js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.(png|jpe?g|gif|svg|webp)$/,
//  webpack4 写法 use: {loader: 'file-loader', options: {esModule: false}}   
                type: 'asset/resource'
            }
        ]
    },
// 配置 plugin
    plugins: [
// 当遇到 vue 文件中的同类型文件时，使用同配置的 loader 进行转换
        new VueLoaderPlugin(),
    ]
}
```
3. 配置入口文件 main.js
```js
import Vue from 'vue';
import App from './App.vue'
import router from './router';

new Vue({
// 指定替换元素为 <div id='app' />
    el: '#app',
    router,
// vue 渲染函数，h 就是 createElement 创建 VNode 虚拟节点
    render: h => h(App)
})
```
4. 配置 vue 单文件组件
```js
<template>
  <div>
    <h1>我是 App.Vue !</h1>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
</style>
```
此时，我们已经基本配置完成，可以使用 webpack 运行预览了，但是还无法直接使用 webpack 命令，因为 webpack-cli 只是安装在了 `./node_modules/.bin/webpack` 中，需要在 package.json 中添加配置脚本
5. 配置 package.json
```json
  "scripts": {
    // 创建开发服务器，设置为开发环境，--watch 实时编译打包
    "serve": "webpack --mode=development --watch",

    // 上线构建命令，设置为生产模式，打包一次，不需要 --watch
    "build": "webpack --mode=production"
  },
```
6. 基础配置完成
```
npm run serve
```
到这里，vue2 项目脚手架基础配置完成。
## 第四步：配置路由
1. 在 src 中创建一个 router 目录，在该目录下新建一个 index.js，创建一个 vue-router 实例并将其导出
```js
// router/index.js
import VueRouter from 'vue-router'
import Home from '../pages/Home.vue'
import About from '../pages/About.vue'
import Vue from 'vue'

// 注册 VueRouter 至 Vue 实例
Vue.use(VueRouter)

const router = new VueRouter({
    routes: [
        {
            path: '/',
            component: Home
        },
        {
            path: '/about',
            component: About
        }
    ]
})

export default router
```
2. src 下新建一个 pages 目录，可以在其中新建 Home 和 About 组件
- Home 组件可跳转至 About 组件页面，使用 `this.$router.push()` 进行跳转
```js
// Home.vue
<template>
  <div>
    我是首页
    <hr />
    <button @click="go">前往 About 页面</button>
  </div>
</template>

<script>
export default {
  methods: {
//  编程式导航
    go() {
      this.$router.push("about");
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
```
- About 组件可以跳转至 Home 组件页面，使用 `<router-link to="" />` 实现跳转
```js
// About.vue
<template>
  <div>
    我是关于页面
    <hr />
    <router-link to="/"> 前往 Home 页面 </router-link>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
</style>
```
## 最后：脚手架搭建完成
#### 预览
可以使用 vscode 插件 live-server 启动一个服务器，进行预览
![](https://upload-images.jianshu.io/upload_images/26873565-e7aac1fb0117cdfb.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)![](https://upload-images.jianshu.io/upload_images/26873565-a6db86c3ce2228f8.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

