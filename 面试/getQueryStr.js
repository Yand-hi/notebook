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