### useState
在 React 函数组件中存储内部 state 通常会使用 useState hook 传入一个初始值，在初次渲染时创建 state，之后会返回当前的 state。
```js
const [state, setState] = useState(initialState)
```
下面是一个点击+1的 demo
```js
function App() {
  const [n, setN] = useState(0);
  return (
    <div className="App">
      <p>{n}</p>
      <p>
        <button onClick={() => setN(n + 1)}>+1</button>
      </p>
    </div>
  )
}
```

- useState 接收一个初始值，返回一个length 为2 的数组；
- 数组第一项首次渲染时与初始值相等，第二项为一个函数，接收一个新的值或者函数，将新的值设置为新的 state
- useState 声明在函数组件顶层，每次渲染都会执行
知道原理之后，实现一个简易版的 useState
### 实现一个简单的 useState
```js
let state
const myUseState = (initialState) => {
    state = state === undefined ? initialState : state
    const setState = (newState) => {
        state = newState
        // 执行渲染函数
    }
    return [state, setState]
}
```
这样写组件只能初始化一个变量，如果有多个怎么办？
```js
let state = []
let index = 0  // 使用 index 来记录组件内 useState 顺序
const myUseState = (initialState) => {
    let currentIndex = index
    state[currentIndex ] = state[currentIndex ] === undefined ? initialState : state[currentIndex ]
    const setState = (newState) => {
        state[currentIndex ] = newState
        index = 0  // 重置 index
        // 执行渲染函数
    }
    index++  
    return [state[currentIndex ], setState]
 }
```
每次组件渲染，执行 myUseState，如果没有触发 setState 函数，则会将初始值赋值给 state，执行  setState 后组件会再此渲染一次，此时 产生一个新的 state，值为 newState，然后将这个新的 state 返回。所以，setState 并不会改变原有的 state，而是产生一个新的 state。

如果组件内有多个 useState
- 通过 index 可以记录 useState 的顺序；
- 每次渲染都是产生新的 state[currentIndex] 
- 每次渲染 useState 的顺序不能发生改变，所以不能在条件语句中使用 useState
- setState 并不会改变原有的 state，而是产生一个新的 state.
### useReducer
```js
const [state, dispatch] = useReducer(reducer, initialArg, init);
```
useReducer 接收一个形如 `(state, action) => newState` 的 reducer，并返回当前的 state 以及与其对应的 dispatch 方法；

如果 state 逻辑较复杂且包含多个子值，或者下一个 state 依赖于之前的 state 时，useReducer 比 useState 更加适用。
```js
const initialState = {n: 0}
const reducer = (state, action) => {
  switch (action.type) {
    case '+':
        return {n: state.n + 1};
    case '-':
        return {n: state.n - 1};
    default:
      alert('unknow type')
      break;
  }
}
function App() {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <div className="App">
      <h1>n: {state.n}</h1>
      <button onClick={() => dispatch({type: '+'})}>+1</button>
      <button onClick={() => dispatch({type: '-'})}>-1</button>
    </div>
  );
}
```
使用 useReducer 步骤：
- 创建初始值：initialState ；
- 创建所有操作内容：reducer；
- 传入 useReducer 函数中，返回相应的读写；
- 使用 dispatch 传入对应的 action 的 type 实现对 state 的操作。
