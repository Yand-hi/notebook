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
  // 添加进set代表已经遍历过了
  seen.add(value)

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
## immediate 立即执行的 watch

在 Vue 中可以通过选项 `immediate: true` 来指定回调立即执行：
```js
watch(obj, () => {
  console.log('变化了')
}, {
  // 回调函数会在 watch 创建时立即执行一次
  immediate: true
})
```

将调度器函数重新封装，判断其 immediate 是否为 true 确定执行时机

```js
function watch(source, cb, options = {}) {
  let getter;
  if (typeof(source) === 'function') {
    getter = source;
  } else {
    getter = () => traverse(source);
  }
  
  let newValue, oldValue;
  const job = () => {
    newValue = effectFn();
    // 当 immediate 为 true 时第一次执行时 oldValue 为 undefined
    cb(newValue, oldValue);
    oldValue = newValue;
  }

  const effectFn = effect(
    () => getter(),
    {
      lazy: true,
      schedule: job;
    }
  )

  if (options.immediate) {
    job();
  } else {
    oldValue = effectFn();
  }
}
```

## watch 回调执行时机
除了指定回调函数为立即执行之外，还可以通过 `flush` 选项参数来指定回调函数的执行时机

当 `flush: post` 时，副作用函数执行的时机为 DOM 更新结束之后，就需要将副作用函数放在一个微任务队列中实现异步执行

```js
function watch(source, cb, options = {}) {
  let getter;
  if (typeof(source) === 'function') {
    getter = source;
  } else {
    getter = traverse(source);
  }

  let newValue, oldValue;
  const job = () => {
    newValue = effectFn();
    cb(newValue, oldValue);
    oldValue = newValue;
  }

  const effectFn = effect(
    () => getter();
    {
      lazy: true;
      schedule: () => {
        const p = Promise.resolve();
        if (options.flush === 'post') {
          p.then(job);
        } else {
          job();
        }
      }
    }
  )

  if (options.immediate) {
    job();
  } else {
    oldValue = effectFn();
  }
}
```

## watch 处理过期的副作用
当 watch 的回调函数是异步请求时，无法保证每次回调的执行顺序与返回结果的顺序保持一致；

```js
let data;

watch(obj, async () => {
  // 发送并等待网络请求
  const res = await fetch('/path/to/request')
  // 将请求结果赋值给 data
  data = res
})
```
当连续多次修改obj的属性时，触发多次watch回调，每个回调函数都是异步请求，无法保证最终的data就是最后一次请求返回的结果；

:::tip
这种问题就是典型的竞态问题，即当一个系统或进程的输出依赖于不受控制的事件出现的顺序。解决的方法一般有：
1：取消上一次请求，保证最新的请求任务即可；
2：使用过期变量来标记上一次请求，最终判断是否过期来进行赋值。
:::

watch 函数的回调函数接收第三个参数 onInvalidate，它是一个函数，类似于事件监听器，可以使用 onInvalidate 函数注册一个回调，这个回调函数会在当前副作用函数过期时执行：

```js
watch(obj, async (newValue, oldValue, onInvalidate) => {

  let expired = false; // 未过期

  onInvalidate(() => {
    expired = true; // 标记为过期
  })
  const res = await fetch('/path/to/request')
  // 未过期则将请求结果赋值给 data
  if (!expired) {
    data  = res
  }
})
```
实现思路为再每次副作用函数执行之前先执行用户通过 onValidate 传递的过期回调，具体实现如下：

```js
function watch(source, cb, options = {}) {
  let getter;
  if (typeof(source) === 'function') {
    getter = source;
  } else {
    getter = traverse(source);
  }

  let cleanup;
  function onInvalidate(fn) {
    cleanup = fn;
  }

  let newValue, oldValue;
  const job = () => {
    newValue = effectFn();

    // 调用 cb 之前，先调用过期回调函数；
    if (cleanup) {
      cleanup();
    }
    cb(newValue, oldValue);
    oldValue = newValue;
  }

  const effectFn = effect(
    () => getter();
    {
      lazy: true;
      schedule: () => {
        const p = Promise.resolve();
        if (options.flush === 'post') {
          p.then(job);
        } else {
          job();
        }
      }
    }
  )

  if (options.immediate) {
    job();
  } else {
    oldValue = effectFn();
  }
}
```