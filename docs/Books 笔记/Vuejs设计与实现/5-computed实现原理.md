# computed 
接受一个 `getter` 函数，返回一个只读的响应式 `ref` 对象。该 `ref` 通过 .value 暴露 `getter` 函数的返回值。它也可以接受一个带有 get 和 set 函数的对象来创建一个可写的 `ref` 对象。

```js
const count = ref(1)
const plusOne = computed(() => count.value + 1)

console.log(plusOne.value) // 2
```

这是官网的对计算属性 `computed` 的解释，那么它是怎么实现的呢？

# computed 实现思路
`computed` 函数是基于其依赖值的变化来触发执行的，并非像 `effect` 那样立即执行，所以就要配合 `scheduler` 调度器来控制副作用函数的执行时机.

通过在调度器中指定 lazy 属性来控制：
```js
effect(
  // 指定了 lazy 选项，这个函数不会立即执行
  () => {
    console.log(obj.foo)
  },
  // options
  {
    lazy: true
  }
)
```
修改 `effect` 函数来实现区分：

```js
function effect(fn, options = {}) {
  const effectFn = () => {
    cleanup(fn);
    activeEffect = effectFn;
    effectStack.push(effectFn);
    // 保留 fn 执行的结果
    const res = fn();
    effectStack.pop();
    activeEffect = effectStack[effectStack.length - 1];
    // 延迟执行 effectFn 时可以获取到 fn 结果
    return res
  }
  effectFn.deps = [];
  // 添加 options
  effectFn.options = options;
  if(!effectFn.options.lazy) {
    effectFn();
  }
  // 函数柯里化，延迟执行副作用函数
  return effectFn
}
```

```js
 const effectFn = effect(
   // getter 返回 obj.foo 与 obj.bar 的和
   () => obj.foo + obj.bar,
   { lazy: true }
 )
 // value 是 getter 的返回值
 const value = effectFn()
```
这样就实现了延迟执行副作用函数，返回了这个副作用函数，在合适的时机进行执行；

现在已经能够实现懒执行的副作用函数，并且能够拿到副作用函数的执行结果了，接下来就可以实现计算属性了:

```js
function computed(getter) {
  // 把 getter 作为副作用函数，创建一个 lazy 的 effect
  const effectFn = effect(getter, {
    lazy: true
  })
  const obj = {
    // 当读取 value 时才执行 effectFn
    get value() {
      return effectFn()
    }
  }
  return obj
}
```
computed 函数的执行会返回一个对象，该对象的 value 属性是一个访问器属性，只有当读取 value 的值时，才会执行 effectFn 并将其结果作为返回值返回。

## 基于依赖变化执行
上面的代码多次访问 sumRes.value 的值，每次访问都会调用 effectFn 重新计算，所以要想只有在其依赖发生变化时出发执行就要进行修改：

```js
function computed(getter) {
  // 缓存上一次执行的结果，当 dirty 为 false 时直接返回上一次缓存结果
  let value;
  // 用来标识是否需要重新计算 true 为脏值需要重新计算
  let dirty = true;
  const effectFn = effect(getter, {
    lazy: true,
    scheduler() {
      // 当依赖变化时会执行调度器将 dirty 重新置为 true，对新值进行缓存
      if(!dirty) {
        dirty = true;
      }
    }
  })
  const obj = {
    get value() {
      if(dirty) {
        value = effectFn();
        // dirty 置为 false，下一次从缓存中读取值
        dirty = false;
      }
      return value;
    }
  }
  return obj
}
```
## 解决 effect 嵌套 computed 问题
```js
const sumRes = computed(() => obj.foo + obj.bar)

effect(() => {
  // 在该副作用函数中读取 sumRes.value
  console.log(sumRes.value)
})

// 修改 obj.foo 的值
obj.foo++
```
当修改 obj.foo 时并不会触发外层 effect 重新执行

本质上看这就是一个典型的 effect 嵌套。一个计算属性内部拥有自己的 effect，并且它是懒执行的，只有当真正读取计算属性的值时才会执行。对于计算属性的 getter 函数来说，它里面访问的响应式数据只会把 computed 内部的 effect 收集为依赖。而当把计算属性用于另外一个 effect 时，就会发生 effect 嵌套，外层的 effect 不会被内层 effect 中的响应式数据收集。

本质是由于计算属性sumRefs并没有像之前的副作用函数依赖的对象那样被 proxy  过，他的getter里是没有track依赖收集的过程，所以外层副作用函数没办法被添加到依赖集合里，所以在getter里手动执行 `track(obj， “value”)` 收集依赖吧外层副作用收集到 `bucket.get(obj)` 中，在调度器里手动 `trigger(obj, “value”)`，遍历依赖集合也就包含外层副作用函数了。

# 最终实现
```js
function computed(getter) {
  let value
  let dirty = true

  const effectFn = effect(getter, {
    lazy: true,
    scheduler() {
      if (!dirty) {
        dirty = true
        // 当计算属性依赖的响应式数据变化时，手动调用 trigger 函数触发响应
        trigger(obj, 'value')
      }
    }
  })

  const obj = {
    get value() {
      if (dirty) {
        value = effectFn()
        dirty = false
      }
      // 当读取 value 时，手动调用 track 函数进行追踪
      track(obj, 'value')
      return value
    }
  }

  return obj
}
```
最终建立起的依赖关系如下：
```
 computed(obj)
     └── value
         └── effectFn
```