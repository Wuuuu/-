### 事件循环
`Event Loop`即事件循环，是指浏览器或`Node`的一种解决`JavaScript`单线程运行时不会阻塞的一种机制，也就是我们经常使用的**异步**的原理。                                

在`JavaScript`中，任务被分为两种，一种宏任务（`MacroTask`）也叫`Task`，一种叫微任务（`MicroTask`）


#### MacroTask(宏任务)
- `script`全部代码、`setTimeout`、`setInterval`、`setImmediate`(浏览器暂时不支持，只有IE10支持)、`I/O`、`UI Rendering`。

#### MincroTask(微任务)
- `Process.nextTick(node独有)`、`Promise`、`Object.observe(废弃)`、`MutationObserver`

### 浏览器中的Event Loop
`JavaScript`中有一个`main thread`主线程和`call-stack`调用栈（执行栈），所有的任务都会被放到调用栈等待主线程执行。

#### js调用栈
js调用栈采用的是后进先出的规则，当函数执行的时候，会被添加到栈的顶部，当执行栈执行完成后，就会从栈顶移出，直到栈内被清空。

#### 同步任务和异步任务
`JavaScript`单线程任务被分为`同步任务`和`异步任务`，同步任务会在调用栈中按照顺序等待主线程 依次执行，异步任务会在异步任务有了结果后，将注册的回调函数放入任务队列中等待主线程空闲的时候（调用栈被清空），被读取到栈内等待主线程的执行。

任务队列`Task Queue`，即队列，是一种先进先出的一种数据结构