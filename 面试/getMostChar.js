function getMostChar(str) {
  let obj = {};
  let result = {maxChar: '', maxNum: 0};
  for (let i = 0; i < str.length; i++) {
    if (obj[str[i]]) {
      obj[str[i]]++
    } else {
      obj[str[i]] = 1;
    }
    if (obj[str[i]] > result.maxNum) {
      result.maxChar = str[i];
      result.maxNum = obj[str[i]];
    }
  }
  return result;
}

const r = getMostChar('asxasdcausdara');
console.log(r);