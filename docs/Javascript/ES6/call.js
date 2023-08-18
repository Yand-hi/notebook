Function.prototype.myCall = function (context) {
  context = context || window;
  context.fn = this;
  let args = [];
  for (let i = 1; i < arguments.length; i++) {
    args.push('arguments[' + i + ']');
  }
  let result = eval('context.fn(' + args + ')');
  delete context.fn;
  return result;
}

function test() {
  console.log(this.name);
}
let obj = {
  name: 'aaa'
};

test.myCall(obj);
