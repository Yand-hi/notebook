import { defineReactive } from "./defineReactive.js";
import { arrayMethods } from "./array.js";
import { observe } from "./observe.js";
import { Dep } from "./dep.class.js";
import { def } from "./utils.js";

export class Observer {
  constructor(value) {
    this.dep = new Dep();
    def(value, '__ob__', this, false);
    if (Array.isArray(value)) {
      Object.setPrototypeOf(value, arrayMethods);
      this.observeArray(value);
    } else {
      this.walk(value);
    }
  }
  walk(obj) {
    for (let k in obj) {
      defineReactive(obj, k);
    }
  }
  observeArray(array) {
    let l = array.length;
    for (let i = 0; i < l; i++) {
      observe(array[i]);
    }
  }
}