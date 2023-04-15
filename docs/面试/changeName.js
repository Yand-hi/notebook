function changeName(str) {
  let arr = [];
  str.split('_').forEach((s, index) => {
    index === 0 ? arr.push(s) : 
    arr.push(s[0].toUpperCase() + s.slice(1, s.length))
  });

  return arr.join('')
}

function changeNameII(str) {
  const temp = str.split('_');
  let result = '';
  temp.forEach((item, index) => {
    if (index === 0) result += item;
    else {
      item = item[0].toUpperCase() + item.slice(1, item.length);
      result += item;
    } 
  });
  return result;
}

const r = changeName('first_name_second_name')
const r2 = changeNameII('first_name_second_name')
console.log(r, r2)