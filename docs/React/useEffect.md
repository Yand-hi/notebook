### useEffect
`useEffect` 用来执行副作用操作，副作用可以理解为对环境做出影响的操作，比如数据获取，设置订阅以及手动更改 React 组件中的 DOM 都属于副作用；
可以把 useEffect Hook 看做 componentDidMount，componentDidUpdate 和 componentWillUnmount 这三个函数的组合。
在每次 render 完毕后根据依赖确定是否执行。
```js
useEffect(() => {
    // deps 依赖发生改变后执行
  }, deps);
```
### 用途
#### 作为 componentDidMount 使用
```js
useEffect(() => {
    console.log('我执行了')
    // 每次初始化组件时执行一次，之后不会执行
  }, []);
```
#### 作为 componentDidUpdate 使用
```js
useEffect(() => {
    console.log('n 变化了')
    // 每次 n 发生改变都会执行一次
  }, [n]);
```
如果不传入依赖
```js
useEffect(() => {
    console.log('我执行了')
    // 组件内每个状态改变都会执行
  });
```
#### 作为 componentWillUnmount 使用
```js
useEffect(() => {
    return () => {
        console.log('我执行了')
    // 每次组件将要卸载时执行
    }
  },[]);
```
*如果同时存在多个 useEffect，会按照出现的顺序依次执行*
### useLayoutEffect
会先于 `useEffect` 执行，在 DOM 变更之后，浏览器绘制页面之前执行，所以会阻塞初始数据的渲染，不会产生视觉上的更新。
```js
//  div 内部 n 初始值为 0，刷新后
//  n => 0 => 1000
useEffect(() => {
    document.querySelector('div').innerText = 1000
}, [n])

//  n => 1000
useLayoutEffect(() => {
    document.querySelector('div').innerText = 1000
}, [n])
```
执行顺序
> App() => 执行 => 产生 VDOM => 
DOM(div.innerText = 0; div.innerText = 1000) => 
(useLayoutEffect) => 改变样式内容(render 完毕) => (useEffect)

*为了用户体验，不阻塞试图更新，降低延迟，优先使用  useEffect (优先渲染)*




