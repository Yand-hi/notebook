### isNaN()
返回 bool 值，判断是否为 NaN 值

### isFinite()
返回 bool 值，判断是否为有限数

### isInteger()
返回 bool 值，判断数字是否为整数
```js
    Number.isInteger(123.0)
    //  true
```

### parseFloat & parseInt
*全局函数，不属于任何对象*
- parseFloat(string) 转换成浮点数，v-model修饰符.number就用的这个；
- parseInt(string) 转换为整数


### BigInt 大整形
普通数字后面加个 n 定义一个 BigInt;

```js
typeof BigInt('1') === 'bigint'
    //   true

0n === 0
    //   false

0n == 0
    //   true
```