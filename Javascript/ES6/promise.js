class MyPromise {
    successQueue = []
    filedQueue = []
    constructor(fn) {
        const resolve = () => {
            setTimeout(() => {
                for (let i = 0; i < this.successQueue.length; i++) {
                    this.successQueue[i]()
                }
            })
        }
        const reject = () => {
            setTimeout(() => {
                for (let i = 0; i < this.filedQueue.length; i++) {
                    this.filedQueue[i]()
                }
            });
        }
        fn(resolve, reject)
    }
    then(s, f) {
        this.successQueue.push(s)
        this.filedQueue.push(f)
        return this
    }
}

const p1 = new MyPromise((resolve, reject) => {
    const time = Math.random()
    if (time > 0.5) {
        console.log('hi')
        resolve()
    } else {
        console.log('error')
        reject()
    }
})
p1.then(
    () => { console.log('成功') },
    () => { console.log('失败') }
).then(
    () => { console.log(666) }, 
    () => { console.log(777) }
)