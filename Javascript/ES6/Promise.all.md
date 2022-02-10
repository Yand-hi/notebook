# 手写 `Promise.all`

题目如下，要求打印出 `['p1', 'p2', 'p3']`
```js
function PromiseAll(promiseArray) {

    //   补全代码

}

function delay(data) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(data)
        }, Math.random() * 1000)
    })
}

const p1 = delay('p1')
const p2 = delay('p2')
const p3 = delay('p3')

PromiseAll([p1, p2, p3])
    .then(data => console.log(data))
    .catch(err => console.log(err))

  // 期待结果为 ['p1', 'p2', 'p3']
```
由于只考虑传入为数组的情况，结果如下
```js
function PromiseAll(promiseArray) {
    return new Promise((resolve, reject) => {
        const promiseResult = []
        let counter = 0
        for (let i = 0; i < promiseArray.length; i++) {
            promiseArray[i]
                .then(data => {
                    promiseResult[i] = data
                    counter++
//  这里不能直接使用 promiseResult.length 进行比较，因为不能保证 promiseArray[i] 执行完毕的顺序
                    if (counter === promiseArray.length) {
                        resolve(promiseResult)
                    }
                })
                .catch(err => reject(err))
        }
    })
}

//  ['p1', 'p2', 'p3']
```
