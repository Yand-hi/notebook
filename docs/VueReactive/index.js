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
  d: [1,2,3,4,
    {
      name: 'xxx', 
      age: {
        a: 1,
        v: 2
      }
    }]
}

observe(obj);
obj.d.push(1111);
console.log(obj);