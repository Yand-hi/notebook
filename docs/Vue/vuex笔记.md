### Vuex

* 全局状态管理模式
```js
	Vue.use(Vuex)

	const store = new Vuex.Store({
	  state: {
		count: 0
	  },
	  mutations: {
		increment (state) {
		  state.count++
		}
	  }
	})
```

#### state

* `this.store.state`获取状态对象，`this.store.commit`触发更新状态
* 在根组件注册 `store` 选项，所有子组件都可以通过 `this.$store` 访问到

#### getter

* Vuex 允许我们在 store 中定义“getter”，可以认为是 store 的计算属性，getter 的结果不再像计算属性一样会被缓存起来
```js
	const store = createStore({
	  state: {
		todos: [
		  { id: 1, text: '...', done: true },
		  { id: 2, text: '...', done: false }
		]
	  },
	  getters: {
		doneTodos: (state) => {
		  return state.todos.filter(todo => todo.done)
		}
	  }
	})
```	
* 通过属性访问
	store.getters.doneTodos // -> [{ id: 1, text: '...', done: true }]
* 通过方法访问
	你也可以通过让 getter 返回一个函数，来实现给 getter 传参。在你对 store 里的数组进行查询时非常有用。
```js
	getters: {
	  // ...
	  getTodoById: (state) => (id) => {
		return state.todos.find(todo => todo.id === id)
	  }
	}

	store.getters.getTodoById(2) // -> { id: 2, text: '...', done: false }
```

#### mutation

* 更改 Vuex 的 store 中的状态的唯一方法是提交 mutation。
```js
	const store = createStore({
	  state: {
		count: 1
	  },
	  mutations: {
		increment (state, payload) {
		  // 变更状态
		  state.count += payload.amount
		}
	  }
	})
```
* 你不能直接调用一个 mutation 处理函数,要唤醒一个 mutation 处理函数，你需要以相应的 type 调用 store.commit 方法：
	`store.commit('increment', {amount: 10})`
* mutation 必须是同步函数

#### action

* Action 提交的是 mutation，而不是直接变更状态。
* Action 可以包含任意异步操作。
* context 是与 store 实例具有相同方法和属性的对象
```js
	actions: {
		increment({commit}) {
			commit('increment')
		}
	}
```
* 触发 action
	`store.dispatch('increment')`
* 组件中触发 action
	`this.$store.dispatch('xxx')`, 
	或在根组件注册 store，使用 mapActions 将组建的methods映射为 store.dispatch 调用
	
#### module