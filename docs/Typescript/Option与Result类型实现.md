:::tip
ts 本身并没有内置 `Option` 和 `Result` 类型，在处理一些用户输入、数据查询、或者异步操作、文件读写、网络请求等需要处理错误的情况时无法提供方便快捷的类型支持，所以需要自己进行简单的封装。
:::

# Option 类型

`Option` 类型表示一个可能存在也可能不存在的值。它有两个可能的值：`Some` 表示存在值，`None` 表示不存在值。

## 实现一个 `Option`

```ts
class Some<T> {
  constructor(private value: T) {}

  get() {
    return this.value;
  }
}

class None {
  get() {
    throw new Error("value doesn't exist");
  }
}

type Option<T> = Some<T> | None


// 使用示例
function Some<T>(value: T): Option<T> {
  return new Some(value)
}

function None() {
  return new None();
}

const someValue: Option<number> = Some(42);
const noneValue: Option<string> = None();

console.log(someValue.get()); // 输出: 42
console.log(noneValue.get()); // 输出: Error: value doesn't exist

```

## Result 类型

`Result` 类型表示一个可能成功也可能失败的操作的结果。它有两个可能的值：`Ok` 表示成功，包含成功的值，`Err` 表示失败，包含错误信息

## 实现一个 `Result`

```ts
class Ok<T, E> {
  constructor(private value: T) {}

  get() {
    return this.value;
  }
}

class Err<T, E> {
  constructor(private error: E) {}

  getError() {
    return this.error;
  }
}

type Result<T, E> = Ok<T, E> | Err<T, E>;

function Ok<T, E>(value: T): Result<T, E> {
  return new Ok(value);
}

function Err<T, E>(error: E): Result<T, E> {
  return new Err(error);
}

// 使用示例
const successResult: Result<number, string> = Ok(42);
const errorResult: Result<string, string> = Err("Something went wrong");

console.log(successResult.get()); // 输出: 42
console.log(errorResult.getError()); // 输出: Something went wrong

```