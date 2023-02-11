### React 18新特性
1. setState自动批处理

在React18之前，只有React事件会进行批处理，原生js事件、promise、setTimeout、setInterval不会

在React18，将所有事件都进行批处理，即多次setState会被合并为1次执行，提高了性能，在数据层，将多个状态更新合并成一次处理（在视图层，将多次渲染合并成一次渲染）

2. 引入了新的root API, 支持new concurrent renderer(并发模式的渲染)

```JS
React 17

import App './App';

const root = document.getElementId("root")
ReactDom.render(root, <App />)
// 卸载
ReactDom.unmountComponentAtNode(root)
---------------------------
React 18
const root = document.getElementId("root")
ReactDom.creatRoot(root).render(<App />)
// 卸载
root.unmont()
```

3. 去掉了对ie 浏览器的支持

4. flushSync 
> 批量更新是一个破坏新的更新，如果想退出批量更新，可以使用flushSync
```js

const [count, setCount] = useState(0);

// 不执行批量更新
flushSync(() => {
  setState(count => count + 1)
})
```

5. React组件返回值更新
- 在React17中，返回空组件只能返回null，显示返回undefined会报错
- 在React18中，支持null和undefined空返回

6. strict mode更新  
当你使用严格模式时，React会对每个组件返回两次渲染，以便你观察一些意想不到的结果，在React17中去掉了一次渲染的控制台日志，以便让日志容易阅读。React18取消了这个限制，第二次渲染会以浅灰色出现在控制台日志

7. 支持useId  
在服务器和客户端生成相同的唯一一个id,表面hydrating的不兼容

8. useSyncExternalStore  
用于解决外部数据撕裂问题

9. useInsertionEffect  
这个hooks建议只在css in js库中使用，这个hooks执行时机在DOM生成以后，useLayoutEffect执行之前，它的工作原理大致与useLayoutEffect相同，此时无法访问Dom节点的引用，一般用于提前注入脚本。

10. Concurrent Mode  
并发模式不是一个功能，而是一个底层设计。  
它可以帮助应用保持响应，根据用户的设备性能和网速进行调整，它通过渲染可中断来修复阻塞机制。在`concurrent`模式中，React可以同事更新多个状态  

区别就是使用`同步不可中断更新`变成了`异步可中断更新`