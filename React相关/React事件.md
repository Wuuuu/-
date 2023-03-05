### 深入理解 React: 事件机制原理

#### 1.序言

React 有一套自己的事件系统，其事件叫做`合成事件`。为什么 React 要自定义一套事件系统？React 事件是如何注册和触发的？React 事件与原生 DOM 事件有什么区别？

#### 2. DOM 事件流

在了解 React 事件之前，先了解一下 DOM 事件流，其包含三个流程：事件捕获阶段、处于捕获阶段、处于目标阶段和事件冒泡阶段。
**（1）事件捕获阶段、处于目标阶段和事件冒泡阶段**

```HTML
<html>
  <body>
    <div id="outer">
      <p id="inner">Click me!</p>
      </div>
    </body>
  </html>
```

上述代码，点击`<p>`元素，那么 DOM 事件流如下图：![enter image description here](https://img2020.cnblogs.com/blog/898684/202006/898684-20200624143429777-917104228.png)

1.事件捕获阶段：事件对象通过目标节点的祖先 Window 传播到目标的父节点。 2.处于目标阶段：事件对象到达目标节点。如果阻止事件冒泡，那么该事件对象将再次阶段完成后停止传播。 3.事件冒泡阶段：事件对象以相反的顺序从目标节点的父项开始传播，从目标节点的父项开始到 window 结束。

**（2）addEventListener**

DOM 事件流中同时包含了事件捕获阶段和事件冒泡阶段，作为开发者，我们可以选择事件处理函数在哪一个阶段被调用。

** addEventListener()**方法用于为特定元素绑定一个事件处理函数。addEventListener 有三个参数：

```JS
element.addEventListener(event,function, useCapture)
```

| 参数       | 描述                                                                                                                                 |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| event      | 必须；字符串，指定事件名<br>**注意**：不要使用“on”前缀。例如，使用”click“而不是“onclick”                                             |
| function   | 必须；指定要事件触发时执行的函数。<br>当事件对象作为第一个参数传入函数。事件对象的类型取决于特定的事件                               |
| useCapture | 可选；布尔值，指定事件是否在捕获或冒泡阶段执行<br> 可能值：<br> true - 事件句柄在捕获阶段执行<br>false -默认。事件句柄在冒泡阶段执行 |

#### 3.React 事件概述

React 根据 W3C 规范来定义自己的事件系统，期时间被称之为合成事件（SyntheticEvent）。而其自定义事件系统的动机主要包含以下几个方面：
（1）**抹平不同浏览器之间的兼容差异**。最主要的动机。
（2）**事件“合成”，即事件自定义**。事件合成既可以处理兼容问题，也可以用来自定义事件（例如 React 里面的 onChange 事件）
（3）**提供一个抽象平台事件机制**。类似于 VirtualDOM 抽象了跨平台的渲染方式，合成事件（SyntheticEvent）提供一个抽象的跨平台事件机制。
（4）**可以干预事件的分发**。16 版本后引入 Fiber 架构，React 可以用过干预事件的分发以优化用户的交互体验。

> 注：【几乎】所有事件都代理到了 document，说明有例外，比如`audio`,`video`标签的一些媒体事件，是 document 所不具有，这些事件只能够在这些标签上进行代理，但依旧用统一的入口分发函数（dispatchEvent）进行绑定。

#### 4.事件注册

React 的事件注册过程主要做了两件事：document 上注册，存储事件回调。![enter image description here](https://img2020.cnblogs.com/blog/898684/202006/898684-20200624143507392-911347960.png)

(1) document 上注册
在 React 组件挂载阶段，根据组件内的生命的时间类型（onclick，onchange）等， 在 document 上注册事件（使用 addEventListener），并指定统一的回调函数 dispatchEvent。换句话说，document 上不管注册的是什么事件，都具有统一的回调函数 dispatchEvent。也正是因为这一时间委托机制，具有同样的回调函数 dispatchEvent，所以对于同一种事件类型，不论在 document 上注册几次，最终也只会保留一个有效的实例，这样能减少内存开销。

实例代码：

```js
function TestComponent() {
  handleParentClick = () => {
    // ... dosomething
  };

  handleChildClick = () => {
    // ... dosomething
  };

  return (
    <div className="parent" onClick={handleParentClick}>
      <div className="child" onClick={handleChildClick} />
    </div>
  );
}
```

上述代码，事件类型都是`onclick`，由于 React 的事件委托机制，会指定统一的回调函数 dispatchEvent，所以最终只会在 document 上保留一个 click 事件，类似`document.addEventListener('click', dispatchEvent)`，这里也可以看出 React 事件是在 DOM 事件流的冒泡阶段被触发。

（2） 储存事件回调
React 为了在触发事件时可以查找到对应的回调去执行，会把组件内的所有事件统一地放到一个对象中（listenerBank）。而储存方式如上图，首先会根据事件类型分类存储，例如 click 事件相关的统一存储在一个对象中，回调函数的存储采用键值对（key/value）的方式存储在对象中，key 是组件的唯一标志 id, value 对应的就是事件的回调函数。

React 的事件注册关键步骤如下图：![enter image description here](https://img2020.cnblogs.com/blog/898684/202006/898684-20200624143524310-1842672426.png)

#### 5.事件分发

事件分发也就是事件触发。React 的事件触发指挥发生在 DOM 事件流的冒泡阶段，因为在 document 上注册时就默认在冒泡阶段触发执行。

大致流程如下：

1. 触发事件，开始 DOM 事件流，先后经过三个阶段：事件捕获阶段、处于目标阶段和事件冒泡阶段
2. 当事件冒泡到 document 时，触发统一的事件分发函数`ReactEventListener.dispatchEvent`
3. 根据原生事件对象（nativeEvent）找到当前节点（即事件触发节点）对应的 ReactDOMComponent 对象
4. 事件的合成
   4.1 根据当前事件类型生成对应的合成对象
   4.2 封装原生事件对象和冒泡机制
   4.3 查找当前元素以及它所有父级
   4.4 在 listenerBank 中查找事件回调函数并合并成 events 中
5. 批量执行合成事件（events）内的回调函数
6. 如果没有冒泡，会将继续执行 DOM 事件流的冒泡（从 document 到 window）,否则结束事件触发
   ![enter image description here](https://img2020.cnblogs.com/blog/898684/202006/898684-20200624143540789-1118047434.png)

注： 上图中`阻止冒泡`是指调用了`stopImeediaterPropagation`方式阻止冒泡，如果是调用`stopPropagation`阻止冒泡，document 上如果还注册了同类型其他的事件，也将会被触发执行，但会正常阻断 window 上的事件触发。

实例代码：

```js
class TestComponent extends React.Component {
  componentDidMount() {
    this.parent.addEventListener("click", (e) => {
      console.log("dom parent");
    });
    this.child.addEventListener("click", (e) => {
      console.log("dom child");
    });
    document.addEventListener("click", (e) => {
      console.log("document");
    });
    document.body.addEventListener("click", (e) => {
      console.log("body");
    });
    window.addEventListener("click", (e) => {
      console.log("window");
    });
  }

  childClick = (e) => {
    console.log("react child");
  };

  parentClick = (e) => {
    console.log("react parent");
  };

  render() {
    return (
      <div
        class="parent"
        onClick={this.parentClick}
        ref={(ref) => (this.parent = ref)}
      >
        <div
          class="child"
          onClick={this.childClick}
          ref={(ref) => (this.child = ref)}
        >
          Click me!
        </div>
      </div>
    );
  }
}
```

点击click div时，其输出如下：
![''](https://img2020.cnblogs.com/blog/898684/202006/898684-20200624143557043-627913590.png)

在DOM事件流的冒泡阶段先后经历的元素： `child <div>` -> `parent <div>` -> `<body>` -> `<html>` -> `document` -> `window`，因此上面的输出符合预期。

#### 6. 总结
**React合成事件和原生DOM事件的主要区别：**
（1） React组件上声明的事件没有绑定在React组件对应的原生DOM节点上。
（2） React利用事件委托机制，将机会所有事件的触发代理（delegate）在document节点上，事件对象（event）是合成对象，不是原生事件对象，但通过nativeEvent属性访问原生事件对象。
（3） 由于React的事件委托机制，React组件对应的原生DOM节点上的事件触发时机总是在React组件上的事件之前。