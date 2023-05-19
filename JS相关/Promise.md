### 手写 Promise

```js
class Promise {
  constructor(executor) {
    this.state = "pending"; // 'pending' | 'fulfilled' | 'rejected'
    this.value = undefined;
    this.reason = undefined;
    this.onResolvedCallbacks = [];
    this.onRejectdCallbacks = [];

    const resolve = (value) => {
      if (state === "pending") {
        this.state = "fulfiled";
        this.value = value;
        this.onResolvedCallbacks.forEach((fn) => fn());
      }
    };

    const reject = (reason) => {
      if (state === "pending") {
        this.state = "rejected";
        this.reason = reason;
        this.onRejectedCallbacks.forEach((fn) => fn());
      }
    };

  // 执行executor， 如果遇见报错 直接执行reject方法
    try {
      executor(resove, reject);
    } catch(err) {
      reject(err)
    }

    // 实现then方法
    then(onFulfilled, onRejected) {
      if(this.state === 'fulfilled') {
        onFulfilled(this.vaule)
      } else if(this.state === 'rejected') {
        onRejected(this.reason)
      } else {
        this.onResolvedCallbacks.push(onFulfilled)
        this.onResolvedCallbacks.push(onRejected)
      }
    }
  }
}
```
