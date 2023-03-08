import { def } from "./utils.js";

const arrayPrototype = Array.prototype;
const arrayMethods = Object.create(arrayPrototype);
const arrayChangedMethods = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse',
]

arrayChangedMethods.forEach(method => {
  const original = arrayPrototype[method];
  def(arrayMethods, method, function() {
    const result = original.apply(this, [...arguments]);
    const {__ob__: ob} = this;
    let inserts;
    switch (method) {
      case 'push':
      case 'unshift':
        inserts = [...arguments];
        break;
      case 'splice':
        inserts = [...arguments].slice(2);
      default:
        break;
    }
    if (inserts) {
      ob.observeArray(inserts);
    }
    ob.dep.notify();
    return result;
  }, false)
})


export {arrayMethods};