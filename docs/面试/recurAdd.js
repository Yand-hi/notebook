function add(arr) {
  
  function fn(i) {
    return i < arr.length ? arr[i] + fn(i + 1) : 0
  }

  return fn(0)
}

const r = add([1,2,3,4,5]);
console.log(r)