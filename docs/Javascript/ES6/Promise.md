Promise 对象用于表示一个异步操作最终的结果与它的状态（fulfilled，rejected）

解决了传统异步任务嵌套造成的回调地狱问题

### 特点
- 只要定义，将来就一定会完成，即（期约，承诺）

- 可以记录异步任务的执行状态

- 状态不可逆，只存在以下情况
    resolve() :   pending => fulfilled
    reject() :    pending => rejected

可以通过 .then() 进行调用，由于 .then() 同样返回一个 pending 状态中的 Promise，所以可以继续 .then()，即链式调用，.catch() 同理

```js
const a = new Promise((resolve,reject)=>{
  resolve(777)
})
a.then((val)=>{
  console.log('你是:', val)
})
console.log('hhh')
// hhh
// 你是: 777
```
### Promise.all()
传入一个可迭代类型的值，通常为 promise 数组，返回一个 Promise，这个 promise 的resolve回调执行是在传入的所有promise都为fulfilled状态，或者传入的可迭代值没有promise时才会执行，只要有一个rejected，则它也会抛出错误，且抛出第一个错误，输入的所有 Promise的resolve回调的结果是一个数组
```js
const promise1 = Promise.resolve(3)
const promise2 = 4
const promise3 = new Promise((resolve, reject)=>{
    setTimeout(resolve, 5000, 5)
})
Promise.all([promise1, promise2, promise3])
       .then((res)=>{
           console.log(res)
       })
```
#### 总结（我全都要成功）
所有成功，它才成功； 或者都不是promise，就直接同步返回
一个失败，它就失败； 失败的原因时第一个失败的原因

### Promise.any
与 .all 相反

#### 总结（一个成功就好，保底）
一个成功，它就成功； 
全部失败，它才失败；

### Promise.race

#### 总结（管你成功失败，我只要第一个）

### Promise.allSettled
```js
const promise1 = Promise.resolve(3)
const promise2 = Promise.reject(4)
const promise3 = new Promise((resolve, reject)=>{
    setTimeout(()=>{
      resolve(5)
    },3000)
})
Promise.allSettled([promise1, promise2, promise3])
       .then((res)=>{
           console.log(res)
       })
    //  5 秒后打印出对象数组，里面包含每个promise的结果对象数组 
    //  (3) [{…}, {…}, {…}] 展开如下
    //  {status:'fulfilled', value:3},
    //  {status:'rejected', reason:4},
    //  {status:'fulfilled', value:5}
```

### Promise.prototype.finally()
*和 .then() 很像*

`finally()` 不管前一个是什么状态，它都会执行，所以不确定状态回调就不能传参

`finally()` 方法返回一个 Promise。在 promise 结束时，无论结果是 fulfilled 或者是 rejected，都会执行指定的回调函数。这为在 Promise 是否成功完成后都需要执行的代码提供了一种方式。
这避免了同样的语句需要在 `then()` 和 `catch()` 中各写一次的情况。
```js
const promise = new Promise((resolve, reject)=>{
    setTimeout(()=>{
      reject('牛皮666')
    },3000)
})
promise.catch(err=>{console.error(err)})
       .finally(()=>{
          console.log('hhh')
       })
       .then((res)=>{
         console.log(res)
       })
    //  Error:牛皮666
    //  hhh
    //  undefined
```

如果你想在 promise 执行完毕后无论其结果怎样都做一些处理或清理时，finally() 方法可能是有用的。
