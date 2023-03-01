import { observe } from "./observe.js";

export function defineReactive(data, key, val = data[key]) {
  observe(val),

  Object.defineProperty(data, key, {
    enumerable: true,
    configurable: true,
    get() {
      console.log('getter !!!');
      return val;
    },
    set(newVal) {
      if (val !== newVal) {
        console.log('setter !!!');
        val = newVal;
      }
    }
  })
}
