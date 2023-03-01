import { defineReactive } from "./defineReactive.js";
import { def } from "./utils.js";

export class Observer {
  constructor(value) {
    def(value, '__ob__', this, false);
    this.walk(value);
  }
  walk(value) {
    for (let k in value) {
      console.log(k); 
      defineReactive(value, k);
    }
  }
}