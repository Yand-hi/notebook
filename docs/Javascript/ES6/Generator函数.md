### Generator 对象

普通函数定义时在 `function` 关键字后面添加 `*` 即可声明一个生成器，函数返回一个可迭代对象，函数内部通过 `yield` 关键字来指定调用迭代器的 `next()` 方法时的返回值及返回顺序
```js
function* test() {
    yield 'a'
    yield 'b'
    yield 'c'
}
const g = test()
g           //   test {<suspended>}
g.next()    //  {value: 'a', done: false}
g.next()    //  {value: 'b', done: false}
g.next()    //  {value: 'c', done: false}
g.next()    //  {value: undefined, done: true}
```
生成器函数返回的生成器对象含有 `Symbol.Interator` 属性，可以使用 `for of` 进行遍历
```js
for(value of g) {
  console.log(value)
}
//  a
//  b
//  c
```
*注意*：使用 `for of` 遍历之前如果使用了 `next()` 调用，则只会遍历到未被调用的 `yield` 后的值
```js
g.next()    //  {value: 'a', done: false}
for(value of g) {
  console.log(value)
}
//  b
//  c
```
### next 传参
使用 `next()` 时可以通过传入参数来改变 `yield` 的返回值，如下
```js
function* gen(a) {
    const b = 2 * (yield(a - 1))
    const c = yield(b / 4)
    return (a + b + c)
}
// a = 2
const g = gen(2)
console.log(g.next())   // {value:1, done:false}

// next(6)传入的值为 yield 表达式的值,此时 b = 12
console.log(g.next(6))  // {value:3, done:false}
s4
// next(3)传入的值为 yield 表达式的值,此时 c = 3
console.log(g.next(3))  // {value:17, done:true}
```
### Generator函数嵌套与 `yield*`
定义一个生成函数，如下
```js
function* gen1() {
    yield 2
    yield 3
}
```
如果在 `gen2` 中调用 `gen1` 的 `next()` 结果，需要使用 `for of` 循环 `gen1`
```js
function* gen2() {
    yield 1
    for(value of gen1()) {
        yield value
    }
    yield 4
}
for(value of gen2()){
    console.log(value)
}

// 1 
// 2
// 3
// 4
```
但是这样写会很麻烦，所以可以使用 `yield*` 语法，等同于上面的代码
```js
function* gen2() {
    yield 1
    yield* gen1()
    yield 4
}
```
### 生成器函数的应用
要求使用生成器函数改造以下代码，实现每隔一秒按顺序输出 1，2，3，4，5
```js
for(let i = 0; i <= 5; i++) {
    setTimeout(() => {
        console.log(i)
    },1000)
}
```
改写如下
```js
const delay = n => new Promise(resolve => {
    setTimeout(() => {
        resolve(n)
    },1000)
})
function* g() {
    for(let i = 1; i <= 5; i++) {
        const x = yield delay(i)
        console.log(x)
    }
}
function co(g) {
    const o = g()
    next()
    function next(a) {
        const {value, done} = o.next(a)
        if(done) return
        value.then(data => next(data))
    }
}

co(g)
```