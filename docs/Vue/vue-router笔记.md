## Vue-Router 

### 动态路由匹配

每次成功导航后都会产生一个新的路由对象，

- 组件内：`this.$route`; 
- 在 `$route` 的观察者回调里; 
- 在 `router.match(loatcion)` 的返回值

##### 路由对象属性

1 
```js
routes:[
		{
			path:'/user/:id',
			component:User
		}
	]
```
* 动态路由参数 user:id ,通过 `this.$route.params` 获取路由参数

2 
```js
routes:[
		{
			path:'/user?id',
			component:User
		}
	]
```
* 动态路由参数 /user?id=1 ,通过 `this.$route.query` 查询路由参数


* `this.$route.path` 对应当前路由的路径，解析为绝对路径

* `rhis.$route.hash` 当前路由的 hash 值（带 #），如果没有 hash ,则为空字符串

##### 捕获路由
```js
	{
		path:'/user-*'
	}
```
* `this.$route.params.pathMatch` 包含了 URL 通过通配符匹配的部分


#### 路由导航

* `$router` 访问路由器 ，`$route` 访问当前路由对象

* `<rouer-view />` 顶层入口，渲染最高级路由匹配到的组件。同样地，一个被渲染组件同样可以包含自己的嵌套 `<router-view>`

* 以 `/` 开头的嵌套路径会被当作根路径。

* `<router-link to=""/>` 会在内部调用 `$router.push()`

* `router.replace` 跟 `router.push` 很像，唯一的不同就是，它不会向 history 添加新记录，而是跟它的方法名一样 —— 替换掉当前的 history 记录。


#### hash & history

* `Vue-Router` 默认 hash 模式，使用 URL 的 hash 模拟一个完整的 URL ，当 URL 改变时，页面不会重新加载

* history 模式，利用 `history.pushState` 来完成URL跳转无需重新加载页面，URL没有 `#`。

* history 模式需要后台配置支持，增加一个覆盖所有情况的候选资源，如果匹配不到任何资源就返回同一个 `index.html`,这样以后服务器就不会返回404页面了，所以需要在 router 实例里再给出一个404页面。

#### 导航守卫
** “导航”表示路由正在发生改变。**
* 参数或查询的改变并不会触发进入/离开的导航守卫

1. 全局前置守卫
`to`即将进入的路由；`from`当前导航正要离开的路由；`next`调用此方法resolve这个钩子
```js
const router = new VueRouter({ ... })

router.beforeEach((to, from, next) => {
  // ...
})
```
当一个导航触发时，全局前置守卫按照创建顺序调用。守卫是异步解析执行，此时导航在所有守卫 resolve 完之前一直处于 等待中。

* 确保 next 函数在任何给定的导航守卫中都被严格调用一次。它可以出现多于一次，但是只能在所有的逻辑路径都不重叠的情况下，否则钩子永远都不会被解析或报错。
用户未登录状态路由跳转至 login 例子：
```js
router.beforeEach((to, from, next) => {
  if (to.name !== 'Login' && !isAuthenticated) next({ name: 'Login' })
  else next()
})
```
2. 组件内守卫
`beforeRouterEnter`; `beforeRouterUpdate`; `beforeRouterLeave`
```js
  beforeRouteEnter(to, from, next) {
    // 在渲染该组件的对应路由被 confirm 前调用
    // 不！能！获取组件实例 `this`
    // 因为当守卫执行前，组件实例还没被创建
  },
  beforeRouteUpdate(to, from, next) {
    // 在当前路由改变，但是该组件被复用时调用
    // 举例来说，对于一个带有动态参数的路径 /foo/:id，在 /foo/1 和 /foo/2 之间跳转的时候，
    // 由于会渲染同样的 Foo 组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。
    // 可以访问组件实例 `this`
  },
  beforeRouteLeave(to, from, next) {
    // 导航离开该组件的对应路由时调用
    // 可以访问组件实例 `this`
  }
```
* `beforeRouteEnter`不能访问该组件的 this，因为该组件实例在此时还未被创建，可以通过 `next` 执行回调，将组件实例作为回调参数传入
```js
beforeRouteEnter (to, from, next) {
  next(vm => {
    // 通过 `vm` 访问组件实例
  })
}
```
`beforeRouteEnter` 是支持给 next 传递回调的唯一守卫。





