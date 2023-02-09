### call apply bind

三个方法可以改变函数整体内部<font color=#dd5044>**this**</font>的指向

举个例子

```js
const person = {
  name: "xiaoming",
  age: 25,
};

function personInfo(job) {
  console.log(`姓名：${this.name}，年龄${this.age}, 职业：${job}`);
}
personInfo.call(person, "前端");
personInfo.apply(person, ["后端"]);
personInfo.bind(person, "产品经理")();
```

对于对象 person 来说，并没有 personInfo 这样的方法，通过 call/apply/bind 就可以将外部 personInfo 方法用于这个对象中，其中就是 personInfo 内部的 this 指向了 person 这个对象。

### call

**call**是属于所有**Function**的方法，也就是**Function.prototype.call**

> call()方法调用一个函数，其具有一个指定的 this 值和分别地提供的参数。

它的语法如下：

> fun.call(thisArg[,arg1[,arg2,...]]);

### apply

**apply**是属于所有**Function**的方法，也就是**Function.prototype.apply**

> apply()方法调用一个函数，其具有一个指定的 this 值,以及作为一个数组（或类似数组的对象）提供的参数。

它的语法如下：

> fun.call(thisArg[,arg1[,arg2,...]]);

实现一个 apply

```js
Function.prototype.myApply = function (ctx) {
  ctx.fn = this || window;
  const fn = Symbol();
  ctx[fn] = this;
  const args = arguments[1];
  if (args === undefined) {
    ctx.fn();
  } else {
    ctx.fn(...args);
  }
  delete ctx.fn;
};
```

### bind

> bind()方法创建一个新的函数，当被调用时，将其 this 关键字设置为提供的值，在调用新函数时，在任何提供之前提供一个给定的参数序列。

语法：

> fun.bind(thisArg[,arg1, arg2[, ...]])

可以看出，bind 会创建一个新函数（称之为绑定函数），原函数的一个拷贝，也就说不会像 apply、call 那样立即执行

## 总结

- 三者都是用来改变函数的 this 指向
- 三者的第一个参数都是 this 指向的对象
- bind 返回一个绑定函数可稍后执行，call、apply 则是立即执行
- 三者都可以给定参数传递
- call 给定参数需要将参数全部列出, apply 给定参数数组

手写 Bind

```JS
Function.prototype.myBind = function(ctx){
  if(typeof this !== 'function') {
    throw new TypeError(`${this} must be a function`)
  }
  const self = this;
  const args = [].slice.call(arguments, 1)
  const bindFn = function(){
    const bindArgs = [].slice.call(arguments)
    return self.apply(ctx, args.concat(bindArgs))
  }
  return bindFn;
}
```
