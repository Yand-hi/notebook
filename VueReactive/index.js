import { defineReactive } from "./defineReactive.js";
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
  c: 3
}

observe(obj)
obj.b;
console.log(obj);