function endWithChar(str, demo = 'aenou') {
  const lastChar = str[str.length - 1].toLowerCase();
  return demo.split('').some(s => s===lastChar);
}

function endWithCharII(str) {
  return (/['aenou']$/i).test(str);
}

console.log(endWithCharII('eraqzsdhte'));
console.log(endWithCharII('ardrxastrA'));
console.log(endWithCharII('grzcdfdxzhw'));
console.log(endWithCharII('gfvfgfaXps'));
console.log(endWithCharII('vfaswxanhu'));