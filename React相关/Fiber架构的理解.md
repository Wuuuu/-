##### Fiber出现在React16版本，在15及以前的版本，React更新DOM都是使用递归的方式进行遍历，每次更新都会从应用根部递归执行，且一旦开始，无法中断，这样层级越来越深，结构复杂度高的项目就会出现明显的卡顿。fiber架构出现就是为了解决这个问题，fiber是在React中最小粒度的执行单元，可以将fiber理解为是React的虚拟DOM。在React中，更新fiber的过程叫做调和，每一个fiber都可以作为一个执行单元进行处理，同时每个fiber都有一个优先级lane（16版本是expirationTime）来判断是否还有空间或时间来执行更新，如果没有时间更新，就会把主动权交给浏览器去做一些渲染（如动画、重排、重绘等），用户就不会感觉到卡顿。然后，当浏览器空闲了（requestIdleCallback），就通过scheduler（调度器）将执行恢复到执行单元上，这样本质上是中断了渲染，不过题改了用户的体验。React实现的fiber模式是一个具有链表和指针的异步模型。

##### fiber作为react创建的element和真实DOM之间的桥梁，每一次更新的触发会在React element发起，经过fiber的调和，然后更新到真实DOM上。fiber上标识了各种不同类型的element，同时记录了对应和当前fiber有关的其他fiber信息（return指向父级、child指向子级、sibling指向兄弟）。
在React应用中，应用首次构建时，会创建一个fiberRoot作为整个React应用的根基。然后当ReactDOM.render渲染出来时，会创建一个rootFiber对象（一个Ract应用可以用多个rootFiber，但只能有一个fiberRoot），当一次挂载完成时，fiberRoot的current属性会指向对应rootFiber。挂载完成后，会进入正式渲染阶段，在这个阶段必须知道一个workInProgerss树（它是正在内存在构建的Fiber树，在一次更新中，所有的更新都发生在workInProgeress树上，更新完成后，将变成current树用于渲染视图）,当前的current树（rootFiber）的alternate会作为workInProgerss，同时会用alternate将workInProgress与current树进行关联（该关联只有在初始化第一次创建alternate时进行）。

### 一 前言

**参考问题：**
- 什么是fiber ? Fiber 架构解决了什么问题？ 
- Fiber root 和 root fiber 有什么区别？ 
- 不同fiber 之间如何建立起关联的？
- React 调和流程？
- 两大阶段 commit 和 render 都做了哪些事情？
- 什么是双缓冲树？ 有什么作用？
- Fiber 深度遍历流程？
- Fiber的调和能中断吗？ 如何中断？

#### 什么是Fiber?
> Fiber英文原意是“纤维”， React16版本提出fiber概念，目的是解决大型应用卡顿，fiber在React中是最小颗粒的执行单元，无论React和Vue在遍历更新每个节点时都不是用的真实DOM，都采用的是虚拟DOM，所以可以理解fiber就是React的虚拟DOM。 

#### 为什么要用fiber

在`React 15`以前，React对于虚拟DOM是采用的递归的方式遍历更新的，比如一次更新，就会从英勇的根部递归更新，递归一旦开始，中途就无法中断，随着项目越发复杂。层级越深，导致更新的时间越来越长，在前端交互上的体验就会边卡顿。

`React 16`为了解决卡顿问题引入了`fiber`，为什么它能够解决卡顿，更新`fiber`的过程叫做`Reconciler(调和器)`，每一个fiber都可以作为一个执行单元来处理，所以每一个fiber可以根据自身的过期时间`expirationTime`（V17版本叫做优先级`lane`）来判断是否还有空间时间执行更新。如果没有时间更新，就会把主动权交个浏览器去与渲染，做一些动画，重排，重绘一类的事情，就这样给用户感觉不会很卡。然后等浏览器空余时间，在通过`scheduler(调度器)`，再次恢复执行单元上来，这样就能本质上中断渲染，提高用户体验。


### 二 全面认识Fiber
<hr />
#### 1. element, fiber, dom三种什么关系？
- element是React视图层在代码层级上的表现，也就是开发写的jsx语法，写的元素结构，都会被创建成的element对象的形式。上面保存了props, children等信息。
- DOM是元素在浏览器上给用户的直观表现。
- fiber可以说是element和真实DOM之间的交流枢纽站，一方面每一个类型的element都有一个与之对应的fiber类型，element变化引起更新流程都是通过Fiber层面做一次调和改变，然后对于元素，形成新的DOM做视图渲染。

