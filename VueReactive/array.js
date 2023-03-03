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
    console.log(111);
  }, false)
})


export {arrayMethods};