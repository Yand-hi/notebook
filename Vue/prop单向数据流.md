### 单向下行绑定

父级 prop 发生改变，子级会更新，子级不可以更改父级的 prop，这样会防止从子组件意外变更父级组件的状态，从而导致你的应用的数据流向难以理解。

### 想改怎么办？
1. 拷贝 prop 的原始值作为本地的 data 即可
```js
props: ['title'],
data() {
  return {
    myTitle: this.title
  }
}
```
2. 这个 prop 以一种原始的值传入且需要进行转换，将父级传来的 prop 值通过一个计算属性进行转换
```js
props: ['age'],
computed: {
  numAge() {
    return this.age.trim().toLowerCase()
  }
}
```
数组与对象是引用类型数据，无法直接修改 prop