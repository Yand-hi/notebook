都是将值处理成响应式对象，ref 是用于基础类型数据，reactive 用于引用类型
# ref
接受一个内部值并返回一个响应式且可变的 ref 对象。ref 对象仅有一个 .value 属性，指向该内部值。
*使用时需要 .value,在模板中不用*
```js
const count = ref(0)
console.log(count.value)  // 0

count.value++
console.log(count.value)  // 1
```
## unref
如果传入的时一个 ref 对象，则返回其内部的 value 值,否则返回自身。
本质时`val = isRef(val) ? val.value : val`的语法糖
```js
const count = ref(0)
const a = 1
console.log(count)            // {value: 0}
console.log(unref(count))     // 0
console.log(unref(a))         // 1
```
## toRef
传入一个响应式对象和一个该对象上的属性，对这个属性使用 `ref()`，并且使其仍然与源响应式对象保持响应连接。
```js
const obj = reactive({
    a: 1,
    b: 10
})
const a1 = toRef(obj, 'a')  // a1.value = 1
a1.value++       // a1.value = 2, obj.a = 2
obj.a++          // a1.value = 3, obj.a = 3
```
## toRefs
传入一个响应式对象，将其转换成普通对象，并对其每一个属性都使用 `ref()`，并且使其仍然与源响应式对象保持响应式连接。
```js
const obj = reactive({
    a: 1,
    b: 10
})
const obj1 = toRefs(obj)    // obj1.a.value = 1, obj1.b.value = 10
obj.a++             // obj.a = 2, obj1.a.value = 2
obj1.a.value++      // obj1.a.value = 3, obj.a = 3
```
## isRef
```js
const count = ref(0)    // isRef(count) = > true
const a = 1             // isRef(a) = > false
```
## customRef
`customRef` 函数可以自定义一个 ref，显示地控制其依赖追踪与更新触发响应；
- 自定义一个函数，并且 `return customRef((track, trigger))` 
- track 用来追踪依赖，trigger 触发更新响应
- customRef 函数返回一个 get 和 set
- get 中显示调用 track 进行依赖追踪
- 调用 set 中修改数据，触发 trigger 更新视图
*使用 customRef 自定义一个防抖函数*
```vue
<template>
  <h1>{{ msg }}</h1>
  <input v-model="msg">
</template>

<script setup>
import { customRef } from 'vue'
function useDebouncedRef(value, time = 1000) {
  let timer
  return customRef((track, trigger) => {
    return {
      get() {
        track()         // 收集依赖
        return value
      },
      set(newValue) {
        clearTimeout(timer)
        timer = setTimeout(() => {
          value = newValue
          trigger()     // 更新视图
        }, time)
      }
    }
  })
}
const msg =  useDebouncedRef('0')
</script>
```
