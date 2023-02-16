### React 生命周期

#### 1. React 有哪些生命周期
- constructor
- getDerivedStateFromProps
- componentWillMount
- componentWillReceiveProps
- componentWillUpdate
- render
- getSnapshotBeforeUpdate
- componentDidUpdate
- componentDidMount
- shouldComponentUpdate
- componentWillUnmount

#### 2. 各个生命周期中做的事情

**2.1** constructor

在类组件的构造函数中，我们一般可以做一下事情：   
 1. 初始化组件的state
 2. 对事件处理函数做处理，绑定this
 3. 对类组件进行生命周期劫持，渲染劫持

 **2.2** getDerivedStateFromProps

 1. 用于替代`componentWillReceiveProps` 和 `componentWillMount`
 2. 组件初始化或更新时将props映射到state
 3. 返回值与State合并后可作为`shouldComponentUpdate` 生命周期钩子的第二个参数`newState`