### Array.prototype.reduceRight
```js
//  反转字符串

const reverseString = (string) => string.split('').reverse().join('')

const reverseString = (string) => [...string].reduceRight((acc, cur) => acc + cur);
```