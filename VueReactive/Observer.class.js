import { defineReactive } from "./defineReactive.js";
import { arrayMethods } from "./array.js";
import { def } from "./utils.js";

export class Observer {
  constructor(value) {
    def(value, '__ob__', this, false);
    if (Array.isArray(value)) {
      Object.setPrototypeOf(value, arrayMethods);      
    } else {
      this.walk(value);
    }
  }
  walk(value) {
    for (let k in value) {
      console.log(k); 
      defineReactive(value, k);
    }
  }
}