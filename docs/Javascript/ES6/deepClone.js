function deepClone(obj, hashMap = new WeakMap()) {
  let target;
  if (hashMap.get(obj)) {
    return hashMap.get(obj)
  }
  if (obj instanceof Date) {
    target = new Date(obj)
  }
  if (obj instanceof RegExp) {
    target = new Date(RegExp)
  }
  if (typeof obj === 'object' && obj !== null) {
    target = new obj.constructor();
    hashMap.set(obj, target)
    for (const key in obj) {
      if (Object.hasOwnProperty.call(obj, key)) {
        target[key] = deepClone(obj[key], hashMap)
      }
    }
  } else {
    target = obj
  }

  return target;
}

let test1 = {};
let test2 = {};
test1.test2 = test2;
test2.test1 = test1;

console.log(deepClone(test2))