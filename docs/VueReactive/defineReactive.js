import { Dep } from "./dep.class.js";
import { observe } from "./observe.js";

export function defineReactive(data, key, val = data[key]) {
  const dep = new Dep();
  const childOb = observe(val);

  Object.defineProperty(data, key, {
    enumerable: true,
    configurable: true,
    get() {
      console.log('getter 你访问了' + key +'属性');
      return val;
    },
    set(newVal) {
      if (val !== newVal) {
        console.log('setter 你修改了' + key +'属性');
        observe(newVal);
        val = newVal;
      }
      console.log(data);
      dep.notify();
    }
  })
}
