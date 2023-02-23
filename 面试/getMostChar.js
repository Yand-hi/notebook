function getMostChar(str) {
  let obj = {};
  for (let i = 0; i < str.length; i++) {
    if (obj[str[i]]) {
      obj[str[i]]++
    } else {
      obj[str[i]] = 1;
    }
  }
  let maxNum = 0;
  let maxChar;
  console.log(obj);
  for (const key in obj) {
    if (obj[key] > maxNum) {
      maxNum = obj[key];
      maxChar = key;
    }
  }
  return {
    maxChar,
    maxNum
  }
}

const r = getMostChar('asxasdcausdara');
console.log(r);