结构如下图:
![图片](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0a90368f24f0477aaf0d446a8f6736db~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)


首先来看下element与fiber之间的对应关系
```js
export const FunctionComponent = 0; // 对应函数组件
export const ClassComponent = 1;    // 对应类组件
export const IndeterminateComponent = 2; //初始化的时候不知道是函数组件还是类组件
export const HostRoot = 3; // Root Fiber 可以理解为根元素。通过reactDom.render()产生的根元素
export const HostPortal = 4; //对应 React.createPortal产生的Portal
export const HostComponent = 5; // dom元素 比如<div>
export const HostText = 6; // 文本节点
export const Fragement = 7; // 对应<React.Fragment>
export const Mode = 8; // 对应<React.StricMode>
export const ContextConsumer = 9; // 对应<Context.Consumer>
export const ContextProvider = 10; // 对应<Context.Provider>
export const ForwardRef = 11; // 对应React.ForwardFef
export const Profiler = 12; // 对应<Profiler />
export const SuspenseComponent = 13; // 对应<Suspense>
export const MemoComponent = 14; // 对应 React.memo返回的组件
```

#### 2 fiber保存了那些信息

刚才说到fiber作为element和真实DOM元素的沟通枢纽，那么一个fiber上到底保存了那些信息呢？

> react-reconciler/src/ReactFiber.js 

```js
function FiberNode(){
  this.tag = tag;                       // fiber标签 证明是什么类型的fiber
  this.key = key;                       // key 调和子节点时 使用
  this.type = null;                     // dom元素对应的元素类型，比如div，组件指向组件对应的类或者函数
  this.stateNode = null;                // 指向对应的真实dom元素，类组件指向组件实例， 可以被ref获取

  this.return = null;                   // 指向父级的fiber
  this.child = null;                    // 指向子级的fiber
  this.sibling = null;                  // 指向兄弟fiber
  this.index = 0;                       // 索引

  this.ref = null;                      // ref指向， ref函数， 或者ref对象。

  this.pendingProps = pendingProps;     // 在上一次更新中，代表element被创建
  this.memoizedProps = null;            // 记录上一次更新完毕后的props
  this.updateQueue = null;              // 类组件存放在setState更新队列，函数组件存放
  this.memoizedState = null;            // 类组件存放state信息，函数组件保存hooks信息， dom元素为null

  this.mode = mode;                     // 描述fiber树的模式，比如ConcurrentMode 模式

  this.effectTag = NoEffect             // effect标签，用于收集effectList
  this.nextEffect = null;               // 指向下一个effect

  this.expirationTime = NoWork;         // 通过不同过期时间，判断任务是否过期， 在v17版本用lane表示

  this.alternate = null;                // 双缓存树，指向缓存的fiber。更新阶段两颗树互相交替
}
```

#### 三 Fiber更新机制
##### 初始化
fiber时如何工作的：
**第一步：创建fiberRoot和rootFiber**
- `fiberRoot`: 首次构建应用，创建一个fiberRoot,作为整个React应用的根基。
- `rootFiber`: 通过render渲染出来，如上Index可以作为一个rootFiber。一个React应用可以有多个render创建的rootFiber,但是只能有一个fiberRoot(应用根节点)

第一次挂载过程中，会将fiberRoot和rootFiber建立起关联
> react-reconciler/src/ReactFiberRoot.js

```js
function createFiberRoot(containerInfo, tag) {
  /* 创建一个Root */
  const root = new FiberRootNode(containerInfo, tag);
  const rootFiber = createHostRootFiber(tag);
  root.current = rootFiber;
  return root;
}
```

**第二步： workInProgress和current**
经过第一步处理，开始到正式渲染阶段，会进入beginwork流程

- workInProgress: 正在内存中构建的Fiber树，称为workInProgress Fiber树。在一次更新中，所有的更新都是发生在workInProgress树上。再一次更新后，workInProgress树上的状态时最新的状态。那么将变成current树用于视图渲染
- current: 正在视图层渲染的树叫做current树。