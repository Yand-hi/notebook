## any 和 unknown
>`any` 和 `unknown` 都是顶级类型，任意类型得知都可以设置为`any` 或者 `unknown`
```ts
const foo:any = 'hello'
const bar:unknown = 123
// 不报错
```
### 区别
`unknown` 比 `any` 类型检查更严格，`any` 不做任何类型检查
```ts
const value:unknown = 'hello'
const str:string = value
// 报错，不能将类型“unknown”分配给类型“string”
```
```ts
const value:unknown = 'hello'
const str:string = value as string
// as 断言后，不会报错
```
*优先使用 unknown，尽量避免使用 any*
## never
`never` 是一个保底类型，表示任何时候都不能出现的类型
```ts
interface A {
    type: 'a'
}
interface B {
    type: 'b'
}
type All = A | B
function handleValue(val:All) {
    switch (val.type) {
        case 'a':
            // val 类型为 A
            break;
        case 'b':
            // val 类型为 B
            break;
        default:
            // val 类型为 never
            break;
    }
}
```
