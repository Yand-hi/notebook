# 什么是 webpack，有什么用？
>webpack 就是一个打包工具，宗旨是一切静态资源皆可打包，分析项目结构，找到JS模块以及浏览器不能直接运行的拓展语言，并使用转译工具将其转译，最终打包为合格的格式供浏览器使用

# 核心概念
1. entry 入口：webpack 使用该文件模块作为打包入口，构建内部依赖图，进行递归。找出所有依赖的模块，并使用相应的 loader 进行转译
2. output 出口：最终输出结果的文件，默认为 ./dist
3. loader：将所有类型的文件转换成 webpack 能够有效处理的文件，常用的有 `babel-loader`,`sass-loader`,`css-loader`,`style-loader`,`vue-loader`,`file-loader`,`url-loader`;
4. plugin：插件，用来增强 webpack 功能，一种强大的扩展；
5. module：模块，esm / cjs 模块规范，一个模块对应一个文件；

# webpack 打包过程
>webpack 启动后会在 entry 里配置的 module 开始递归解析入口文件所依赖的模块，每找到一个模块，就会根据 webpack.config.js 配置文件里的规则使用相应的 loader 进行转换，然后再解析当前模块依赖的模块，这些模块会以其 entry 进行分组，一个 entry 和所依赖的模块就构成了一个 chunk，最后 webpack 会把所有 chunk 转换为文件输出，必要时会使用插件来协助打包。

# loader
不同的 loader 会有不同的功能，但是主要功能都是用来转换和处理代码，配置规则：
>test: 匹配规则，使用正则来判断文件后缀名
use: 使用的 loader 名称，
options: 为 loader 进行配置选项（非必须）

# plugin
插件使用需要先进行安装，在配置文件里使用 `new` 关键字配置生成插件常用插件有：
- `HtmlWebpackPlugin`：自动生成 `index.html` 并且自动引入 js 文件，可用来做长缓存（持久缓存）；
- `HotModuleReplacement`: 实时热更新插件；
- `cleanWebpackPlugin`: 每次构建时自动清理 dist 目录

# webpack 打包优化
### 优化打包体积
- 使用 uglyfy 进行代码压缩，多入口情况下使用 commonsChunk 分离第三方代码
- 按需加载，代码压缩，代码分割（code splitting）,CDN 优化，gzip 加速
- Tree-shaking 过滤多余的代码

# HMR 原理
基于 `webpack-dev-server` 
- 第一步：webpack 对文件系统进行 watch 打包到内存中
- 第二步：文件发生改变，webpack-dev-server 监听到变更，找到相应的模块，；
- 第三步：webpack-dev-server 将变更的模块通知到浏览器，在服务器与浏览器之间建立了一个 webSocket 长链接，来与浏览器进行交流；
- 第四步：浏览器根据 websocket 接收到 hash，重新请求更新模块的 chunk
- 最后，浏览器加载 chunk ,并使用新模块代替旧模块，删除之前的缓存。 

