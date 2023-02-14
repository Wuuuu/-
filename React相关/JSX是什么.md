### JSX是什么，它和js 有什么区别

jsx是React的语法糖，它允许在html中写js，他不能被浏览器直接识别，需要通过webpack、babel之类的编译工具转化为js执行。

#### 为什么文件中没有使用到React, 也要在文件顶部 import React from 'react'

只要使用了jsx，就需要引用React，因为jsx的本质就是React.creatElement

#### React组件为什么不能返回多个元素
1. React组件最后也会编译为render函数，函数的返回值只能是1个，如果不用单独的根节点包裹，就会并列返回多个值，这在js中是不允许的

2. React的虚拟DOM是一个树状结构，树的根节点只能是1个，如果有多个根节点，无法确认是在哪棵树上进行更细的

#### React组件如何可以返回多个组件

- 使用HOC（高阶函数）
- 使用React.Fragment
- 使用数组返回