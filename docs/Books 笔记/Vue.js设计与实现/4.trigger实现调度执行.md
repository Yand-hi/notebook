# 响应式需要实现可调度性
可调度性是响应系统非常重要的特性。所谓可调度，指的是当 trigger 动作触发副作用函数重新执行时，有能力决定副作用函数执行的时机、次数以及方式。

简言之，trigger 触发副作用函数时要实现可控制性，那么注册副作用函数时就要进行相应的配置；

## 控制执行顺序
```js
 const data = { foo: 1 }
 const obj = new Proxy(data, { /* ... */ })

 effect(() => {
   console.log(obj.foo)
 })

 obj.foo++

 console.log('结束了')
```
打印顺序为 `1; 2; 结束了`，如果想要输出结果为 `1; 结束了；2`，如何实现？

就需要在注册副作用函数时，添加一个选项参数 options, 包括一个调度器 `scheduler`，比如这样：
```js
 effect(
   () => {
     console.log(obj.foo)
   },
   // options
   {
     // 调度器 scheduler 是一个函数
     scheduler(fn) {
       // ...
     }
   }
 )
```
effect 函数修改如下：
```js
function effect(fn, options = {}) {
  // 包装 effectFn
  const effectFn = () => {
    // 切换分支时清除遗留的副作用，重新收集
    cleanup(fn);
    activeEffect = effectFn;
    // 副作用压栈
    effectStack.push(effectFn);
    // 执行传进来的真正的副作用函数，实现依赖收集
    fn();
    // 副作用函数弹栈
    effectStack.pop();
    // activeEffect 始终指向副作用栈顶
    activeEffect = effectStack[effectStack.length - 1];
  }
  // 将 options 挂在 effectFn 身上
  effectFn.options = options;
  // 用来保留副作用函数关联的依赖集合
  effectFn.deps = [];
  effectFn();
}
```
trigger 函数修改如下：
```js
function trigger(target, key) {
  // 获取到 target 对应的 Map
  const depsMap = bucket.get(target);
  if(!depsMap) return;
  // 获取到 key 对应的依赖（副作用函数）集合
  const effects = deps.get(key);

  // 用来保存遍历执行之前的依赖集合，否则长度变化遍历会死循环
  const effectsToRun = new Set();
  effects && effects.forEach(effectFn => {
    // 避免无限递归循环
    if(!effectFn === activeEffect) {
      effectsToRun.add(effectFn);
    }
  })

  effectsToRun.forEach(effectFn => {
    if(effectFn.options.scheduler) {
      // 存在调度器则执行其调度器，并将该副作用函数作为其参数
      effectFn.options.scheduler(effectFn);
    } else {
      // 否则直接执行
      effectFn();
    }
  })
}
```
至此，就可以通过配置 options 参数的调度器来实现控制 trigger 触发执行的顺序：
```js
const data = { foo: 1 }
const obj = new Proxy(data, { /* ... */ })

effect(
  () => {
    console.log(obj.foo)
  },
  {
    scheduler(fn) {
      // 将副作用函数的触发执行放在宏任务队列中执行
      setTimeout(fn)
    }
  }
)
```
最终执行顺序 `1; 执行了; 2`

## 控制执行次数
```js
const data = { foo: 1 }
const obj = new Proxy(data, { /* ... */ })

effect(() => {
  console.log(obj.foo)
})

obj.foo++
obj.foo++
```
    当前执行输出依次为1，2，3，
    如果需要后续的修改 obj.foo 只触发一次呢？即只打印出 1，3，中间的重复过程不重复触发执行
    这就要通过调度器去控制执行次数

修改如下：
```js
// 定义一个任务队列
const jobQueue = new Set()
// 使用 Promise.resolve() 创建一个 promise 实例，我们用它将一个任务添加到微任务队列
const p = Promise.resolve()
// 一个标志代表是否正在刷新队列
let isFlushing = false
function flushJob() {
  // 如果队列正在刷新，则什么都不做
  if (isFlushing) return
  // 设置为 true，代表正在刷新
  isFlushing = true
  // 在微任务队列中刷新 jobQueue 队列
  p.then(() => {
    jobQueue.forEach(job => job())
  }).finally(() => {
    // 结束后重置 isFlushing
    isFlushing = false
  })
}
effect(() => {
  console.log(obj.foo)
}, {
  scheduler(fn) {
    // 每次调度时，将副作用函数添加到 jobQueue 队列中
    jobQueue.add(fn)
    // 调用 flushJob 刷新队列
    flushJob()
  }
})
obj.foo++
obj.foo++
```

- 首先，我们定义了一个任务队列 jobQueue，它是一个 Set 数据结构，目的是利用Set 数据结构的自动去重能力。
- 接着我们看调度器 scheduler 的实现，在每次调度执行时，先将当前副作用函数添加到 jobQueue 队列中，再调用 flushJob 函数刷新队列。
- 然后我们把目光转向flushJob 函数，该函数通过 isFlushing 标志判断是否需要执行，只有当其为 false 时才需要执行，
- 而一旦 flushJob 函数开始执行，isFlushing 标志就会设置为 true，意思是无论调用多少次 flushJob 函数，在一个周期内都只会执行一次。
- 需要注意的是，在 flushJob 内通过 p.then 将一个函数添加到微任务队列，在微任务队列内完成对 jobQueue 的遍历执行。

连续对 obj.foo 执行两次自增操作，会同步且连续地执行两次 scheduler 调度函数，这意味着同一个副作用函数会被 jobQueue.add(fn) 语句添加两次，但由于 Set 数据结构的去重能力，最终 jobQueue 中只会有一项，即当前副作用函数。类似地，flushJob 也会同步且连续地执行两次，但由于 isFlushing 标志的存在，实际上 flushJob 函数在一个事件循环内只会执行一次，即在微任务队列内执行一次。当微任务队列开始执行时，就会遍历 jobQueue 并执行里面存储的副作用函数。由于此时 jobQueue 队列内只有一个副作用函数，所以只会执行一次，并且当它执行时，字段obj.foo 的值已经是 3 了