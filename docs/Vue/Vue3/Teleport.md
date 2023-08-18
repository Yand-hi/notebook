# Teleport
将组件模板中的一部分逻辑移到 DOM 中或者 Vue 实例之外的其他位置，常用于创建一个 Dialog

比如组件内有需求需要通过点击按钮创建一个模态框，通过 css 进行定位会很复杂，需要设置 `position:absolute` 和父级以上元素设置配合定位，但是在组件模板中div是深度嵌套的,`z-index` 设置层叠关系；

```html
<teleport to="body">
    <!-- 告诉 Vue “将这个 HTML 传送到‘body’标签下”。 -->
</teleport>
```

Teleport 允许我们控制在 DOM 中哪个父节点下渲染了 HTML，而不必求助于全局状态或将其拆分为两个组件。

此时里面的 html 元素直接渲染在 body 下，与 `<div id="app">` 平起平坐，可以直接相对 body 进行定位，方便了很多。