### 什么是JsBridge?

JsBridge 是一种Webview和native进行通信的手段，Webview可以用过JsBridge调用native的能力，native也可以通过JsBridge在webview上执行一些逻辑，

### JsBridge的实现方式

- 注入API
- 拦截URL SCHEME

在比较流行的JsBridge中，主要是通过拦截URL请求来达到native端和Webview端相互通信的效果。

#### 注入API
主要原理是，通过Webview提供的接口，向JavaScript的Context(window)中注入对象或者方法，让JavaScript调用，直接执行相应的Native代码逻辑，达到JavaScript调用Native的目的。

#### 拦截URL SCHEME

URL SCHEME是一种类似于url的链接，为了方便 app直接互相调用设计的，形式和普通Url相似，主要区别是protocol和host一般是自定义的，例如： qunarhy://hy

拦截URL SCHEME的主要流程是： Web端通过某种方式（比如iframe.src）发送URL Scheme请求，之后Native拦截到请求并根据URL Scheme进行相关操作

> 弊端
> - 使用iframe.url 发送URL SCHEME会有长度的隐患。
> - 创建请求，需要一定的耗时，比注入API的方式耗时更长。
