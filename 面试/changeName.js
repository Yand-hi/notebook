function changeName(str) {
  let arr = [];
  str.split('_').forEach((s, index) => {
    index === 0 ? arr.push(s) : 
    arr.push(s[0].toUpperCase() + s.slice(1, s.length))
  });

  return arr.join('')
}

const r = changeName('first_name_second_name')
console.log(r)