function getQueryStr(str) {
  let result = {}
  str.split('?')[1].split('&').forEach(s => {
    let key = s.split('=')[0]
    let value = s.split('=')[1]
    result[key] = value
  });
  return result
}

const r = getQueryStr('https://space.bilibili.com/378372969/video?tid=36&page=2&keyword=&order=pubdate')
console.log(r)

// URLSearchParams
function getQueryObj(url) {
  const queryStr = url.split('?')[1];
  const u = new URLSearchParams(queryStr);
  let obj = {};
  for(let p of u.entries()) {
    obj[p[0]] = p[1];
  }
  
  return obj;
}

const url = 'https://space.bilibili.com/378372969/video?tid=36&page=2&keyword=&order=pubdate'
console.log(getQueryObj(url));
