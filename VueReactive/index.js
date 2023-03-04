import { observe } from "./observe.js";

let obj = {
  a: 1,
  b: {
    m: {
      n: 2,
    },
    p: {
      q: {
        j: 'asd'
      }
    }
  },
  c: 3,
  d: [1,2,3,4,{name: 'xxx'}]
}

observe(obj)
obj.d.splice(1, 2);
console.log(obj);