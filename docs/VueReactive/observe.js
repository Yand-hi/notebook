import { Observer } from "./Observer.class.js";

export function observe(value) {
  if (typeof value === 'object') {
    let ob;
    if (value.__ob__) {
      ob = value.__ob__;
    } else {
      ob = new Observer(value);
    }
    return ob
  }
}