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
    original.apply(this, [...arguments]);
    const {__ob__} = this;
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
      __ob__.observeArray(inserts);
    }
  }, false)
})


export {arrayMethods};