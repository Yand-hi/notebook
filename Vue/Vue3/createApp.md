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