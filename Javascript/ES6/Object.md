# Object.defineProperty()

```js
const object = {};

Object.defineProperty(object, 'property', {
  value: 42,
  writable: false
});
```

**`getter` 和 `setter`**

```js
function Archiver() {
  var temperature = null;
  var archive = [];

  Object.defineProperty(this, 'temperature', {
    get: function() {
      console.log('get!');
      return temperature;
    },
    set: function(value) {
      temperature = value;
      archive.push({ val: temperature });
    }
  });

  this.getArchive = function() { return archive; };
}

var arc = new Archiver();
arc.temperature; // 'get!'
arc.temperature = 11;
arc.temperature = 13;
arc.getArchive(); // [{ val: 11 }, { val: 13 }]
```

**继承属性**

如果访问者的属性是被继承的，它的 get 和 set 方法会在子对象的属性被访问或者修改时被调用。如果这些方法用一个变量存值，该值会被所有对象共享。

```js
function Vue() {
}

var value;
Object.defineProperty(Vue.prototype, "data", {
  get() {
    return value;
  },
  set(data) {
    value = data;
  }
});

var a = new Vue();
var b = new Vue();
a.data = 1;
console.log(b.data); // 1
```