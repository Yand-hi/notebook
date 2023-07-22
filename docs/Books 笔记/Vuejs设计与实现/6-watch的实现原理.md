# watch 的实现原理
watch，其本质就是观测一个响应式数据，当数据发生变化时通知并执行相应的回调函数。

```js
watch(obj, () => {
  console.log('数据变了')
})
// 修改响应数据的值，会导致回调函数执行
obj.foo++
```
## 初步实现
利用 `effect` 以及 `options.scheduler` 实现这一效果

```js
function watch(source, cb) {
  effect(
    // 触发读取 foo, 依赖收集
    () => source.foo,
    // 如果副作用函数存在 scheduler 选项，当响应式数据发生变化时，会触发  scheduler 调度函数执行，而非直接触发副作用函数执行
    options: {
      scheduler() {
        // source.foo 改变时执行回调
        cb()
      }
    }
  )
}
```

:::warning 
目前只针对 foo 属性进行了硬编码，只有 foo 属性改变时才会执行回调函数；
:::

## 解决硬编码问题
在使用一个 getter 触发读取 source 上的属性时可以封装成一个通用的函数；

```js
function watch(source, cb) {
  let getter
  if(typeof source === 'function') {
    getter = source
  } else {
    getter = () => traverse(source)
  }
  effect(
    () => getter(),  
    scheduler() {
      cb()
    }
  )
}

// traverse 实现
function traverse(value, seen = new Set()) {
  // 原始数据类型或者读取过的对象直接返回
  if(typeof value !== 'object' || value === null || seen.has(value) ) return
  seen.set(value)

  for(let key of value) {
    traverse(value[key], seen)
  }

  return value
}
```
首先判断 source 的类型，如果是函数类型，说明用户直接传递了 getter 函数，这时直接使用用户的 getter 函数；如果不是函数类型，那么保留之前的做法，即调用 traverse 函数递归地读取。这样就实现了自定义 getter 的功能

## 实现 newValue 与 oldValue 的传递
通常我们在使用 Vue.js 中的 watch 函数时，能够在回调函数中得到变化前后的值：

```js
watch(
  () => obj.foo, 
  (newValue, oldValue) => {
    console.log(newValue oldValue)
  })
```

可以利用 `effect` 函数的 `lazy` 选项实现获取新值与旧值：

```js
function watch(source, cb) {
  let getter
  if(typeof source === 'function') {
    getter = source
  } else {
    getter = () => traverse(source)
  }
  let newValue, oldValue
  const effectFn = effect(
    () => getter(),
    // 添加 lazy: true 选项后把返回值存储到 effectFn 中随时可以手动调用获取
    // 由于懒执行的特点，在调度器中执行获取到的的是 newValue，之外手动调用获取到的是 oldValue
    { 
      lazy: true,
      scheduler() {
        newValue = effectFn()
        cb(newValue, oldValue)
      }
    }
  )
  oldValue = effectFn()
}
```
