let obj = {
  a: 1,
  b: {
    c: 2
  },
  d: 3
}

function defineReactive(data, key, val = data[key]) {
  Object.defineProperty(data, key, {
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
defineReactive(obj, 'a')
obj.a = 1220;
console.log(obj.a);